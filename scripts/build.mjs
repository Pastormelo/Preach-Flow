// Build the static site into dist/.
//
// Asset filenames are content-hashed (app.<hash>.js, styles.<hash>.css) and
// app.html is rewritten to point at them. A new hash means a brand new URL,
// so a browser or CDN can never serve a stale copy of the app after a
// deploy. The repo keeps the plain ./src/app.js paths so the dev server
// (node server.mjs) works unchanged.

import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DIST = path.join(ROOT, "dist");
const PAGES = ["index.html", "app.html", "share.html", "philosophy.html"];

const shortHash = (...buffers) => {
  const hash = createHash("sha256");
  for (const buffer of buffers) hash.update(buffer);
  return hash.digest("hex").slice(0, 12);
};

await rm(DIST, { recursive: true, force: true });
await mkdir(path.join(DIST, "src"), { recursive: true });

const appJs = await readFile(path.join(ROOT, "src/app.js"));
const stylesCss = await readFile(path.join(ROOT, "src/styles.css"));
const build = shortHash(appJs, stylesCss);

const jsName = `app.${build}.js`;
const cssName = `styles.${build}.css`;
await writeFile(path.join(DIST, "src", jsName), appJs);
await writeFile(path.join(DIST, "src", cssName), stylesCss);

for (const page of PAGES) {
  let html = await readFile(path.join(ROOT, page), "utf8");
  html = html
    .replaceAll(/\.\/src\/styles\.css(\?v=[^"']*)?/g, `./src/${cssName}`)
    .replaceAll(/\.\/src\/app\.js(\?v=[^"']*)?/g, `./src/${jsName}`)
    .replaceAll(/(<meta name="pf-build" content=")[^"]*(")/g, `$1${build}$2`);
  await writeFile(path.join(DIST, page), html);
}

await cp(path.join(ROOT, "assets"), path.join(DIST, "assets"), { recursive: true });

console.log(`built dist/ (build ${build}): src/${jsName}, src/${cssName}`);
