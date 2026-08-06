// Browser drive for the v2 visual language and the interactions it touches.
//
// Run it against a local server:
//   PORT=4173 node server.mjs &
//   node test/visual.drive.mjs
//
// It needs Playwright and a Chromium binary. On this project's remote
// sessions that is PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers; set
// PF_CHROMIUM to point somewhere else if your machine differs. If Playwright
// is not installed the drive exits 0 with a note, so it never blocks `npm test`.

const BASE = process.env.PF_BASE || "http://127.0.0.1:4173";
const EXEC = process.env.PF_CHROMIUM || "/opt/pw-browsers/chromium";
const SHOTS = process.env.PF_SHOTS || "";

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log("SKIP  playwright is not installed; skipping the visual drive");
  process.exit(0);
}

const results = [];
const errors = [];
const check = (name, ok, detail = "") => results.push(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` - ${detail}` : ""}`);

const browser = await chromium.launch({ executablePath: EXEC });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", (err) => errors.push(`pageerror: ${err.message}`));
page.on("console", (msg) => {
  if (msg.type() === "error" && !/net::|Failed to load resource/.test(msg.text())) errors.push(`console: ${msg.text()}`);
});

const shot = async (name) => {
  if (SHOTS) await page.screenshot({ path: `${SHOTS}/${name}.png` });
};
const go = async (view) => {
  await page.evaluate((v) => {
    window.__pf.state.view = v;
    window.__pf.render();
    window.scrollTo(0, 0);
  }, view);
  await page.waitForTimeout(320);
};

await page.goto(`${BASE}/app`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(800);

// ---------- 1. the language itself ----------
const flat = await page.evaluate(() => {
  const rounded = [];
  const shadowed = [];
  for (const el of document.querySelectorAll("*")) {
    const cs = getComputedStyle(el);
    if (cs.borderRadius && !/^0px( 0px)*$/.test(cs.borderRadius)) rounded.push(el.className || el.tagName);
    if (cs.boxShadow !== "none" && !cs.boxShadow.includes("inset")) shadowed.push(el.className || el.tagName);
  }
  return { rounded: rounded.slice(0, 5), shadowed: shadowed.slice(0, 5) };
});
check("no rounded corners anywhere", flat.rounded.length === 0, flat.rounded.join(", "));
check("no drop shadows anywhere", flat.shadowed.length === 0, flat.shadowed.join(", "));

const fonts = await page.evaluate(() => {
  const family = (sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).fontFamily : "";
  };
  return {
    nav: family(".pf-nav-btn"),
    h1: family(".pf-h1"),
    body: getComputedStyle(document.body).fontFamily,
  };
});
check("nav and controls are monospace", /Plex Mono|monospace/i.test(fonts.nav), fonts.nav);
check("headings use the display face", /Montserrat/i.test(fonts.h1), fonts.h1);
check("body copy stays in the reading face", /Mulish/i.test(fonts.body), fonts.body);

const headerCells = await page.evaluate(() => {
  const bar = document.querySelector(".pf-topbar");
  const cs = getComputedStyle(bar);
  return { height: Math.round(bar.getBoundingClientRect().height), border: cs.borderBottomWidth, sticky: cs.position };
});
check("header is a 58px sticky bar with a strong rule", headerCells.height === 58 && headerCells.sticky === "sticky" && headerCells.border === "2px", JSON.stringify(headerCells));

// ---------- 2. the app still works ----------
await page.click('[data-action="new-sermon"]');
await page.waitForTimeout(400);
await page.fill("#new-passage", "Ephesians 3:1-13");
await page.fill("#new-title", "The Church on Display");
await page.fill("#new-series", "Family Matters");
await page.click("button[type=submit]");
await page.waitForTimeout(700);
check("a new sermon opens the workspace", (await page.locator(".pf-ws-grid").count()) === 1);
check("metadata strip shows the sermon's facts", (await page.locator(".pf-meta .pf-meta-cell").count()) >= 4);
check("movement tabs replace the old journey dots", (await page.locator(".pf-move-tab").count()) === 4);
check("the active movement is an inverted block", await page.evaluate(() => {
  const tab = document.querySelector(".pf-move-tab.active");
  const inv = getComputedStyle(document.querySelector(".pf-root")).getPropertyValue("--pf-inv-bg").trim();
  return Boolean(tab) && getComputedStyle(tab).backgroundColor !== "rgba(0, 0, 0, 0)" && inv.length > 0;
}));
check("phase rows carry their global number", /^0?1$/.test((await page.locator(".pf-phase-num").first().innerText()).trim()));
await shot("drive-workspace");

const secondPhase = page.locator(".pf-phase-row").nth(1);
const secondName = (await secondPhase.locator(".pf-phase-name").innerText()).trim();
await secondPhase.click();
await page.waitForTimeout(400);
check("the rail still switches phases", (await page.locator(".pf-phase-title").innerText()).trim().toLowerCase() === secondName.toLowerCase());

await page.locator(".pf-check-item").first().click();
await page.waitForTimeout(400);
check("checklist items still toggle", (await page.locator(".pf-check-box.done").count()) >= 1);
check("checkboxes are square", await page.evaluate(() => getComputedStyle(document.querySelector(".pf-check-box")).borderRadius === "0px"));

// ---------- 3. pipeline is a table ----------
await go("pipeline");
check("pipeline has a column header row", (await page.locator(".pf-row-head").count()) === 1);
check("sermons render as rows, not cards", (await page.locator(".pf-row[data-sermon-card]").count()) === 1 && (await page.locator(".pf-card[data-sermon-card]").count()) === 0);
check("status tags are outlined, not filled", await page.evaluate(() => {
  const tag = document.querySelector(".pf-row-status .pf-tag");
  if (!tag) return false;
  const cs = getComputedStyle(tag);
  return cs.backgroundColor === "rgba(0, 0, 0, 0)" && cs.borderStyle === "solid";
}));
await shot("drive-pipeline");
await page.locator(".pf-row[data-sermon-card]").first().click();
await page.waitForTimeout(500);
check("clicking a row still opens the sermon", (await page.locator(".pf-ws-grid").count()) === 1);

// ---------- 3b. one writing document across every phase ----------
await go("workspace");
check("the work box says it is one document", /one document/i.test(await page.locator(".pf-writer-note").innerText()));
await page.click('[data-action="phase-editor"]');
await page.keyboard.type("Carried across the phases.");
await page.waitForTimeout(600);
await page.locator(".pf-phase-row").nth(2).click();
await page.waitForTimeout(500);
check("the writing carries into another phase", (await page.locator('[data-action="phase-editor"]').innerText()).includes("Carried across the phases"));
await go("editor");
check("the Sermon Editor holds the same document", (await page.locator(".pf-doc-canvas").innerText()).includes("Carried across the phases"));
const stored = await page.evaluate(() => {
  const sermon = window.__pf.state.sermons[0];
  return {
    docs: Object.keys(sermon.notes).filter((key) => !key.includes("::")).length,
    logged: Object.keys(sermon.workLog || {}).length,
  };
});
check("only one document is stored", stored.docs === 1, `${stored.docs} documents`);
check("writing is attributed to the phase it happened in", stored.logged >= 1, `${stored.logged} phases logged`);

// ---------- 4. every screen renders in both themes ----------
const views = ["home", "pipeline", "library", "editor", "journal", "sharing", "impact", "map", "series", "diet", "profile", "ahead", "lens", "debrief", "workspace"];
for (const theme of ["light", "dark"]) {
  await page.evaluate((t) => {
    window.__pf.state.theme = t;
    window.__pf.render();
  }, theme);
  for (const view of views) {
    await go(view);
    const painted = await page.evaluate(() => {
      const root = document.querySelector(".pf-root");
      return Boolean(root) && root.getBoundingClientRect().height > 200 && document.body.innerText.trim().length > 40;
    });
    check(`${view} renders in ${theme}`, painted);
  }
  const themedBody = await page.evaluate(() => document.body.dataset.theme);
  check(`the page behind the app follows the ${theme} theme`, themedBody === theme, themedBody);
}
await shot("drive-dark");

// ---------- 5. narrow screens ----------
await page.setViewportSize({ width: 390, height: 844 });
await page.evaluate(() => {
  window.__pf.state.theme = "light";
  window.__pf.render();
});
await go("workspace");
const mobile = await page.evaluate(() => {
  const grid = getComputedStyle(document.querySelector(".pf-ws-grid")).gridTemplateColumns;
  const rail = getComputedStyle(document.querySelector(".pf-rail")).position;
  const bar = document.querySelector(".pf-topbar").getBoundingClientRect();
  const strip = document.querySelector(".pf-sermon-strip").getBoundingClientRect();
  return { cols: grid.split(" ").length, rail, overlap: Math.round(bar.bottom - strip.top), width: document.documentElement.scrollWidth };
});
check("workspace is one column on a phone", mobile.cols === 1, mobile.cols);
check("the rail unsticks on a phone", mobile.rail === "static", mobile.rail);
check("the header does not cover the strip", mobile.overlap <= 1, `${mobile.overlap}px`);
check("nothing forces sideways scrolling", mobile.width <= 391, `${mobile.width}px`);
await go("pipeline");
check("pipeline drops to passage and status on a phone", (await page.locator(".pf-row-hide").first().isVisible()) === false);
await shot("drive-mobile");

await browser.close();
console.log(results.join("\n"));
console.log(`\nJS errors: ${errors.length}`);
errors.slice(0, 10).forEach((err) => console.log("  " + err));
process.exit(results.some((line) => line.startsWith("FAIL")) || errors.length ? 1 : 0);
