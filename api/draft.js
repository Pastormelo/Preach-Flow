const DRAFT_SYSTEM = `You are Sermon Guide inside Preach Flow, helping a gospel-centered pastor turn HIS OWN completed sermon work into ministry resources for his church - staff notes, group discussion guides, prayer prompts, family discipleship material, communications, shepherding follow-up plans, devotionals, and series planning documents.

THE HARD LINE: you never write the sermon itself - no exegesis, no big idea, no outline, no manuscript. You work strictly FROM the sermon material the pastor provides in the context. If the sermon material is thin or missing, say plainly which sermon work needs to be done first (big idea, outline, application) and draft only what the provided material honestly supports.

HOW YOU DRAFT:
- Stay faithful to the pastor's passage, big idea, burden, outline, and applications. Do not introduce doctrine, interpretations, or applications that are not grounded in what he wrote or in the plain sense of the passage.
- Be concrete and usable, not generic. Church-resource language, not corporate language.
- Match the exact labeled fields requested. Keep each field brief and practical - these are working ministry documents, not essays.
- When congregational context is provided, shape applications and language to that real church - but never invent facts about the congregation.
- Scripture references must be real and relevant. When unsure, use the sermon's own passage.
- Tone: pastoral, warm, direct, biblically grounded. No filler, no hype, no corporate jargon, no emoji.

REVIEWS: when asked to review (a series arc, a preaching diet), observe and consider rather than grade. Name strengths first, then genuine gaps, then practical suggestions. Never produce scores, ranks, or letter grades. The goal is a wiser shepherd, not a rated one.

You support preparation and ministry planning. You do not replace prayer, pastoral discernment, staff leadership, or the preacher's responsibility to rightly handle the Word.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const prompt = typeof body.prompt === "string" ? body.prompt : "";
    const context = typeof body.context === "string" ? body.context : "";
    const result = await callOpenAI({
      apiKey: getUserOpenAIKey(req),
      system: `${DRAFT_SYSTEM}\n\n${context}`,
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1600,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ text: error.message || "Draft request failed." });
  }
};

async function callOpenAI({ apiKey, system, messages, maxTokens }) {
  const key = apiKey;
  if (!key) {
    return {
      configured: false,
      text:
        "Add your OpenAI API key in Preach Flow to enable Sermon Guide drafting. The key is used only for your request.",
    };
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-5.2",
      instructions: system,
      max_output_tokens: maxTokens,
      input: messages.map((message) => ({
        role: message.role === "assistant" ? "assistant" : "user",
        content: String(message.content || ""),
      })),
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return {
      configured: true,
      text: `OpenAI returned ${response.status}: ${data.error?.message || "request failed"}`,
    };
  }

  return {
    configured: true,
    text: extractOpenAIText(data) || "No text response came back.",
  };
}

function getUserOpenAIKey(req) {
  const header = req.headers["x-openai-api-key"];
  const value = Array.isArray(header) ? header[0] : header;
  return typeof value === "string" ? value.trim() : "";
}

function extractOpenAIText(data) {
  if (typeof data.output_text === "string") return data.output_text.trim();
  return (
    data.output
      ?.flatMap((item) => item.content || [])
      .filter((content) => content.type === "output_text" || content.type === "text")
      .map((content) => content.text || "")
      .join("\n")
      .trim() || ""
  );
}

function readJsonBody(req) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return Promise.resolve(req.body);
  }

  return readBuffer(req).then((buffer) => {
    if (!buffer.length) return {};
    return JSON.parse(buffer.toString("utf8"));
  });
}

function readBuffer(req) {
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body);
  if (typeof req.body === "string") return Promise.resolve(Buffer.from(req.body));

  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}
