import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export async function hasDocxSupport() {
  return Boolean(await loadJSZip());
}

export async function extractDocxText(buffer) {
  const JSZip = await loadJSZip();
  if (!JSZip) {
    throw new Error("DOCX extraction is not available in this runtime.");
  }

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

async function loadJSZip() {
  try {
    return (await import("jszip")).default;
  } catch {
    try {
      return require(
        "/Users/melosauval/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/.pnpm/node_modules/jszip",
      );
    } catch {
      return null;
    }
  }
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
