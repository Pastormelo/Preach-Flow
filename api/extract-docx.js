const JSZip = require("jszip");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const buffer = await readBuffer(req);
    const documentXml = await loadDocumentXml(buffer);
    res.status(200).json({
      text: documentXml ? xmlToText(documentXml) : "",
      html: documentXml ? xmlToHtml(documentXml) : "",
    });
  } catch (error) {
    res.status(200).json({
      text: "",
      error: error.message || "DOCX extraction failed.",
    });
  }
};

async function loadDocumentXml(buffer) {
  const zip = await JSZip.loadAsync(buffer);
  return (await zip.file("word/document.xml")?.async("string")) || "";
}

function xmlToText(documentXml) {
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

// Preserve the document's basic structure - headings, bold/italic/underline,
// and bullet lists - so imported sermons don't need reformatting.
function xmlToHtml(documentXml) {
  const paragraphs = documentXml.match(/<w:p[ >][\s\S]*?<\/w:p>/g) || [];
  const out = [];
  let listOpen = false;
  for (const paragraph of paragraphs) {
    const styleMatch = paragraph.match(/<w:pStyle [^>]*w:val="([^"]+)"/);
    const style = styleMatch ? styleMatch[1].toLowerCase() : "";
    const isList = /<w:numPr>/.test(paragraph);
    let html = "";
    const runs = paragraph.match(/<w:r[ >][\s\S]*?<\/w:r>/g) || [];
    for (const run of runs) {
      let text = (run.match(/<w:t[^>]*>[\s\S]*?<\/w:t>/g) || [])
        .map((t) => t.replace(/<[^>]+>/g, ""))
        .join("");
      text = escapeHtml(decodeXml(text));
      if (/<w:br[^>]*\/>/.test(run)) text += "<br>";
      if (!text) continue;
      const props = (run.match(/<w:rPr>[\s\S]*?<\/w:rPr>/) || [""])[0];
      const bold = /<w:b(?:\s[^>]*)?\/>/.test(props) && !/<w:b [^>]*w:val="(?:0|false)"/.test(props);
      const italic = /<w:i(?:\s[^>]*)?\/>/.test(props) && !/<w:i [^>]*w:val="(?:0|false)"/.test(props);
      const underline = /<w:u\s/.test(props) && !/<w:u [^>]*w:val="none"/.test(props);
      if (bold) text = `<strong>${text}</strong>`;
      if (italic) text = `<em>${text}</em>`;
      if (underline) text = `<u>${text}</u>`;
      html += text;
    }
    if (!html.trim()) {
      if (listOpen) {
        out.push("</ul>");
        listOpen = false;
      }
      continue;
    }
    if (isList) {
      if (!listOpen) {
        out.push("<ul>");
        listOpen = true;
      }
      out.push(`<li>${html}</li>`);
      continue;
    }
    if (listOpen) {
      out.push("</ul>");
      listOpen = false;
    }
    if (/^(heading1|title)$/.test(style)) out.push(`<h2>${html}</h2>`);
    else if (/^heading[23]$/.test(style)) out.push(`<h3>${html}</h3>`);
    else if (/^heading/.test(style)) out.push(`<h4>${html}</h4>`);
    else out.push(`<p>${html}</p>`);
  }
  if (listOpen) out.push("</ul>");
  return out.join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
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

module.exports.docxHelpers = { loadDocumentXml, xmlToText, xmlToHtml };
