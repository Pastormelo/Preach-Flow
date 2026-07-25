// The 66 books with their chapter counts and API.Bible (USFM) codes.
// Shared by the Bible endpoint and served to the app so the reader's
// picker and chapter navigation never guess at what exists.

const BOOKS = [
  ["Genesis", "GEN", 50], ["Exodus", "EXO", 40], ["Leviticus", "LEV", 27], ["Numbers", "NUM", 36], ["Deuteronomy", "DEU", 34],
  ["Joshua", "JOS", 24], ["Judges", "JDG", 21], ["Ruth", "RUT", 4],
  ["1 Samuel", "1SA", 31], ["2 Samuel", "2SA", 24], ["1 Kings", "1KI", 22], ["2 Kings", "2KI", 25],
  ["1 Chronicles", "1CH", 29], ["2 Chronicles", "2CH", 36], ["Ezra", "EZR", 10], ["Nehemiah", "NEH", 13], ["Esther", "EST", 10],
  ["Job", "JOB", 42], ["Psalms", "PSA", 150], ["Proverbs", "PRO", 31], ["Ecclesiastes", "ECC", 12], ["Song of Solomon", "SNG", 8],
  ["Isaiah", "ISA", 66], ["Jeremiah", "JER", 52], ["Lamentations", "LAM", 5], ["Ezekiel", "EZK", 48], ["Daniel", "DAN", 12],
  ["Hosea", "HOS", 14], ["Joel", "JOL", 3], ["Amos", "AMO", 9], ["Obadiah", "OBA", 1], ["Jonah", "JON", 4], ["Micah", "MIC", 7],
  ["Nahum", "NAM", 3], ["Habakkuk", "HAB", 3], ["Zephaniah", "ZEP", 3], ["Haggai", "HAG", 2], ["Zechariah", "ZEC", 14], ["Malachi", "MAL", 4],
  ["Matthew", "MAT", 28], ["Mark", "MRK", 16], ["Luke", "LUK", 24], ["John", "JHN", 21], ["Acts", "ACT", 28],
  ["Romans", "ROM", 16], ["1 Corinthians", "1CO", 16], ["2 Corinthians", "2CO", 13], ["Galatians", "GAL", 6], ["Ephesians", "EPH", 6],
  ["Philippians", "PHP", 4], ["Colossians", "COL", 4], ["1 Thessalonians", "1TH", 5], ["2 Thessalonians", "2TH", 3],
  ["1 Timothy", "1TI", 6], ["2 Timothy", "2TI", 4], ["Titus", "TIT", 3], ["Philemon", "PHM", 1],
  ["Hebrews", "HEB", 13], ["James", "JAS", 5], ["1 Peter", "1PE", 5], ["2 Peter", "2PE", 3],
  ["1 John", "1JN", 5], ["2 John", "2JN", 1], ["3 John", "3JN", 1], ["Jude", "JUD", 1], ["Revelation", "REV", 22],
].map(([name, usfm, chapters]) => ({ name, usfm, chapters }));

const ALIASES = { Psalm: "Psalms", "Song of Songs": "Song of Solomon", Canticles: "Song of Solomon", Apocalypse: "Revelation" };

function findBook(name) {
  const wanted = String(name || "").trim().toLowerCase();
  if (!wanted) return null;
  const alias = Object.keys(ALIASES).find((key) => key.toLowerCase() === wanted);
  const target = alias ? ALIASES[alias].toLowerCase() : wanted;
  return BOOKS.find((book) => book.name.toLowerCase() === target) || null;
}

module.exports = { BOOKS, findBook };
