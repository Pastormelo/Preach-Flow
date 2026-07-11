// Provider-agnostic Sermon Guide engine, shared by every API route.
//
// Key resolution, in order:
//   1. A user's own OpenAI key (x-openai-api-key header) — always honored,
//      so power users can run on their own quota.
//   2. The app-provided key from the environment (AI_API_KEY, falling back
//      to OPENAI_API_KEY). App-provided calls require a signed-in user
//      whenever Supabase auth is configured, so public visitors can't
//      consume the deployment's quota.
//
// Providers: openai (default), anthropic, gemini, groq — pick with
// AI_PROVIDER, override the model with AI_MODEL.

const PROVIDER_DEFAULT_MODELS = {
  openai: "gpt-5.2",
  anthropic: "claude-sonnet-5",
  gemini: "gemini-flash-latest",
  groq: "llama-3.3-70b-versatile",
};

function engineConfig() {
  const apiKey = (process.env.AI_API_KEY || process.env.OPENAI_API_KEY || "").trim();
  let provider = (process.env.AI_PROVIDER || "openai").trim().toLowerCase();
  if (!PROVIDER_DEFAULT_MODELS[provider]) provider = "openai";
  const model = (process.env.AI_MODEL || process.env.OPENAI_MODEL || "").trim() || PROVIDER_DEFAULT_MODELS[provider];
  return { apiKey, provider, model };
}

function headerValue(req, name) {
  const value = req.headers[name];
  const single = Array.isArray(value) ? value[0] : value;
  return typeof single === "string" ? single.trim() : "";
}

function getUserOpenAIKey(req) {
  return headerValue(req, "x-openai-api-key");
}

// When Supabase auth is configured, app-provided calls must carry a valid
// session token. When it isn't configured (local dev), there is no account
// system to gate on, so calls pass through.
async function verifySignedIn(req) {
  const url = (process.env.SUPABASE_URL || "").trim();
  const anonKey = (process.env.SUPABASE_ANON_KEY || "").trim();
  if (!url || !anonKey) return true;
  const token = headerValue(req, "x-preachflow-auth");
  if (!token) return false;
  try {
    const response = await fetch(`${url.replace(/\/$/, "")}/auth/v1/user`, {
      headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function callEngine(req, { system, messages, maxTokens = 1000 }) {
  const cleanMessages = (Array.isArray(messages) ? messages : []).map((message) => ({
    role: message.role === "assistant" ? "assistant" : "user",
    content: String(message.content || ""),
  }));

  const ownKey = getUserOpenAIKey(req);
  if (ownKey) {
    return callOpenAI({
      key: ownKey,
      model: (process.env.AI_MODEL || process.env.OPENAI_MODEL || "").trim() || PROVIDER_DEFAULT_MODELS.openai,
      system,
      messages: cleanMessages,
      maxTokens,
    });
  }

  const config = engineConfig();
  if (!config.apiKey) {
    return {
      configured: false,
      text: "Sermon Guide isn't configured on this deployment yet — the site owner needs to add AI_API_KEY in the hosting environment. (You can also add your own OpenAI key in the app.)",
    };
  }
  if (!(await verifySignedIn(req))) {
    return {
      configured: false,
      needsAuth: true,
      text: "Sign in to use Sermon Guide — it's included with your account.",
    };
  }

  const args = { key: config.apiKey, model: config.model, system, messages: cleanMessages, maxTokens };
  if (config.provider === "anthropic") return callAnthropic(args);
  if (config.provider === "gemini") return callGemini(args);
  if (config.provider === "groq") return callGroq(args);
  return callOpenAI(args);
}

async function callOpenAI({ key, model, system, messages, maxTokens }) {
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      instructions: system,
      max_output_tokens: maxTokens,
      input: messages,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { configured: true, text: `The engine returned ${response.status}: ${data.error?.message || "request failed"}` };
  }
  const text =
    typeof data.output_text === "string"
      ? data.output_text.trim()
      : data.output
          ?.flatMap((item) => item.content || [])
          .filter((content) => content.type === "output_text" || content.type === "text")
          .map((content) => content.text || "")
          .join("\n")
          .trim() || "";
  return { configured: true, text: text || "No text response came back." };
}

async function callGroq({ key, model, system, messages, maxTokens }) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { configured: true, text: `The engine returned ${response.status}: ${data.error?.message || "request failed"}` };
  }
  return { configured: true, text: (data.choices?.[0]?.message?.content || "").trim() || "No text response came back." };
}

async function callAnthropic({ key, model, system, messages, maxTokens }) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({ model, max_tokens: maxTokens, system, messages }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { configured: true, text: `The engine returned ${response.status}: ${data.error?.message || "request failed"}` };
  }
  const text = (data.content || [])
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
  return { configured: true, text: text || "No text response came back." };
}

async function callGemini({ key, model, system, messages, maxTokens }) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        generationConfig: { maxOutputTokens: maxTokens },
        contents: messages.map((message) => ({
          role: message.role === "assistant" ? "model" : "user",
          parts: [{ text: message.content }],
        })),
      }),
    },
  );
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return { configured: true, text: `The engine returned ${response.status}: ${data.error?.message || "request failed"}` };
  }
  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text || "")
    .join("\n")
    .trim();
  return { configured: true, text: text || "No text response came back." };
}

module.exports = { callEngine, engineConfig, getUserOpenAIKey };
