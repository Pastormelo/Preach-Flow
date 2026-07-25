// Scripture text for the in-app reader.
//
// One endpoint, several sources, so the app never has to care where a
// translation comes from:
//   - KJV, WEB, ASV: public domain, always available, no setup.
//   - ESV: Crossway's official API when ESV_API_KEY is set.
//   - NASB, CSB (and others): API.Bible when BIBLE_API_KEY is set.
//
// Copyrighted translations are only ever served through their publisher's
// own API with the deployment's key. Nothing is bundled or scraped.

const PUBLIC_DOMAIN = {
  KJV: { query: "kjv", label: "King James Version" },
  WEB: { query: "web", label: "World English Bible" },
  ASV: { query: "asv", label: "American Standard Version" },
};

// API.Bible ids for the translations pastors ask for most. Which ones a key
// can actually read depends on the publisher agreements on that account.
const API_BIBLE_IDS = {
  NASB: "b8ee27bcd1cae43a-01",
  CSB: "a556c5305ee15c3f-01",
  NIV: "78a9f6124f344018-01",
  NLT: "71c6eab17ae5b667-01",
  NKJV: "de4e12af7f28f599-02",
};

const ESV_KEY = () => (process.env.ESV_API_KEY || "").trim();
const API_BIBLE_KEY = () => (process.env.BIBLE_API_KEY || process.env.API_BIBLE_KEY || "").trim();

function availableTranslations() {
  const list = Object.entries(PUBLIC_DOMAIN).map(([code, meta]) => ({
    code,
    label: meta.label,
    ready: true,
  }));
  list.unshift({ code: "ESV", label: "English Standard Version", ready: Boolean(ESV_KEY()) });
  for (const code of Object.keys(API_BIBLE_IDS)) {
    list.push({ code, label: code, ready: Boolean(API_BIBLE_KEY()) });
  }
  // Ready ones first, then the rest, each group keeping a sensible order.
  const order = ["ESV", "NASB", "CSB", "NIV", "NKJV", "NLT", "KJV", "WEB", "ASV"];
  list.sort((a, b) => Number(b.ready) - Number(a.ready) || order.indexOf(a.code) - order.indexOf(b.code));
  return list;
}

async function fetchPublicDomain(reference, code) {
  const meta = PUBLIC_DOMAIN[code];
  const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${meta.query}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Scripture service returned ${response.status}`);
  const data = await response.json();
  if (!data.verses?.length && !data.text) throw new Error("That passage could not be found.");
  const verses = (data.verses || []).map((verse) => ({
    chapter: verse.chapter,
    verse: verse.verse,
    text: String(verse.text || "").replace(/\s*\n\s*/g, " ").trim(),
  }));
  return {
    reference: data.reference || reference,
    translation: code,
    attribution: `${code} - public domain`,
    verses: verses.length ? verses : [{ chapter: 0, verse: 0, text: String(data.text).trim() }],
  };
}

async function fetchEsv(reference) {
  const params = new URLSearchParams({
    q: reference,
    "include-headings": "false",
    "include-footnotes": "false",
    "include-verse-numbers": "true",
    "include-short-copyright": "false",
    "include-passage-references": "false",
  });
  const response = await fetch(`https://api.esv.org/v3/passage/text/?${params.toString()}`, {
    headers: { Authorization: `Token ${ESV_KEY()}` },
  });
  if (response.status === 401 || response.status === 403) throw new Error("The ESV key was rejected. Check ESV_API_KEY.");
  if (!response.ok) throw new Error(`ESV service returned ${response.status}`);
  const data = await response.json();
  const passage = (data.passages || []).join("\n").trim();
  if (!passage) throw new Error("That passage could not be found.");
  return {
    reference: data.canonical || reference,
    translation: "ESV",
    attribution: "ESV - Crossway",
    verses: splitNumberedText(passage),
  };
}

async function fetchApiBible(reference, code) {
  const id = API_BIBLE_IDS[code];
  const search = new URLSearchParams({ query: reference, limit: "1" });
  const response = await fetch(`https://api.scripture.api.bible/v1/bibles/${id}/search?${search.toString()}`, {
    headers: { "api-key": API_BIBLE_KEY() },
  });
  if (response.status === 401 || response.status === 403) {
    throw new Error(`${code} is not available on this key. Check BIBLE_API_KEY and the translations it covers.`);
  }
  if (!response.ok) throw new Error(`Scripture service returned ${response.status}`);
  const data = await response.json();
  const passage = data.data?.passages?.[0];
  if (!passage?.content) throw new Error("That passage could not be found.");
  const text = String(passage.content)
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    reference: passage.reference || reference,
    translation: code,
    attribution: `${code} - ${data.data?.copyright || "publisher licensed"}`,
    verses: splitNumberedText(text),
  };
}

// Turn "[1] In the beginning [2] and the earth" into verse rows.
function splitNumberedText(text) {
  const cleaned = String(text).replace(/\s+/g, " ").trim();
  const parts = cleaned.split(/\[(\d+)\]|(?:^|\s)(\d{1,3})(?=\s[A-Z“"'])/g).filter((part) => part !== undefined);
  const verses = [];
  let current = null;
  for (const part of parts) {
    const piece = String(part).trim();
    if (!piece) continue;
    if (/^\d{1,3}$/.test(piece) && (!current || current.text)) {
      if (current && current.text) verses.push(current);
      current = { chapter: 0, verse: Number(piece), text: "" };
      continue;
    }
    if (!current) current = { chapter: 0, verse: verses.length + 1, text: "" };
    current.text = `${current.text} ${piece}`.trim();
  }
  if (current && current.text) verses.push(current);
  return verses.length ? verses : [{ chapter: 0, verse: 0, text: cleaned }];
}

module.exports = async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  const reference = (url.searchParams.get("reference") || "").trim();
  const code = (url.searchParams.get("translation") || "KJV").trim().toUpperCase();

  if (url.searchParams.get("list") === "1" || !reference) {
    res.status(200).json({ translations: availableTranslations() });
    return;
  }

  try {
    let passage;
    if (PUBLIC_DOMAIN[code]) passage = await fetchPublicDomain(reference, code);
    else if (code === "ESV") {
      if (!ESV_KEY()) throw new Error("ESV needs a free key from api.esv.org saved as ESV_API_KEY.");
      passage = await fetchEsv(reference);
    } else if (API_BIBLE_IDS[code]) {
      if (!API_BIBLE_KEY()) throw new Error(`${code} needs a free key from scripture.api.bible saved as BIBLE_API_KEY.`);
      passage = await fetchApiBible(reference, code);
    } else {
      throw new Error(`${code} is not a translation this app can read.`);
    }
    res.status(200).json({ ...passage, translations: availableTranslations() });
  } catch (error) {
    res.status(200).json({
      error: error.message || "Could not load that passage.",
      translations: availableTranslations(),
    });
  }
};
