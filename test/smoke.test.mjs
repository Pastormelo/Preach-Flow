import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { createReadStream } from "node:fs";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 4199;
const BASE = `http://127.0.0.1:${PORT}`;

// --- Syntax checks -----------------------------------------------------------

test("server.mjs parses", async () => {
  await execFileAsync("node", ["--check", path.join(ROOT, "server.mjs")]);
});

test("every api/ function parses", async () => {
  const files = (await readdir(path.join(ROOT, "api"))).filter((f) => f.endsWith(".js"));
  assert.ok(files.length >= 6, `expected at least 6 api functions, found ${files.length}`);
  for (const file of files) {
    await execFileAsync("node", ["--check", path.join(ROOT, "api", file)]);
  }
});

test("src/app.js parses as an ES module", async () => {
  // app.js loads via <script type="module">; pipe it through stdin so node
  // checks it with module semantics regardless of the .js extension.
  await new Promise((resolve, reject) => {
    const child = spawn("node", ["--input-type=module", "--check"], {
      stdio: ["pipe", "ignore", "pipe"],
    });
    let stderr = "";
    child.stderr.on("data", (chunk) => (stderr += chunk));
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(`app.js failed syntax check:\n${stderr}`)),
    );
    createReadStream(path.join(ROOT, "src", "app.js")).pipe(child.stdin);
  });
});

// --- Local server ------------------------------------------------------------

let server;

before(async () => {
  server = spawn("node", [path.join(ROOT, "server.mjs")], {
    env: { ...process.env, PORT: String(PORT) },
    stdio: ["ignore", "pipe", "pipe"],
  });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("server did not start within 5s")), 5000);
    server.stdout.on("data", (chunk) => {
      if (String(chunk).includes("running")) {
        clearTimeout(timer);
        resolve();
      }
    });
    server.on("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`server exited early with code ${code}`));
    });
  });
});

after(() => {
  server?.kill();
});

test("GET / serves the homepage", async () => {
  const res = await fetch(`${BASE}/`);
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type"), /text\/html/);
  assert.match(await res.text(), /Preach\s?Flow/);
});

test("GET /app serves the app shell", async () => {
  const res = await fetch(`${BASE}/app`);
  assert.equal(res.status, 200);
  assert.match(await res.text(), /id="app"/);
});

test("GET /api/status reports bring-your-own-key mode", async () => {
  const res = await fetch(`${BASE}/api/status`);
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.requiresUserOpenAIKey, true);
  assert.equal(body.available, true);
  assert.equal(body.docx, true, "JSZip should load from node_modules (run npm install)");
});

test("GET /api/config returns the public config shape", async () => {
  const res = await fetch(`${BASE}/api/config`);
  assert.equal(res.status, 200);
  const body = await res.json();
  for (const key of ["googleClientId", "supabaseUrl", "supabaseAnonKey"]) {
    assert.ok(key in body, `missing ${key}`);
  }
});

test("POST /api/coach without any key explains the engine setup instead of calling a provider", async () => {
  const res = await fetch(`${BASE}/api/coach`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: "hello" }] }),
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.configured, false);
  assert.match(body.text, /AI_API_KEY|OpenAI key/);
});

test("POST /api/extract-docx extracts text from a .docx", async () => {
  const { default: JSZip } = await import("jszip");
  const zip = new JSZip();
  zip.file(
    "word/document.xml",
    `<?xml version="1.0"?><w:document><w:body><w:p><w:r><w:t>In the beginning</w:t></w:r></w:p></w:body></w:document>`,
  );
  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  const res = await fetch(`${BASE}/api/extract-docx`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: buffer,
  });
  assert.equal(res.status, 200);
  const body = await res.json();
  assert.equal(body.text, "In the beginning");
});

test("engine config resolves providers and models", async () => {
  const { createRequire } = await import("node:module");
  const localRequire = createRequire(import.meta.url);
  const { engineConfig } = localRequire("../api/_engine.js");
  const saved = { ...process.env };
  try {
    process.env.AI_API_KEY = "test-key";
    process.env.AI_PROVIDER = "gemini";
    delete process.env.AI_MODEL;
    delete process.env.OPENAI_MODEL;
    let config = engineConfig();
    assert.equal(config.provider, "gemini");
    assert.ok(config.model.length > 0);
    process.env.AI_PROVIDER = "not-a-provider";
    config = engineConfig();
    assert.equal(config.provider, "openai", "unknown providers fall back to openai");
  } finally {
    process.env.AI_API_KEY = saved.AI_API_KEY ?? "";
    if (!saved.AI_API_KEY) delete process.env.AI_API_KEY;
    if (saved.AI_PROVIDER) process.env.AI_PROVIDER = saved.AI_PROVIDER; else delete process.env.AI_PROVIDER;
  }
});

test("unknown paths return 404", async () => {
  const res = await fetch(`${BASE}/definitely-not-a-page`);
  assert.equal(res.status, 404);
});

test("path traversal is blocked", async () => {
  const res = await fetch(`${BASE}/..%2f..%2f..%2fetc%2fpasswd`);
  assert.ok([403, 404].includes(res.status), `expected 403/404, got ${res.status}`);
  const text = await res.text();
  assert.doesNotMatch(text, /root:/);
});
