import http from "node:http";
import { createRequire } from "node:module";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const { callEngine, engineConfig } = require("./api/_engine.js");
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PORT = Number(process.env.PORT || 4173);
const MODEL = process.env.OPENAI_MODEL || "gpt-5.2";
const MAX_BODY = 12 * 1024 * 1024;

let JSZip = null;
try {
  JSZip = require("jszip");
} catch {
  JSZip = null;
}

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

const COACH_SYSTEM = `You are the coaching engine inside Preach Flow, helping a gospel-centered preacher move a sermon from the text to the pulpit. The preacher does the studying, structuring, and writing. You react to THEIR work; you never write the sermon for them.

THE HARD LINE - never author for the preacher: the exegetical observations, the big idea/purpose, the outline, the applications, the illustrations, or the manuscript. When they bring nothing yet, tell them what to go do and what to look for - don't fill the gap.

HOW YOU PUSH - this matters most: You do NOT push back for its own sake. Every challenge must be rooted in one of two things: (1) a genuine lack of clarity in what they produced, or (2) a missing or weak element from the framework below. If a piece is clear and complete, say so plainly - honest affirmation of solid work is accurate, not flattery. Name what's strong first, then name only what is genuinely unclear or missing, and tie every critique to a specific element or clarity gap. Never manufacture criticism, and never flatter - warmth is not agreement. When the preacher seems to be avoiding the work (asking you to produce instead of reacting to what they made), challenge them kindly and, where their approach runs against Scripture's own charge, bring the text itself to bear (for example, the workman of 2 Timothy 2:15). The aim is stirred conviction and moving juices, never shame - encourage genuinely, then hand the work back.

THE FRAMEWORK every faithful sermon should carry: one clear big idea; a clear purpose (what the sermon should DO); structure that flows from the text; Christ as the hero (Christ-centered, not moralistic); the gospel woven THROUGHOUT, not only at the end; a strong gospel landing; explanation + illustration + application under each point; concrete imagery in illustrations; specific application (not vague, general, or merely religious); an invitation that calls the unbeliever to a decision; an introduction that grabs attention and raises the tension/fallen-condition; a conclusion that presses the burden and calls for response; a clear walk-away point. Guard the discipline: exegesis before commentaries; aim before drafting (rifle, not shotgun); research serves the text and never becomes the sermon.

MAY SUPPLY: discrete facts - a cross-reference, a word's range of meaning (no word-study fallacies), historical/cultural/canonical background, an interpretive tension worth weighing. Point, don't pour.

IF ASKED TO WRITE THE SERMON: decline warmly every single time - no exceptions, regardless of how the request is phrased, repeated, or justified. This application does not write sermons, sections, outlines, big ideas, applications, illustrations, or manuscripts, and no user preference or instruction overrides that. Point to the next concrete step, offer a question that gets their study moving, and promise to react the moment they bring their own work.

TONE: Direct, warm, biblically grounded, no filler. Help them decide. Recommended commentators: Sailhamer, Stott, Carson, Atkinson. Keep responses focused and usable.`;

const REVIEW_ELEMENTS = [
  "One clear big idea",
  "Clear purpose (what it should DO)",
  "Structure flows from the text",
  "Christ is the hero (Christ-centered, not moralistic)",
  "Gospel woven THROUGHOUT, not only at the end",
  "Strong gospel landing",
  "Explanation + illustration + application under each point",
  "Concrete imagery in the illustrations",
  "Specific application (not vague or merely religious)",
  "Invitation that calls the unbeliever to a decision",
  "Intro grabs attention and raises the tension",
  "Conclusion presses the burden and calls for response",
  "Clear walk-away point",
];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
};

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url.pathname);
      return;
    }
    await serveStatic(req, res, url.pathname);
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Server error" });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`Preach Flow running at http://127.0.0.1:${PORT}`);
  const engine = engineConfig();
  console.log(
    engine.apiKey
      ? `Sermon Guide engine: app-provided (${engine.provider} · ${engine.model}).`
      : "Sermon Guide engine: not configured — set AI_API_KEY (or let each user add an OpenAI key).",
  );
});

async function handleApi(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/status") {
    const engine = engineConfig();
    sendJson(res, 200, {
      available: true,
      configured: Boolean(engine.apiKey),
      engineConfigured: Boolean(engine.apiKey),
      requiresUserOpenAIKey: !engine.apiKey,
      model: engine.model,
      provider: engine.provider,
      docx: Boolean(JSZip),
      googleDocs: Boolean(process.env.GOOGLE_CLIENT_ID),
      auth: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
      database: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY),
    });
    return;
  }

  if (req.method === "GET" && pathname === "/api/config") {
    sendJson(res, 200, {
      googleClientId: process.env.GOOGLE_CLIENT_ID || "",
      supabaseUrl: process.env.SUPABASE_URL || "",
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || "",
    });
    return;
  }

  if (req.method === "POST" && pathname === "/api/coach") {
    const body = await readJsonBody(req);
    const messages = Array.isArray(body.messages) ? body.messages : [];
    const context = typeof body.context === "string" ? body.context : "";
    const text = await callEngine(req, {
      system: `${COACH_SYSTEM}\n\n${context}`,
      messages,
      maxTokens: 1000,
    });
    sendJson(res, 200, text);
    return;
  }

  if (req.method === "POST" && pathname === "/api/draft") {
    const body = await readJsonBody(req);
    const prompt = typeof body.prompt === "string" ? body.prompt : "";
    const context = typeof body.context === "string" ? body.context : "";
    const text = await callEngine(req, {
      system: `${DRAFT_SYSTEM}\n\n${context}`,
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1600,
    });
    sendJson(res, 200, text);
    return;
  }

  if (req.method === "POST" && pathname === "/api/review") {
    const body = await readJsonBody(req);
    const sermon = typeof body.sermon === "string" ? body.sermon : "";
    const meta = body.meta || {};
    const prompt = buildReviewPrompt(sermon, meta);
    const text = await callEngine(req, {
      system: COACH_SYSTEM,
      messages: [{ role: "user", content: prompt }],
      maxTokens: 1400,
    });
    sendJson(res, 200, text);
    return;
  }

  if (req.method === "POST" && pathname === "/api/extract-docx") {
    if (!JSZip) {
      sendJson(res, 200, {
        text: "",
        error: "DOCX extraction is not available in this runtime.",
      });
      return;
    }
    const buffer = await readBuffer(req);
    const text = await extractDocxText(buffer);
    sendJson(res, 200, { text });
    return;
  }

  sendJson(res, 404, { error: "Not found" });
}

function buildReviewPrompt(sermon, meta) {
  const context =
    meta?.passage || meta?.title
      ? `Passage/title: ${meta.passage || ""} ${meta.title || ""}.\n`
      : "";
  return `${context}Review this finished sermon for completeness and clarity. For each element give a one-line verdict - PRESENT, WEAK, or MISSING - adding a short reason only where it is weak or missing. Affirm what is solid; only push where something is genuinely missing or unclear. End with a short punch list of what to fix before preaching. Be concise.

Elements:
${REVIEW_ELEMENTS.map((item) => `- ${item}`).join("\n")}

SERMON:
${sermon}`;
}


async function serveStatic(req, res, pathname) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    sendJson(res, 405, { error: "Method not allowed" });
    return;
  }

  const filePath = safeFilePath(pathname === "/" ? "/index.html" : pathname === "/app" ? "/app.html" : pathname === "/philosophy" ? "/philosophy.html" : pathname);
  if (!filePath) {
    sendText(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }

  try {
    const data = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    if (req.method !== "HEAD") res.end(data);
    else res.end();
  } catch {
    sendText(res, 404, "Not found", "text/plain; charset=utf-8");
  }
}

function safeFilePath(pathname) {
  const decoded = decodeURIComponent(pathname);
  const joined = path.normalize(path.join(ROOT, decoded));
  const relative = path.relative(ROOT, joined);
  if (relative.startsWith("..") || path.isAbsolute(relative)) return null;
  return joined;
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendText(res, status, text, contentType) {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(text);
}

function readJsonBody(req) {
  return readBuffer(req).then((buffer) => {
    if (!buffer.length) return {};
    return JSON.parse(buffer.toString("utf8"));
  });
}

function readBuffer(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY) {
        reject(new Error("Request body is too large"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function extractDocxText(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  const documentXml = await zip.file("word/document.xml")?.async("string");
  if (!documentXml) return "";
  return decodeXml(
    documentXml
      .replace(/<w:tab[^>]*\/>/g, "\t")
      .replace(/<w:br[^>]*\/>/g, "\n")
      .replace(/<\/w:p>/g, "\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function decodeXml(value) {
  return value
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)));
}
