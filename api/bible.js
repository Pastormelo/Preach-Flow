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

const { BOOKS, findBook } = require("./_books.js");

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

// Verse counts per chapter, learned once and kept for the life of the process.
const VERSE_COUNTS = new Map();

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

// Break "1 John 2:3-11" into its parts so a real passage id can be built.
function parseReference(reference) {
  const text = String(reference || "").trim().replace(/\s+/g, " ");
  const match = text.match(/^((?:[1-3]\s?)?[A-Za-z][A-Za-z\s]*?)\s*(\d{1,3})(?::(\d{1,3})(?:\s*-\s*(\d{1,3}))?)?$/);
  if (!match) return null;
  const book = findBook(match[1]);
  if (!book) return null;
  const chapter = Math.min(Math.max(1, Number(match[2])), book.chapters);
  return {
    book,
    chapter,
    verseStart: match[3] ? Number(match[3]) : null,
    verseEnd: match[4] ? Number(match[4]) : null,
    reference: `${book.name} ${chapter}${match[3] ? `:${match[3]}${match[4] ? `-${match[4]}` : ""}` : ""}`,
  };
}

// API.Bible serves whole passages from its passages endpoint. The search
// endpoint (used before) returns only a snippet, which is why anything
// beyond the first verse went missing.
async function fetchApiBible(reference, code) {
  const id = API_BIBLE_IDS[code];
  const parsed = parseReference(reference);
  if (!parsed) throw new Error("That reference could not be read. Try a form like John 15:1-11.");
  const { book, chapter, verseStart, verseEnd } = parsed;
  const passageId = verseStart
    ? `${book.usfm}.${chapter}.${verseStart}${verseEnd && verseEnd > verseStart ? `-${book.usfm}.${chapter}.${verseEnd}` : ""}`
    : `${book.usfm}.${chapter}`;
  const params = new URLSearchParams({
    "content-type": "text",
    "include-verse-numbers": "true",
    "include-verse-spans": "false",
    "include-notes": "false",
    "include-titles": "false",
    "include-chapter-numbers": "false",
  });
  const response = await fetch(`https://api.scripture.api.bible/v1/bibles/${id}/passages/${passageId}?${params.toString()}`, {
    headers: { "api-key": API_BIBLE_KEY() },
  });
  if (response.status === 401 || response.status === 403) {
    throw new Error(`${code} is not available on this key. Check BIBLE_API_KEY and the translations it covers.`);
  }
  if (response.status === 404) throw new Error("That passage could not be found.");
  if (!response.ok) throw new Error(`Scripture service returned ${response.status}`);
  const data = await response.json();
  const content = data.data?.content;
  if (!content) throw new Error("That passage could not be found.");
  const text = String(content).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return {
    reference: data.data?.reference || parsed.reference,
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

  if (url.searchParams.get("books") === "1") {
    res.status(200).json({ books: BOOKS });
    return;
  }

  // How many verses a chapter holds, so a verse picker never offers a verse
  // that is not there. Counted from a public-domain text, so it needs no key
  // and the answer is the same whatever translation the pastor is reading.
  if (url.searchParams.get("verses") === "1") {
    const asked = parseReference(reference);
    if (!asked) {
      res.status(200).json({ verses: 0 });
      return;
    }
    const key = `${asked.book.name} ${asked.chapter}`;
    if (VERSE_COUNTS.has(key)) {
      res.status(200).json({ book: asked.book.name, chapter: asked.chapter, verses: VERSE_COUNTS.get(key) });
      return;
    }
    try {
      const passage = await fetchPublicDomain(key, "KJV");
      const count = Math.max(...passage.verses.map((verse) => Number(verse.verse) || 0), 0);
      if (count) VERSE_COUNTS.set(key, count);
      res.status(200).json({ book: asked.book.name, chapter: asked.chapter, verses: count });
    } catch {
      res.status(200).json({ book: asked.book.name, chapter: asked.chapter, verses: 0 });
    }
    return;
  }

  if (url.searchParams.get("list") === "1" || !reference) {
    res.status(200).json({ translations: availableTranslations(), books: BOOKS });
    return;
  }

  // Reject impossible references here rather than letting a provider
  // answer with a raw 400.
  const parsed = parseReference(reference);
  if (!parsed) {
    res.status(200).json({
      error: "That reference could not be read. Try a form like John 15:1-11.",
      translations: availableTranslations(),
      books: BOOKS,
    });
    return;
  }

  try {
    let passage;
    if (PUBLIC_DOMAIN[code]) passage = await fetchPublicDomain(parsed.reference, code);
    else if (code === "ESV") {
      if (!ESV_KEY()) throw new Error("ESV needs a free key from api.esv.org saved as ESV_API_KEY.");
      passage = await fetchEsv(parsed.reference);
    } else if (API_BIBLE_IDS[code]) {
      if (!API_BIBLE_KEY()) throw new Error(`${code} needs a free key from scripture.api.bible saved as BIBLE_API_KEY.`);
      passage = await fetchApiBible(reference, code);
    } else {
      throw new Error(`${code} is not a translation this app can read.`);
    }
    // A whole chapter tells us its verse count for free.
    if (!parsed.verseStart) {
      const count = Math.max(...passage.verses.map((verse) => Number(verse.verse) || 0), 0);
      if (count) VERSE_COUNTS.set(`${parsed.book.name} ${parsed.chapter}`, count);
    }
    res.status(200).json({
      ...passage,
      verseCount: VERSE_COUNTS.get(`${parsed.book.name} ${parsed.chapter}`) || 0,
      translations: availableTranslations(),
      books: BOOKS,
    });
  } catch (error) {
    res.status(200).json({
      error: error.message || "Could not load that passage.",
      translations: availableTranslations(),
      books: BOOKS,
    });
  }
};
