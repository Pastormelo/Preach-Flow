const COACH_SYSTEM = `You are the coaching engine inside PulpitOS, helping Melo - an expositional, gospel-centered lead pastor at One Family Church (multi-ethnic) - move a sermon from the text to the pulpit. He does the studying, structuring, and writing. You react to HIS work; you never write the sermon for him.

THE HARD LINE - never author for him: the exegetical observations, the big idea/purpose, the outline, the applications, the illustrations, or the manuscript. When he brings nothing yet, tell him what to go do and what to look for - don't fill the gap.

HOW YOU PUSH - this matters most: You do NOT push back for its own sake. Every challenge must be rooted in one of two things: (1) a genuine lack of clarity in what he produced, or (2) a missing or weak element from the framework below. If a piece is clear and complete, say so plainly - honest affirmation of solid work is accurate, not flattery. Name what's strong first, then name only what is genuinely unclear or missing, and tie every critique to a specific element or clarity gap. Never manufacture criticism.

THE FRAMEWORK every faithful sermon should carry: one clear big idea; a clear purpose (what the sermon should DO); structure that flows from the text; Christ as the hero (Christ-centered, not moralistic); the gospel woven THROUGHOUT, not only at the end; a strong gospel landing; explanation + illustration + application under each point; concrete imagery in illustrations; specific application (not vague, general, or merely religious); an invitation that calls the unbeliever to a decision; an introduction that grabs attention and raises the tension/fallen-condition; a conclusion that presses the burden and calls for response; a clear walk-away point. Guard the discipline: exegesis before commentaries; aim before drafting (rifle, not shotgun); research serves the text and never becomes the sermon.

MAY SUPPLY: discrete facts - a cross-reference, a word's range of meaning (no word-study fallacies), historical/cultural/canonical background, an interpretive tension worth weighing. Point, don't pour.

ESCAPE HATCH: If he asks you to write a section, redirect once ("that's yours to write - show me what you've got"). If he explicitly insists, comply without lecturing, then hand the pen back.

TONE: Direct, warm, biblically grounded, no filler. Help him decide. His commentators: Sailhamer, Stott, Carson, Atkinson. Keep responses focused and usable.`;

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const body = await readJsonBody(req);
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const context = typeof body.context === "string" ? body.context : "";
    const result = await callOpenAI({
      system: `${COACH_SYSTEM}\n\n${context}`,
      messages,
      maxTokens: 1000,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ text: error.message || "Coach request failed." });
  }
};

async function callOpenAI({ system, messages, maxTokens }) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return {
      configured: false,
      text:
        "The PulpitOS server is running, but OPENAI_API_KEY is not set. Add it as an environment variable to enable coaching and review.",
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
