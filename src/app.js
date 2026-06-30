const STORE_KEY = "pulpitos:web:v1";
const OPENAI_KEY_STORE = "preach-flow:openai-api-key:v1";
const THEME_STORE = "preach-flow:theme:v1";
const SUPABASE_SCRIPT = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/documents",
].join(" ");

const BLOCKS = [
  { label: "Exegesis", when: "4 weeks out" },
  { label: "Study", when: "3 weeks out" },
  { label: "Outline & Application", when: "2 weeks out" },
  { label: "Polish & Delivery", when: "preaching week" },
];

const PHASES = [
  {
    id: "plan",
    name: "Plan & Pray",
    block: 0,
    devotional: true,
    focus:
      "Begin on your knees. Plan the work, then ask the Spirit to illuminate the text before you study a single word. A sermon is born from worship before it becomes a message.",
    doItems: [
      "Spend unhurried time with the Father before prep",
      "Confirm the passage, date, and series",
      "Ask the Spirit to open the text and your heart",
    ],
    enc: "You started on your knees. That is the only place a sermon should begin.",
  },
  {
    id: "immersion",
    name: "Immersion",
    block: 0,
    focus:
      "Get familiar with the passage itself - not commentary about it. Read it until you know it, then nail down the facts that frame its original meaning.",
    doItems: [
      "Read the passage roughly 20 times in your preferred Bible",
      "Read it in multiple versions",
      "Record every question - confusing, surprising, hard",
      "Identify the facts: author, original audience, date, purpose",
    ],
    actions: [
      {
        label: "React to my questions & facts",
        placeholder: "Paste your questions and the facts you found...",
        seed:
          "I have read the passage repeatedly and noted my questions plus the facts (author, audience, date, purpose). React - what facts am I missing, and what questions does the text raise that I have not asked? Do not do it for me. Here is what I have:\n\n",
      },
    ],
    enc:
      "You know the text now - not about it, but it itself. That familiarity will preach.",
  },
  {
    id: "exegesis",
    name: "First-Pass Exegesis",
    block: 0,
    focus:
      "Trace what the text actually says - still no commentaries. Observe, study the key words, and build an exegetical outline that follows the thought-flow of the passage.",
    doItems: [
      "List raw observations: repeated words, commands, tensions, connectors",
      "Mark the structure and where paragraphs break",
      "Word study on the key terms, verbs first",
      "Build an exegetical outline tracing the thought-flow",
      "Note the early gospel thread or Christ connection",
    ],
    actions: [
      {
        label: "React to my exegesis",
        placeholder: "Paste your observations and exegetical outline...",
        seed:
          "Here is my first-pass exegesis with no commentaries yet - observations, structure, key words, and my exegetical outline. React: what did I miss, where is my structural read fuzzy, which repeated word or connector did I overlook, what question am I not asking? Do not redo it. Here it is:\n\n",
      },
    ],
    enc:
      "You let the text speak before anyone told you what it says. That is faithful work.",
  },
  {
    id: "meditation",
    name: "Personal Meditation",
    block: 0,
    devotional: true,
    focus:
      "Before this is a message for them, let it be worship in you. Sit with the text personally - this is where the sermon gets its weight.",
    doItems: [
      "What does this show me about God to praise him for?",
      "What sin does it expose that I should confess?",
      "What idol comes alive when I forget this truth?",
      "What need does it reveal, and what must I become?",
      "How is Christ's grace crucial to meeting that need?",
      "How would my life change if this were fully alive in me?",
      "Why is God showing me this now?",
    ],
    enc:
      "Before it is a message for them, it became worship in you. Keep that order.",
  },
  {
    id: "commentary",
    name: "Commentary & Research",
    block: 1,
    focus:
      "Now - and only now - consult the faithful. Compare your work with the commentators, gather theology and cross-references, and bring in cultural or statistical research that builds the tension the text addresses. Do not let research become the sermon.",
    doItems: [
      "Consult commentaries (Sailhamer, Stott, Carson, Atkinson) - compare, do not copy",
      "Note theological themes and OT/NT cross-references",
      "Name the points of tension in the text",
      "Gather cultural or statistical insight that exposes the problem",
    ],
    actions: [
      {
        label: "Build a Logos research plan",
        direct: true,
        seed:
          "Build me a Logos research plan for this passage - exact searches and tools (Passage Guide, Exegetical Guide, Bible Word Study, Factbook, Smart Search, Precise Search, commentaries, cross references), organized by exegetical issues, background, biblical theology, systematic theology, pastoral application, and illustration. Prefer Sailhamer, Stott, Carson, Atkinson. Tell me exactly what to copy back.",
      },
      {
        label: "Interrogate my research",
        placeholder: "Paste your commentary and research notes...",
        seed:
          "Help me interrogate my research - where do sources disagree, what should I weigh, what is interesting but does not belong in this sermon. Do not synthesize it into a sermon for me; help me think. Guard against research becoming the sermon. Here is what I gathered:\n\n",
      },
    ],
    enc: "You checked your work against the faithful without handing them the pen.",
  },
  {
    id: "aim",
    name: "The Aim",
    block: 1,
    focus:
      "Settle the target before you build. Name the Fallen Condition the text addresses, the author's intended meaning, and land one governing proposition. Rifle, not shotgun.",
    doItems: [
      "Identify the Fallen Condition Focus - the brokenness the text speaks to",
      "State the A.I.M. / Central Idea of the Text",
      "Write a present-tense proposition: my goal is for you to ___ so that ___",
      "Distill the one big idea that governs everything",
    ],
    actions: [
      {
        label: "Pressure-test my aim",
        placeholder: "Paste your FCF, big idea, and purpose statement...",
        seed:
          "Pressure-test my aim. Is there one governing big idea or several competing? Does it come from the text or a clever angle? Does the FCF genuinely arise from the passage? Does the purpose name what the sermon should do? Challenge me where it is unclear; do not rewrite it. Here is what I have:\n\n",
      },
    ],
    enc: "One clear shot. Now everything in the sermon serves that single target.",
  },
  {
    id: "gospel",
    name: "Gospel Center",
    block: 1,
    focus:
      "Make sure Christ is the hero. Show how the text necessitates, foreshadows, or elucidates Jesus - and how his grace empowers the obedience you will call for. The gospel is woven, not bolted on.",
    doItems: [
      "How does this text necessitate, foreshadow, or elucidate Christ?",
      "How does the grace of Jesus empower us to live out this text?",
      "Where does the gospel thread run through the whole message, not just the end?",
    ],
    actions: [
      {
        label: "Test my gospel connection",
        placeholder: "Paste your Christ connection or gospel thread...",
        seed:
          "Test my gospel connection. Is Christ genuinely the hero here, or have I drifted into moralism? Does the connection arise from the text or get forced? Is the gospel woven throughout or only tacked on at the end? Push only where it is weak or unclear. Here is my thinking:\n\n",
      },
    ],
    enc: "Christ is the hero, not a footnote. Keep him at the center all the way through.",
  },
  {
    id: "structure",
    name: "Structure & Outline",
    block: 2,
    focus:
      "Build the homiletical outline - 2 to 4 talking points that serve the proposition. Each point carries explanation, illustration, and application. Write your transitions explicitly.",
    doItems: [
      "Draft 2 to 4 points that support the proposition",
      "Under each: explanation, illustration, application",
      "Write each transition out word-for-word",
      "Confirm the structure flows from the text, not onto it",
    ],
    actions: [
      {
        label: "Check my outline",
        placeholder: "Paste your outline and transitions...",
        seed:
          "Check my outline. Does the structure flow from the text or get imposed on it? Does each point have explanation, illustration, and application? Is any point carrying too much? Are the transitions real moves or just labels? Do not rebuild it. Here it is:\n\n",
      },
    ],
    enc: "The bones are set, and they came from the text. Now we put flesh on them.",
  },
  {
    id: "application",
    name: "Application & Walk-Away",
    block: 2,
    focus:
      "Make it land in real life. Application must be specific, not general, religious, or vague - concrete changes for Monday. Then distill the one thing they will remember: the walk-away point.",
    doItems: [
      "Sharpen each application - concrete, real-life, specific",
      "Answer: So what? Why does this matter?",
      "Answer: Now what? What do they do with it?",
      "Write the walk-away in one clear, compelling sentence",
    ],
    actions: [
      {
        label: "Sharpen my application",
        placeholder: "Paste your applications and walk-away point...",
        seed:
          "Sharpen my application and walk-away. Is any application too general, religious, or vague? Does it deal with real life and give concrete next steps? Is the walk-away point clear, compelling, and connected to most of the room? Push only where it is soft. Here is what I have:\n\n",
      },
    ],
    enc: "You did not settle for vague and religious. Real people will know what to do Monday.",
  },
  {
    id: "invitation",
    name: "Invitation",
    block: 2,
    focus:
      "Leave the door open for someone to meet Jesus. Plan how you will call the unbeliever to respond - the transition into it, the call itself, and the simple action they will take.",
    doItems: [
      "Decide the type of invitation",
      "Write the transitional sentence that moves you into it",
      "Define the simple action to respond",
    ],
    actions: [
      {
        label: "Check my invitation",
        placeholder: "Paste your invitation and transition...",
        seed:
          "Check my invitation. Is the unbeliever clearly called to a decision? Is the transition into it natural, not abrupt? Is the response simple and clear? Push only where it is missing or muddy. Here is my plan:\n\n",
      },
    ],
    enc: "You left the door open for someone to meet Jesus. Never preach without it.",
  },
  {
    id: "introtitle",
    name: "Introduction & Title",
    block: 3,
    focus:
      "Now write the front door - last, on purpose. Grab attention in the first minutes, raise the fallen-condition tension, and move into your proposition. Then give the sermon a title that advertises its content.",
    doItems: [
      "Write an intro that grabs attention and raises the tension",
      "Land the transitional statement into your proposition",
      "Choose a title that reflects and advertises the message",
    ],
    actions: [
      {
        label: "React to my intro",
        placeholder: "Paste your introduction and title...",
        seed:
          "React to my introduction and title. Does the intro grab attention and raise the real tension or FCF? Does it move cleanly into the proposition? Does the title advertise the actual content? Push only where it drags or misses. Here it is:\n\n",
      },
    ],
    enc: "The front door is built. Now they will want to walk in.",
  },
  {
    id: "manuscript",
    name: "Manuscript",
    block: 3,
    focus:
      "Write it out, word for word, in your voice - clear, direct, pastoral, convictional, Scripture-saturated. You may not take the full manuscript to the pulpit, but writing it forces clarity. Pare it to preaching notes after.",
    doItems: [
      "Write the full manuscript: intro, points, gospel, conclusion, call",
      "Keep your voice - not academic, not fluffy, not social-media",
      "Pare down to a brief set of pulpit notes",
    ],
    actions: [
      {
        label: "Pressure-test my draft",
        placeholder: "Paste your manuscript...",
        seed:
          "Pressure-test my manuscript for clarity over cleverness, gospel centrality, pastoral force, and clutter. Tell me where it is vague, padded, or trying too hard, and whether it preaches to real people. Do not rewrite it. Here it is:\n\n",
      },
    ],
    enc: "The hard build is done. From here it is sharpening and surrender.",
  },
  {
    id: "readiness",
    name: "Readiness Check",
    block: 3,
    focus:
      "Before you call it ready, run the full check. This is where Preach Flow makes sure nothing is missing - the gospel, Christ as hero, illustrations, specific application, the invitation, and a clear landing.",
    doItems: [
      "Run the completeness and clarity check below",
      "Fix only what is genuinely missing or unclear",
      "Confirm it is ready to preach, not just written",
    ],
    actions: [
      {
        label: "Run completeness check",
        placeholder: "Paste your full sermon or manuscript...",
        seed:
          "Run a full completeness and clarity check on my sermon. For each element below tell me: PRESENT and clear, WEAK, or MISSING - and push only where something is genuinely missing or unclear. Affirm what is solid.\n- One clear big idea\n- Clear purpose (what it should do)\n- Structure flows from the text\n- Christ is the hero (Christ-centered, not moralistic)\n- Gospel woven throughout, not only at the end\n- Strong gospel landing\n- Explanation + illustration + application under each point\n- Concrete imagery in the illustrations\n- Specific application (not vague or merely religious)\n- Invitation that calls the unbeliever to a decision\n- Intro grabs attention and raises the tension\n- Conclusion presses the burden and calls for response\n- Clear walk-away point\nThen list exactly what to fix before Sunday. Here is the sermon:\n\n",
      },
    ],
    enc: "It is ready to preach. Now it is no longer a project - it is a trust.",
  },
  {
    id: "delivery",
    name: "Delivery Prep",
    block: 3,
    focus:
      "Get it into your body. Mark the sentences to emphasize, plan your delivery, time it, and rehearse aloud - with notes and without. Confidence in the pulpit is built here.",
    doItems: [
      "Write out the key sentences to emphasize, verbatim",
      "Mark delivery notes: tone, where to slow down, raise energy, pause",
      "Time a run-through against your goal length",
      "Practice aloud - with notes, then without",
    ],
    actions: [
      {
        label: "Coach my delivery plan",
        placeholder: "Paste your key sentences and delivery notes...",
        seed:
          "React to my delivery plan - key sentences to emphasize, tone/pacing notes, and timing. Where should I slow down, pause, or lift energy that I have not marked? Is anything too long for my target time? Here is my plan:\n\n",
      },
    ],
    enc: "You have put in the reps. Confidence in the pulpit is built in the study.",
  },
  {
    id: "heart",
    name: "Heart Prep",
    block: 3,
    devotional: true,
    focus:
      "The sermon is finished. Now prepare the preacher. Pray it in, invite honest feedback, and step into Sunday emptied of yourself and full of Christ.",
    doItems: [
      "Pray for boldness and freedom in the pulpit",
      "Pray for faithfulness to the text and illumination for all",
      "Pray for the specific people you will preach to",
      "Pray that the Word will not return void",
      "Pray to be yourself and forget yourself",
      "Ask 2 to 3 trusted people: What did I do well? What can I improve? Was the gospel preached?",
    ],
    enc:
      "The sermon is finished. Now prepare the preacher. Forget yourself, and lift up Christ.",
  },
];

const DEFAULT_DRAFT = {
  passage: "",
  title: "",
  date: "",
  series: "",
  length: "40",
  format: "Full manuscript",
};

const app = document.getElementById("app");
let bannerTimer = null;
let googleSyncTimer = null;
let googleTokenClient = null;
let googleSyncPaused = false;
let cloudSyncTimer = null;
let cloudSyncPaused = false;

const ui = {
  showNew: false,
  showAuth: false,
  showCoach: false,
  showSwitcher: false,
  showDetails: false,
  showGoogleDocs: false,
  signinMode: "signin",
  journalEditingId: "",
  journalDraft: {
    sermonId: "",
    phaseId: "",
    title: "",
    body: "",
  },
  banner: "",
  loading: false,
  reviewLoading: false,
  reviewResult: "",
  composer: "",
  composerPlaceholder: "Bring your work, or ask the coach a question...",
  serverStatus: { available: false, configured: false, checked: false },
  showOpenAIKey: false,
  openAIKeyInput: "",
  openai: {
    hasKey: Boolean(localStorage.getItem(OPENAI_KEY_STORE)),
  },
  auth: {
    configured: false,
    client: null,
    user: null,
    emailInput: "",
    passwordInput: "",
    loading: false,
    status: "Saved on this device",
    statusKey: "neutral",
  },
  google: {
    clientId: "",
    configured: false,
    connected: false,
    loading: false,
    status: "Google Docs not connected",
    statusKey: "neutral",
    accessToken: "",
  },
};

const state = loadState();
if (!state.theme) state.theme = loadTheme();
if (!state.view) state.view = "workspace";
if (!state.query) state.query = "";
if (!state.filter) state.filter = "all";
if (!state.reviewMeta) state.reviewMeta = { passage: "", title: "" };
if (!state.reviewText) state.reviewText = "";
if (!state.reviewChecks || typeof state.reviewChecks !== "object") state.reviewChecks = {};
if (!state.google) state.google = { autoSync: true };
if (!Array.isArray(state.journalEntries)) state.journalEntries = [];

function loadTheme() {
  const stored = localStorage.getItem(THEME_STORE);
  if (stored === "light" || stored === "dark") return stored;
  return "light";
}

function setTheme(theme) {
  state.theme = theme === "dark" ? "dark" : "light";
  localStorage.setItem(THEME_STORE, state.theme);
  render();
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    return {
      sermons: Array.isArray(parsed.sermons) ? parsed.sermons.map(normalizeSermon) : [],
      activeId: parsed.activeId || null,
      view: parsed.view || "workspace",
      query: parsed.query || "",
      filter: parsed.filter || "all",
      reviewMeta: parsed.reviewMeta || { passage: "", title: "" },
      reviewText: parsed.reviewText || "",
      reviewChecks: parsed.reviewChecks && typeof parsed.reviewChecks === "object" ? parsed.reviewChecks : {},
      google: parsed.google || { autoSync: true },
      journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries.map(normalizeJournalEntry) : [],
    };
  } catch {
    return {
      sermons: [],
      activeId: null,
      view: "workspace",
      query: "",
      filter: "all",
      reviewMeta: { passage: "", title: "" },
      reviewText: "",
      google: { autoSync: true },
      journalEntries: [],
    };
  }
}

function saveState() {
  const snapshot = stateSnapshot();
  localStorage.setItem(
    STORE_KEY,
    JSON.stringify(snapshot),
  );
  if (!googleSyncPaused) scheduleGoogleSync();
  if (!cloudSyncPaused) scheduleCloudSync();
}

function stateSnapshot() {
  return {
    sermons: state.sermons,
    activeId: state.activeId,
    view: state.view,
    query: state.query,
    filter: state.filter,
    reviewMeta: state.reviewMeta,
    reviewText: state.reviewText,
    reviewChecks: state.reviewChecks,
    google: state.google,
    journalEntries: state.journalEntries,
  };
}

function applyStateSnapshot(snapshot) {
  state.sermons = Array.isArray(snapshot?.sermons) ? snapshot.sermons.map(normalizeSermon) : [];
  state.activeId = snapshot?.activeId || state.sermons[0]?.id || null;
  if (state.activeId && !state.sermons.some((sermon) => sermon.id === state.activeId)) {
    state.activeId = state.sermons[0]?.id || null;
  }
  state.view = snapshot?.view || "workspace";
  state.query = snapshot?.query || "";
  state.filter = snapshot?.filter || "all";
  state.reviewMeta = snapshot?.reviewMeta || { passage: "", title: "" };
  state.reviewText = snapshot?.reviewText || "";
  state.reviewChecks = snapshot?.reviewChecks && typeof snapshot.reviewChecks === "object" ? snapshot.reviewChecks : {};
  state.google = snapshot?.google || { autoSync: true };
  state.journalEntries = Array.isArray(snapshot?.journalEntries) ? snapshot.journalEntries.map(normalizeJournalEntry) : [];
}

function normalizeSermon(sermon) {
  return {
    id: sermon.id || genId(),
    passage: sermon.passage || "",
    title: sermon.title || "",
    date: sermon.date || "",
    series: sermon.series || "",
    length: sermon.length || "40",
    format: sermon.format || "Full manuscript",
    completed: Array.isArray(sermon.completed) ? sermon.completed : [],
    activePhase: sermon.activePhase || "plan",
    thread: Array.isArray(sermon.thread) ? sermon.thread : [],
    notes: migratePhaseNotes(sermon.notes && typeof sermon.notes === "object" ? sermon.notes : {}),
    checklist: sermon.checklist && typeof sermon.checklist === "object" ? sermon.checklist : {},
    googleDoc:
      sermon.googleDoc && typeof sermon.googleDoc === "object"
        ? {
            id: sermon.googleDoc.id || "",
            url: sermon.googleDoc.url || "",
            title: sermon.googleDoc.title || "",
            syncedAt: sermon.googleDoc.syncedAt || "",
          }
        : null,
    createdAt: sermon.createdAt || new Date().toISOString(),
    updatedAt: sermon.updatedAt || new Date().toISOString(),
  };
}

// The redesign uses one rich-text writing canvas per phase, stored at
// notes[phaseId]. Earlier builds stored a note per focus item at
// notes[`${phaseId}::${index}`]. Fold any legacy per-item notes into the
// single per-phase note so existing work is preserved.
function migratePhaseNotes(notes) {
  const next = { ...notes };
  for (const phase of PHASES) {
    const itemKeys = Object.keys(next).filter((key) => key.startsWith(`${phase.id}::`));
    if (!itemKeys.length) continue;
    const existing = typeof next[phase.id] === "string" ? next[phase.id] : "";
    const pieces = [];
    if (existing.trim()) pieces.push(existing);
    itemKeys
      .sort((a, b) => Number(a.split("::")[1]) - Number(b.split("::")[1]))
      .forEach((key) => {
        const html = typeof next[key] === "string" ? next[key] : "";
        if (html.trim()) pieces.push(html);
        delete next[key];
      });
    if (pieces.length) next[phase.id] = pieces.join("<br>");
  }
  return next;
}

function normalizeJournalEntry(entry) {
  const now = new Date().toISOString();
  return {
    id: entry.id || genId(),
    sermonId: entry.sermonId || "",
    phaseId: entry.phaseId || "",
    title: entry.title || "",
    body: entry.body || "",
    createdAt: entry.createdAt || now,
    updatedAt: entry.updatedAt || entry.createdAt || now,
  };
}

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function attr(value) {
  return escapeHtml(value);
}

function sanitizeRichHtml(value) {
  const template = document.createElement("template");
  template.innerHTML = String(value || "");
  const allowed = new Set(["B", "STRONG", "I", "EM", "UL", "OL", "LI", "DIV", "P", "BR"]);
  for (const node of [...template.content.querySelectorAll("*")]) {
    if (!allowed.has(node.tagName)) {
      node.replaceWith(...node.childNodes);
      continue;
    }
    for (const attrNode of [...node.attributes]) {
      node.removeAttribute(attrNode.name);
    }
  }
  return template.innerHTML;
}

function richHtmlToText(value) {
  const template = document.createElement("template");
  template.innerHTML = sanitizeRichHtml(value);
  for (const li of template.content.querySelectorAll("li")) {
    li.prepend("- ");
    li.append("\n");
  }
  for (const block of template.content.querySelectorAll("div,p,br")) {
    block.append("\n");
  }
  return template.content.textContent.replace(/\n{3,}/g, "\n\n").trim();
}

function getActive() {
  return state.sermons.find((sermon) => sermon.id === state.activeId) || null;
}

function getPhase(sermon) {
  return PHASES.find((phase) => phase.id === sermon?.activePhase) || PHASES[0];
}

function updateActive(patch) {
  state.sermons = state.sermons.map((sermon) =>
    sermon.id === state.activeId
      ? { ...sermon, ...patch, updatedAt: new Date().toISOString() }
      : sermon,
  );
  saveState();
}

function fmtDate(date) {
  if (!date) return "";
  return new Date(`${date}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatTime(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

function daysUntil(date) {
  if (!date) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((new Date(`${date}T00:00:00`) - today) / 86400000);
}

function expectedDone(daysOut) {
  if (daysOut === null) return null;
  if (daysOut >= 28) return 0;
  if (daysOut >= 22) return 4;
  if (daysOut >= 15) return 7;
  if (daysOut >= 8) return 10;
  if (daysOut >= 4) return 12;
  if (daysOut >= 3) return 14;
  return PHASES.length;
}

function expectedBlock(daysOut) {
  if (daysOut === null) return null;
  if (daysOut >= 22) return 0;
  if (daysOut >= 15) return 1;
  if (daysOut >= 8) return 2;
  return 3;
}

function progressPct(sermon) {
  return Math.round((sermon.completed.length / PHASES.length) * 100);
}

function sermonStatus(sermon) {
  const days = daysUntil(sermon.date);
  const expected = expectedDone(days);
  if (expected === null) {
    return { label: "No date", key: "neutral", days, expected };
  }
  if (sermon.completed.length > expected) {
    return { label: "Ahead", key: "ahead", days, expected };
  }
  if (sermon.completed.length === expected) {
    return { label: "On track", key: "on-track", days, expected };
  }
  return {
    label: `Behind ${expected - sermon.completed.length}`,
    key: "behind",
    days,
    expected,
  };
}

function loadingDots() {
  return '<span class="pf-dots"><i></i><i></i><i></i></span>';
}

function render() {
  const active = getActive();
  const focus = captureFocus();
  const overlays = `
    ${ui.showAuth ? renderAuthPanel() : ""}
    ${ui.showOpenAIKey ? renderOpenAIKeyPanel() : ""}
    ${ui.showSwitcher ? renderSwitcherModal(active) : ""}
    ${ui.showDetails && active ? renderDetailsModal(active) : ""}
    ${ui.showGoogleDocs && active ? renderGoogleDocsModal(active) : ""}
  `;

  if (state.view === "signin") {
    app.innerHTML = `
      <div class="pf-root pf-fade" data-theme="${attr(state.theme)}">
        ${renderSignin(active)}
        ${overlays}
      </div>
    `;
    restoreFocus(focus);
    return;
  }

  app.innerHTML = `
    <div class="pf-root" data-theme="${attr(state.theme)}">
      ${renderTopbar(active)}
      ${ui.banner ? `<div class="pf-banner">${escapeHtml(ui.banner)}</div>` : ""}
      ${renderMain(active)}
      ${overlays}
    </div>
  `;
  restoreFocus(focus);
  requestAnimationFrame(() => {
    const thread = document.querySelector("[data-thread]");
    if (thread) thread.scrollTop = thread.scrollHeight;
  });
}

function captureFocus() {
  const element = document.activeElement;
  if (!element || !element.dataset?.action) return null;
  return {
    action: element.dataset.action,
    phase: element.dataset.phase || "",
    noteKey: element.dataset.noteKey || "",
    start: typeof element.selectionStart === "number" ? element.selectionStart : null,
    end: typeof element.selectionEnd === "number" ? element.selectionEnd : null,
  };
}

function restoreFocus(focus) {
  if (!focus) return;
  requestAnimationFrame(() => {
    let element = null;
    if (focus.noteKey) {
      element = [...document.querySelectorAll(`[data-action="${focus.action}"]`)].find(
        (item) => item.dataset.noteKey === focus.noteKey,
      );
    } else {
      const selector = `[data-action="${focus.action}"]${focus.phase ? `[data-phase="${focus.phase}"]` : ""}`;
      element = document.querySelector(selector);
    }
    if (!element) return;
    element.focus({ preventScroll: true });
    if (focus.start !== null && typeof element.setSelectionRange === "function") {
      element.setSelectionRange(focus.start, focus.end ?? focus.start);
    }
  });
}

const BRAND_MARK_SVG = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#20242A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7c-1.5-1.3-3.6-2-6-2H3v13h3c2.4 0 4.5.7 6 2"/><path d="M12 7c1.5-1.3 3.6-2 6-2h3v13h-3c-2.4 0-4.5.7-6 2z"/><path d="M12 7v12"/></svg>`;

const NAV_ITEMS = [
  ["workspace", "Workspace"],
  ["pipeline", "Pipeline"],
  ["journal", "Notes"],
  ["review", "Review"],
];

function accountInitial() {
  const email = ui.auth.user?.email || "";
  return email ? email.trim().charAt(0).toUpperCase() : "M";
}

function renderTopbar(active) {
  const avatarKey = ui.auth.user ? "ready" : ui.auth.configured ? "neutral" : "missing";
  return `
    <header class="pf-topbar">
      <button class="pf-brand" type="button" data-view="workspace" aria-label="Preach Flow workspace">
        <span class="pf-brand-mark">${BRAND_MARK_SVG}</span>
        <span class="pf-brand-text">Preach <span>Flow</span></span>
      </button>
      <nav class="pf-nav">
        ${NAV_ITEMS.map(
          ([view, label]) =>
            `<button class="pf-nav-btn ${state.view === view ? "active" : ""}" data-view="${view}">${label}</button>`,
        ).join("")}
      </nav>
      <div class="pf-top-right">
        <button class="pf-icon-btn" data-action="toggle-theme" aria-label="Toggle theme" title="Toggle light / dark">
          ${
            state.theme === "dark"
              ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`
              : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>`
          }
        </button>
        <button class="pf-avatar" data-action="go-signin" aria-label="Account">${escapeHtml(accountInitial())}<i class="pf-avatar-dot ${avatarKey}"></i></button>
      </div>
    </header>
  `;
}

function renderAuthPanel() {
  return `
    <div class="pf-overlay" data-action="close-auth-panel" data-overlay>
      <div class="pf-modal" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Account</span>
          <h2 class="pf-modal-title">Account &amp; sync</h2>
        </div>
        ${
          ui.auth.user
            ? `<p class="pf-modal-text">Signed in as <strong>${escapeHtml(ui.auth.user.email || "your account")}</strong>. ${escapeHtml(ui.auth.status)}</p>
               <div class="pf-modal-actions">
                 <button class="pf-btn pf-btn-primary" data-action="cloud-sync-now" ${ui.auth.loading ? "disabled" : ""}>Sync now</button>
                 <button class="pf-btn" data-action="sign-out" ${ui.auth.loading ? "disabled" : ""}>Sign out</button>
                 <button class="pf-btn pf-btn-ghost" data-action="close-auth-panel">Close</button>
               </div>`
            : `<p class="pf-modal-text">Open the sign-in screen to log in with email, password, or Google.</p>
               <div class="pf-modal-actions">
                 <button class="pf-btn pf-btn-primary" data-action="go-signin">Open sign-in</button>
                 <button class="pf-btn pf-btn-ghost" data-action="close-auth-panel">Close</button>
               </div>`
        }
      </div>
    </div>
  `;
}

function renderOpenAIKeyPanel() {
  return `
    <div class="pf-overlay" data-action="close-openai-key" data-overlay>
      <div class="pf-modal" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Coach engine</span>
          <h2 class="pf-modal-title">Use your own OpenAI key</h2>
        </div>
        <p class="pf-modal-text">Preach Flow does not use a shared server key. Each user adds their own OpenAI API key, stored only in this browser and sent over HTTPS for coach and review requests.</p>
        <div class="pf-field">
          <label class="pf-label" for="openai-key">OpenAI API key</label>
          <input id="openai-key" class="pf-input" type="password" data-action="openai-key-input" value="${attr(ui.openAIKeyInput)}" placeholder="sk-proj-..." autocomplete="off" />
        </div>
        <div class="pf-modal-actions">
          <button class="pf-btn pf-btn-primary" data-action="save-openai-key">Save key</button>
          <button class="pf-btn" data-action="clear-openai-key">Remove key</button>
          <button class="pf-btn pf-btn-ghost" data-action="close-openai-key">Close</button>
        </div>
        <p class="pf-helper">For a public app, visitors should use keys from their own OpenAI Platform accounts so usage bills to them, not to you.</p>
      </div>
    </div>
  `;
}

const GOOGLE_G_SVG = `<svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"/></svg>`;

function renderSignin(active) {
  if (ui.auth.user) return renderAccount(active);
  const creating = ui.signinMode === "signup";
  const disabled = ui.auth.loading || !ui.auth.configured;
  return `
    <div class="pf-signin-wrap">
      <div class="pf-signin-inner">
        <div style="margin-bottom:14px;">
          ${active || state.sermons.length ? `<button class="pf-btn pf-btn-ghost" data-action="close-signin">&larr; Back</button>` : ""}
        </div>
        <div class="pf-signin-head">
          <span class="pf-signin-mark">${BRAND_MARK_SVG.replace('width="18" height="18"', 'width="24" height="24"')}</span>
          <h1 class="pf-signin-title">${creating ? "Create your account" : "Welcome back"}</h1>
          <p class="pf-signin-subtitle">${creating ? "Start moving from the text to the pulpit." : "Pick up your prep right where you left it."}</p>
        </div>
        <div class="pf-signin-card">
          <button class="pf-google-btn" data-action="google-signin" ${disabled ? "disabled" : ""}>
            ${GOOGLE_G_SVG}
            Continue with Google
          </button>
          <div class="pf-divider"><i></i><span>or</span><i></i></div>
          <div class="pf-field">
            <label class="pf-label" for="signin-email">Email</label>
            <input id="signin-email" class="pf-input" type="email" data-action="auth-email-input" value="${attr(ui.auth.emailInput)}" placeholder="you@example.com" autocomplete="email" />
          </div>
          <div class="pf-field">
            <div class="pf-label-row">
              <label class="pf-label" for="signin-password">Password</label>
              ${creating ? "" : `<button class="pf-forgot" data-action="forgot-password">Forgot?</button>`}
            </div>
            <input id="signin-password" class="pf-input" type="password" data-action="auth-password-input" value="${attr(ui.auth.passwordInput)}" placeholder="••••••••" autocomplete="${creating ? "new-password" : "current-password"}" />
          </div>
          <button class="pf-signin-submit" data-action="${creating ? "password-signup" : "password-signin"}" ${disabled ? "disabled" : ""}>
            ${ui.auth.loading ? "Working…" : creating ? "Create account" : "Sign in"}
          </button>
          <div class="pf-signin-magic">
            <button data-action="send-magic-link" ${disabled ? "disabled" : ""}>Prefer a one-time email link? <span>Send me a link</span></button>
          </div>
          ${
            ui.auth.configured
              ? `<p class="pf-signin-status ${attr(ui.auth.statusKey)}" data-auth-panel-status>${escapeHtml(ui.auth.status)}</p>`
              : `<p class="pf-signin-status missing">Accounts need setup — add <code>SUPABASE_URL</code> and <code>SUPABASE_ANON_KEY</code> in Vercel. Your work is saved on this device meanwhile.</p>`
          }
        </div>
        <p class="pf-signin-footer">
          ${
            creating
              ? `Already have an account? <button data-action="signin-mode-signin">Sign in</button>`
              : `New to Preach Flow? <button data-action="signin-mode-signup">Create an account</button>`
          }
        </p>
      </div>
    </div>
  `;
}

function renderAccount(active) {
  return `
    <div class="pf-signin-wrap">
      <div class="pf-signin-inner">
        <div style="margin-bottom:14px;">
          <button class="pf-btn pf-btn-ghost" data-action="close-signin">&larr; Back to workspace</button>
        </div>
        <div class="pf-signin-head">
          <span class="pf-avatar" style="width:46px;height:46px;font-size:18px;margin-bottom:16px;">${escapeHtml(accountInitial())}</span>
          <h1 class="pf-signin-title">Your account</h1>
          <p class="pf-signin-subtitle">${escapeHtml(ui.auth.user.email || "Signed in")}</p>
        </div>
        <div class="pf-signin-card">
          <div class="pf-account-row">
            <div style="flex:1;">
              <div class="pf-account-label">Cloud sync</div>
              <div class="pf-account-meta" data-auth-panel-status>${escapeHtml(ui.auth.status)}</div>
            </div>
            <button class="pf-btn pf-btn-primary" data-action="cloud-sync-now" ${ui.auth.loading ? "disabled" : ""}>Sync now</button>
          </div>
          <div class="pf-account-row">
            <div style="flex:1;">
              <div class="pf-account-label">Coach engine</div>
              <div class="pf-account-meta">${ui.openai.hasKey ? "OpenAI key added on this device" : "No OpenAI key yet"}</div>
            </div>
            <button class="pf-btn" data-action="openai-key">${ui.openai.hasKey ? "Manage key" : "Add key"}</button>
          </div>
          <div class="pf-account-row">
            <div style="flex:1;">
              <div class="pf-account-label">Appearance</div>
              <div class="pf-account-meta">${state.theme === "dark" ? "Dark theme" : "Light theme"}</div>
            </div>
            <button class="pf-btn" data-action="toggle-theme">Toggle</button>
          </div>
          <div class="pf-account-actions">
            <button class="pf-btn pf-btn-danger" data-action="sign-out" ${ui.auth.loading ? "disabled" : ""}>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderMain(active) {
  if (ui.showNew) return renderNewSermon();
  if (state.view === "pipeline") return renderPipeline();
  if (state.view === "journal") return renderJournal(active);
  if (state.view === "review") return renderReview();
  if (active) return renderWorkspace(active);
  return renderNewSermon();
}

function renderEmpty() {
  return `
    <section class="empty-state">
      <div class="panel empty-hero">
        <img src="./assets/preach-flow-mark.svg" alt="" />
        <div>
          <span class="eyebrow">Sermon workspace</span>
          <h1 class="title">Preach Flow</h1>
        </div>
        <p>A focused sermon-prep workspace for exegesis, research, outline, application, manuscript review, and delivery.</p>
        <div class="action-row">
          <button class="btn btn-primary" data-action="new-sermon">+ Sermon</button>
          <button class="btn" data-view="review">Review</button>
        </div>
      </div>
      <div class="quick-actions">
        <div class="panel quick-card">
          <h3>Build from the text</h3>
          <p>Move through the full prep path with phase notes and coaching prompts.</p>
          <button class="btn btn-primary" data-action="new-sermon">Start</button>
        </div>
        <div class="panel quick-card">
          <h3>Bring a finished sermon</h3>
          <p>Run the completeness review against the core preaching framework.</p>
          <button class="btn" data-view="review">Review</button>
        </div>
      </div>
    </section>
  `;
}

function renderNewSermon() {
  return `
    <div class="pf-page pf-page-narrow pf-fade">
      <div class="pf-page-head" style="margin-bottom:22px;">
        <div>
          <span class="pf-eyebrow pf-eyebrow-brand">New sermon</span>
          <h1 class="pf-h1">Start a sermon</h1>
        </div>
      </div>
      <form class="pf-form" data-form="new-sermon">
        <div class="pf-form-grid">
          <div class="pf-field full">
            <label class="pf-label" for="new-passage">Passage</label>
            <input id="new-passage" class="pf-input" name="passage" placeholder="Ephesians 3:1-13" required />
          </div>
          <div class="pf-field full">
            <label class="pf-label" for="new-title">Working title</label>
            <input id="new-title" class="pf-input" name="title" placeholder="The Church on Display" />
          </div>
          <div class="pf-field">
            <label class="pf-label" for="new-date">Preaching date</label>
            <input id="new-date" class="pf-input" type="date" name="date" />
          </div>
          <div class="pf-field">
            <label class="pf-label" for="new-length">Length (min)</label>
            <input id="new-length" class="pf-input" name="length" inputmode="numeric" value="${attr(DEFAULT_DRAFT.length)}" />
          </div>
          <div class="pf-field">
            <label class="pf-label" for="new-series">Series</label>
            <input id="new-series" class="pf-input" name="series" placeholder="Family Matters" />
          </div>
          <div class="pf-field">
            <label class="pf-label" for="new-format">Deliverable</label>
            <select id="new-format" class="pf-select" name="format">
              <option>Full manuscript</option>
              <option>Preaching notes</option>
            </select>
          </div>
        </div>
        <div class="pf-form-actions">
          <button class="pf-btn pf-btn-primary" type="submit">Begin prep</button>
          ${state.sermons.length ? `<button class="pf-btn pf-btn-ghost" type="button" data-action="cancel-new">Cancel</button>` : ""}
        </div>
      </form>
    </div>
  `;
}

const PIPELINE_FILTERS = [
  ["all", "All"],
  ["behind", "Behind"],
  ["on-track", "On track"],
  ["ahead", "Ahead"],
  ["done", "Preached"],
];

function cardStatus(sermon) {
  if (sermon.completed.length >= PHASES.length) {
    return { key: "done", label: "Preached", days: daysUntil(sermon.date) };
  }
  const status = sermonStatus(sermon);
  const labels = { "on-track": "On track", ahead: "Ahead", behind: "Behind", neutral: "No date" };
  return { key: status.key, label: labels[status.key] || status.label, days: status.days };
}

function sermonMovementLabel(sermon) {
  if (sermon.completed.length >= PHASES.length) return "Delivered";
  if (!sermon.completed.length && sermon.activePhase === "plan") return "Not started";
  const phase = PHASES.find((item) => item.id === sermon.activePhase) || PHASES[0];
  return BLOCKS[phase.block].label;
}

function renderPipeline() {
  const query = state.query.trim().toLowerCase();
  const sermons = state.sermons
    .filter((sermon) => {
      const haystack = [sermon.passage, sermon.title, sermon.series].join(" ").toLowerCase();
      return !query || haystack.includes(query);
    })
    .filter((sermon) => {
      if (state.filter === "all") return true;
      return cardStatus(sermon).key === state.filter;
    })
    .sort((a, b) => {
      if (!a.date && !b.date) return a.createdAt.localeCompare(b.createdAt);
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });

  return `
    <div class="pf-page pf-page-wide pf-fade">
      <div class="pf-page-head">
        <div>
          <span class="pf-eyebrow pf-eyebrow-brand">Pipeline</span>
          <h1 class="pf-h1">Sermons in motion</h1>
        </div>
        <button class="pf-btn pf-btn-primary" style="margin-left:auto;" data-action="new-sermon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
          New sermon
        </button>
      </div>
      <div class="pf-tools">
        <div class="pf-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          <input data-action="pipeline-query" value="${attr(state.query)}" placeholder="Search passage, title, or series" />
        </div>
        <div class="pf-filter-chips">
          ${PIPELINE_FILTERS.map(
            ([value, label]) =>
              `<button class="pf-chip ${state.filter === value ? "active" : ""}" data-action="pipeline-filter" data-filter="${value}">${label}</button>`,
          ).join("")}
          <button class="pf-btn pf-btn-ghost" data-action="export-all">Export all</button>
        </div>
      </div>
      ${
        sermons.length
          ? `<div class="pf-cards">${sermons.map(renderSermonCard).join("")}</div>`
          : `<div class="pf-empty">No sermons match this view.</div>`
      }
    </div>
  `;
}

function renderSermonCard(sermon) {
  const status = cardStatus(sermon);
  const pct = progressPct(sermon);
  const fillClass = status.key === "behind" ? "behind" : status.key === "done" ? "done" : "";
  const daysLabel =
    status.key === "done"
      ? "Preached"
      : status.days === null
        ? "No date"
        : status.days < 0
          ? `${Math.abs(status.days)} days ago`
          : `${status.days} days out`;
  return `
    <article class="pf-card" data-sermon-card="${attr(sermon.id)}" tabindex="0">
      <div class="pf-card-top">
        <div style="min-width:0;">
          <h3 class="pf-card-passage">${escapeHtml(sermon.passage || "Untitled sermon")}</h3>
          <div class="pf-card-sub">${escapeHtml(sermon.title || "Untitled")} · ${escapeHtml(sermon.series || "No series")}</div>
        </div>
        <span class="pf-badge ${status.key}">${escapeHtml(status.label)}</span>
      </div>
      <div class="pf-card-date">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
        ${sermon.date ? escapeHtml(fmtDate(sermon.date)) : "No date set"} <span class="sep">·</span> ${escapeHtml(daysLabel)}
      </div>
      <div class="pf-progress-track"><div class="pf-progress-fill ${fillClass}" style="width:${pct}%;"></div></div>
      <div class="pf-card-foot">
        <span>${escapeHtml(sermonMovementLabel(sermon))}</span>
        <span class="pct">${pct}%</span>
      </div>
    </article>
  `;
}

// ---- per-phase note + checklist storage ----
function noteItemKey(phaseId, index) {
  return `${phaseId}::${index}`;
}

function phaseNoteHtml(sermon, phase) {
  const value = sermon?.notes?.[phase.id];
  return typeof value === "string" ? value : "";
}

function phaseNoteText(sermon, phase) {
  return richHtmlToText(phaseNoteHtml(sermon, phase));
}

function isChecked(sermon, phaseId, index) {
  return Boolean(sermon?.checklist?.[noteItemKey(phaseId, index)]);
}

function phaseCheckCount(sermon, phase) {
  return phase.doItems.reduce((count, _item, index) => count + (isChecked(sermon, phase.id, index) ? 1 : 0), 0);
}

// kept for export + Google Docs sync (now reads the single per-phase note)
function getPhaseFocusNotesText(sermon, phase) {
  return phaseNoteText(sermon, phase);
}

const SVG_CHECK = (size, stroke) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#20242A" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

function renderWorkspace(active) {
  const phase = getPhase(active);
  return `
    <div class="pf-fade">
      ${renderContextStrip(active, phase)}
      <div class="pf-ws-grid">
        ${renderRail(active, phase)}
        ${renderCanvas(active, phase)}
      </div>
      ${renderCoachComposer(active, phase)}
    </div>
  `;
}

function renderContextStrip(active, phase) {
  const status = sermonStatus(active);
  const days = status.days;
  const daysOut = days === null ? "—" : days < 0 ? `${Math.abs(days)}` : `${days}`;
  const daysLabel = days === null ? "no date set" : days < 0 ? "days ago" : "until Sunday";

  const movements = BLOCKS.map((block, bi) => {
    const phasesInBlock = PHASES.filter((p) => p.block === bi);
    const done = phasesInBlock.every((p) => active.completed.includes(p.id));
    const isActive = bi === phase.block;
    const state = isActive ? "active" : done ? "done" : "upcoming";
    const labelState = isActive ? "active" : done ? "done" : "upcoming";
    const connDone = bi <= phase.block && BLOCKS.slice(0, bi).every((_b, k) =>
      PHASES.filter((p) => p.block === k).every((p) => active.completed.includes(p.id)),
    );
    return { block, bi, state, labelState, done: done && !isActive, conn: bi > 0, connDone };
  });

  return `
    <div class="pf-context">
      <div class="pf-context-strip">
        <button class="pf-switcher" data-action="open-switcher">
          <div>
            <div class="pf-switcher-passage">${escapeHtml(active.passage || "Untitled sermon")}</div>
            <div class="pf-switcher-sub">${escapeHtml(active.title || "Untitled")} · ${escapeHtml(active.series || "No series")}</div>
          </div>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="pf-stats">
          <div class="pf-stat"><div class="pf-stat-num">${escapeHtml(daysOut)} days</div><div class="pf-stat-label">${escapeHtml(daysLabel)}</div></div>
          <div class="pf-stat-div"></div>
          <div class="pf-stat"><div class="pf-stat-num">${escapeHtml(active.length || "—")} min</div><div class="pf-stat-label">target length</div></div>
        </div>
      </div>
      <div class="pf-journey">
        ${movements
          .map(
            (m) => `
              ${m.conn ? `<div class="pf-journey-conn ${m.connDone ? "done" : ""}"></div>` : ""}
              <button class="pf-journey-node-wrap" data-action="journey-jump" data-block="${m.bi}">
                <span class="pf-journey-node ${m.state}">${m.done ? SVG_CHECK(15, 3) : m.bi + 1}</span>
                <span class="pf-journey-label pf-journey-labels ${m.labelState}">${escapeHtml(m.block.label)}</span>
              </button>
            `,
          )
          .join("")}
        <span class="pf-journey-ready"><span>${progressPct(active)}%</span> ready</span>
      </div>
    </div>
  `;
}

function renderRail(active, phase) {
  const phasesInMovement = PHASES.filter((p) => p.block === phase.block);
  const curIdx = PHASES.findIndex((p) => p.id === phase.id);
  return `
    <aside class="pf-rail">
      <div class="pf-rail-eyebrow">Movement ${phase.block + 1} · ${escapeHtml(BLOCKS[phase.block].label)}</div>
      <div class="pf-rail-list">
        ${phasesInMovement
          .map((p) => {
            const done = active.completed.includes(p.id);
            const current = p.id === phase.id;
            const dotClass = done ? "done" : current ? "current" : "upcoming";
            return `
              <button class="pf-phase-row ${current ? "active" : ""}" data-action="set-phase" data-phase="${attr(p.id)}">
                <span class="pf-phase-dot ${dotClass}">${done ? SVG_CHECK(10, 3.5) : ""}</span>
                <span class="pf-phase-name">${escapeHtml(p.name)}</span>
                ${p.devotional ? `<span class="pf-phase-star" title="Devotional">✦</span>` : ""}
              </button>
            `;
          })
          .join("")}
      </div>
      <div class="pf-rail-nav">
        <button class="pf-rail-nav-btn" data-action="prev-phase" ${curIdx <= 0 ? "disabled" : ""}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>Prev</button>
        <button class="pf-rail-nav-btn" data-action="next-phase" ${curIdx >= PHASES.length - 1 ? "disabled" : ""}>Next<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg></button>
      </div>
    </aside>
  `;
}

function renderCanvas(active, phase) {
  const curIdx = PHASES.findIndex((p) => p.id === phase.id);
  const complete = active.completed.includes(phase.id);
  return `
    <main class="pf-canvas">
      <div class="pf-canvas-eyebrow">${escapeHtml(BLOCKS[phase.block].label)} · ${escapeHtml(BLOCKS[phase.block].when)} · Phase ${curIdx + 1} of ${PHASES.length}</div>
      <h1 class="pf-phase-title">${escapeHtml(phase.name)}</h1>
      <p class="pf-phase-focus">${escapeHtml(phase.focus)}</p>
      ${renderChecklistCard(active, phase)}
      ${renderWriterCard(active, phase)}
      <div class="pf-complete-row">
        <button class="pf-btn ${complete ? "" : "pf-btn-primary"}" data-action="toggle-complete" data-phase="${attr(phase.id)}">
          ${complete ? "Phase complete · undo" : "Mark phase complete"}
        </button>
        <button class="pf-btn pf-btn-ghost" data-action="export-active">Export</button>
        <button class="pf-btn pf-btn-ghost" data-action="copy-active">Copy</button>
      </div>
    </main>
  `;
}

function renderChecklistCard(active, phase) {
  return `
    <section class="pf-card-box pf-checklist-card">
      <div class="pf-checklist-head">
        <span class="pf-eyebrow">This phase</span>
        <span class="pf-checklist-count">${phaseCheckCount(active, phase)} / ${phase.doItems.length}</span>
      </div>
      <div class="pf-checklist-items">
        ${phase.doItems
          .map((item, index) => {
            const done = isChecked(active, phase.id, index);
            return `
              <button class="pf-check-item" data-action="toggle-check" data-phase="${attr(phase.id)}" data-index="${index}">
                <span class="pf-check-box ${done ? "done" : ""}">${done ? SVG_CHECK(12, 3.5) : ""}</span>
                <span class="pf-check-text ${done ? "done" : ""}">${escapeHtml(item)}</span>
              </button>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function syncIndicator(active) {
  const doc = active.googleDoc;
  if (doc?.id) {
    const key = ui.google.statusKey === "syncing" ? "syncing" : ui.google.statusKey === "missing" ? "missing" : "synced";
    const text = ui.google.status || (doc.syncedAt ? `Synced ${formatTime(doc.syncedAt)}` : "Synced to Google Docs");
    return { key, text };
  }
  if (ui.google.configured) return { key: "missing", text: "Connect Google Docs" };
  return { key: "", text: "Saved on this device" };
}

function renderWriterCard(active, phase) {
  const sync = syncIndicator(active);
  return `
    <section class="pf-card-box pf-writer-card">
      <div class="pf-writer-head">
        <span class="pf-writer-eyebrow">Your work</span>
        <button class="pf-sync-status ${sync.key}" data-action="open-google-docs" title="Google Docs sync">
          <span class="pf-sync-dot"></span>${escapeHtml(sync.text)}
        </button>
      </div>
      <div class="pf-toolbar" aria-label="Text formatting">
        <button class="pf-tool-pill" data-action="format-doc" data-format="h3" title="Heading">Heading <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg></button>
        <span class="pf-tool-div"></span>
        <button class="pf-tool-btn serif b" data-action="format-doc" data-format="bold" title="Bold">B</button>
        <button class="pf-tool-btn serif i" data-action="format-doc" data-format="italic" title="Italic">I</button>
        <button class="pf-tool-btn serif u" data-action="format-doc" data-format="underline" title="Underline">U</button>
        <span class="pf-tool-div"></span>
        <button class="pf-tool-btn" data-action="format-doc" data-format="ul" title="Bulleted list"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg></button>
        <button class="pf-tool-btn" data-action="format-doc" data-format="ol" title="Numbered list"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg></button>
        <span class="pf-tool-div"></span>
        <button class="pf-tool-quote" data-action="format-doc" data-format="quote" title="Scripture block"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>Scripture</button>
      </div>
      <div
        class="pf-editor pf-scroll"
        contenteditable="true"
        spellcheck="false"
        data-action="phase-editor"
        data-phase="${attr(phase.id)}"
        data-placeholder="Start writing your work for this phase…"
      >${sanitizeRichHtml(phaseNoteHtml(active, phase))}</div>
    </section>
  `;
}

const COACH_SPARK = `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--brand)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="m12 3 1.9 4.6L19 9.5l-4.1 2.4L12 17l-2.9-5.1L5 9.5l5.1-1.9z"/></svg>`;

function renderCoachComposer(active, phase) {
  if (phase.devotional) {
    const text =
      phase.id === "heart"
        ? "The work is done. Walk into Sunday emptied of yourself and full of Christ."
        : "This phase is between you and the Lord. Keep it in your writing canvas above.";
    return `
      <div class="pf-coach-wrap">
        <div class="pf-devotional">
          ${COACH_SPARK}
          <span>${escapeHtml(text)}</span>
        </div>
      </div>
    `;
  }

  const chips =
    !ui.showCoach && phase.actions?.length
      ? `<div class="pf-coach-chips">${phase.actions
          .map(
            (action, index) =>
              `<button class="pf-coach-chip" data-action="phase-action" data-action-index="${index}">${escapeHtml(action.label)}</button>`,
          )
          .join("")}</div>`
      : "";

  return `
    <div class="pf-coach-wrap">
      <div class="pf-coach-inner">
        ${ui.showCoach ? renderCoachPanel(active) : chips}
        <div class="pf-coach">
          ${COACH_SPARK}
          <input class="pf-coach-input" data-action="coach-input" value="${attr(ui.composer)}" placeholder="Ask the coach to react to your ${attr(phase.name.toLowerCase())}…" />
          <button class="pf-coach-toggle" data-action="${ui.showCoach ? "close-coach" : "open-coach"}" title="${ui.showCoach ? "Hide thread" : "Show thread"}" aria-label="Toggle coach thread">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="${ui.showCoach ? "m6 9 6 6 6-6" : "m18 15-6-6-6 6"}"/></svg>
          </button>
          <button class="pf-coach-send" data-action="send" ${ui.loading || !ui.composer.trim() ? "disabled" : ""}>${ui.loading ? "…" : "Send"} <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#20242A" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></svg></button>
        </div>
      </div>
    </div>
  `;
}

function renderCoachPanel(active) {
  return `
    <div class="pf-coach-panel">
      <div class="pf-coach-panel-head">
        <span class="pf-eyebrow">Coach</span>
        <button class="pf-btn pf-btn-ghost" style="margin-left:auto;padding:6px 12px;" data-action="close-coach">Close</button>
      </div>
      <div class="pf-coach-thread pf-scroll" data-thread>
        ${
          active.thread.length
            ? active.thread.map(renderMessage).join("")
            : `<div class="pf-msg-divider">Bring your work, or ask a question.</div>`
        }
        ${ui.loading ? `<div class="pf-msg coach"><div class="pf-msg-who">Coach</div><div class="pf-bubble">${loadingDots()}</div></div>` : ""}
      </div>
    </div>
  `;
}

function renderMessage(message) {
  if (message.role === "meta") {
    return `<div class="pf-msg-divider">${escapeHtml(message.content)}</div>`;
  }
  const kind = message.role === "user" ? "user" : "coach";
  return `
    <div class="pf-msg ${kind}">
      ${message.role === "assistant" ? `<div class="pf-msg-who">Coach</div>` : ""}
      <div class="pf-bubble">${escapeHtml(message.content)}</div>
    </div>
  `;
}

function renderSwitcherModal(active) {
  return `
    <div class="pf-overlay" data-action="close-switcher" data-overlay>
      <div class="pf-modal" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Sermons</span>
          <h2 class="pf-modal-title">Switch sermon</h2>
        </div>
        <div class="pf-switcher-list">
          ${
            state.sermons.length
              ? state.sermons
                  .map(
                    (sermon) => `
                      <button class="pf-switcher-item ${sermon.id === active?.id ? "active" : ""}" data-action="select-sermon" data-sermon="${attr(sermon.id)}">
                        <div style="flex:1;min-width:0;">
                          <div class="label">${escapeHtml(sermon.passage || "Untitled sermon")}</div>
                          <div class="meta">${escapeHtml(sermon.title || "Untitled")} · ${escapeHtml(sermon.series || "No series")}</div>
                        </div>
                        <span class="pf-badge ${cardStatus(sermon).key}">${escapeHtml(cardStatus(sermon).label)}</span>
                      </button>
                    `,
                  )
                  .join("")
              : `<p class="pf-modal-text">No sermons yet.</p>`
          }
        </div>
        <div class="pf-modal-actions">
          <button class="pf-btn pf-btn-primary" data-action="new-sermon">New sermon</button>
          ${active ? `<button class="pf-btn" data-action="open-details">Edit details</button>` : ""}
          <button class="pf-btn pf-btn-ghost" data-action="close-switcher">Close</button>
        </div>
      </div>
    </div>
  `;
}

function renderDetailsModal(active) {
  return `
    <div class="pf-overlay" data-action="close-details" data-overlay>
      <div class="pf-modal wide" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Details</span>
          <h2 class="pf-modal-title">Sermon file</h2>
        </div>
        <form data-form="sermon-details">
          <div class="pf-form-grid">
            <div class="pf-field full">
              <label class="pf-label" for="detail-passage">Passage</label>
              <input id="detail-passage" class="pf-input" name="passage" value="${attr(active.passage)}" required />
            </div>
            <div class="pf-field full">
              <label class="pf-label" for="detail-title">Title</label>
              <input id="detail-title" class="pf-input" name="title" value="${attr(active.title)}" />
            </div>
            <div class="pf-field full">
              <label class="pf-label" for="detail-series">Series</label>
              <input id="detail-series" class="pf-input" name="series" value="${attr(active.series)}" />
            </div>
            <div class="pf-field">
              <label class="pf-label" for="detail-date">Date</label>
              <input id="detail-date" class="pf-input" type="date" name="date" value="${attr(active.date)}" />
            </div>
            <div class="pf-field">
              <label class="pf-label" for="detail-length">Length (min)</label>
              <input id="detail-length" class="pf-input" name="length" inputmode="numeric" value="${attr(active.length)}" />
            </div>
            <div class="pf-field full">
              <label class="pf-label" for="detail-format">Deliverable</label>
              <select id="detail-format" class="pf-select" name="format">
                <option ${active.format === "Full manuscript" ? "selected" : ""}>Full manuscript</option>
                <option ${active.format === "Preaching notes" ? "selected" : ""}>Preaching notes</option>
              </select>
            </div>
          </div>
          <div class="pf-modal-actions">
            <button class="pf-btn pf-btn-primary" type="submit">Save</button>
            <button class="pf-btn pf-btn-danger" type="button" data-action="delete-sermon">Remove sermon</button>
            <button class="pf-btn pf-btn-ghost" type="button" data-action="close-details">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderGoogleDocsModal(active) {
  const doc = active.googleDoc;
  const configured = ui.google.configured;
  const connected = ui.google.connected;
  const autoSync = state.google?.autoSync !== false;
  const status = doc?.id
    ? ui.google.status || (doc.syncedAt ? `Last synced ${formatTime(doc.syncedAt)}` : "Ready to sync")
    : configured
      ? connected
        ? "Connect a Google Doc to this sermon"
        : "Connect Google to create a Doc"
      : "Add GOOGLE_CLIENT_ID in Vercel";

  return `
    <div class="pf-overlay" data-action="close-google-docs" data-overlay>
      <div class="pf-modal" data-stop>
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Google Docs</span>
          <h2 class="pf-modal-title">${doc?.id ? "Document sync" : "Live sermon doc"}</h2>
        </div>
        <p class="pf-modal-text" data-google-status>${escapeHtml(status)}</p>
        <label class="pf-toggle-row">
          <input type="checkbox" data-action="google-autosync" ${autoSync ? "checked" : ""} ${doc?.id ? "" : "disabled"} />
          <span>Auto-sync after edits</span>
        </label>
        <div class="pf-modal-actions">
          ${doc?.url ? `<a class="pf-btn" href="${attr(doc.url)}" target="_blank" rel="noopener">Open Doc</a>` : ""}
          ${configured && !connected ? `<button class="pf-btn" data-action="google-connect" ${ui.google.loading ? "disabled" : ""}>Connect Google</button>` : ""}
          ${configured && connected && !doc?.id ? `<button class="pf-btn pf-btn-primary" data-action="google-create-doc" ${ui.google.loading ? "disabled" : ""}>Create Doc</button>` : ""}
          ${doc?.id ? `<button class="pf-btn pf-btn-primary" data-action="google-sync-now" ${ui.google.loading ? "disabled" : ""}>Sync now</button>` : ""}
          <button class="pf-btn pf-btn-ghost" data-action="close-google-docs">Close</button>
        </div>
        ${configured ? "" : `<p class="pf-helper">Set <code>GOOGLE_CLIENT_ID</code> in Vercel to enable Google Docs sync.</p>`}
      </div>
    </div>
  `;
}

function phaseNoteKind(phase) {
  if (phase.devotional) return "prayer";
  if (phase.id === "immersion") return "question";
  return "note";
}

function kindLabel(kind) {
  return { coach: "Coach", question: "Question", prayer: "Prayer", note: "Note" }[kind] || "Note";
}

function collectActiveNoteGroups(active) {
  if (!active) return [];
  const groups = [];
  for (const phase of PHASES) {
    const entries = [];
    if (phaseNoteText(active, phase).trim()) {
      entries.push({ kind: phaseNoteKind(phase), html: phaseNoteHtml(active, phase), phaseId: phase.id, editable: true });
    }
    active.thread
      .filter((message) => message.role === "assistant" && message.phaseId === phase.id)
      .forEach((message) => entries.push({ kind: "coach", text: message.content }));
    if (entries.length) {
      entries.reverse();
      groups.push({ phase: phase.name, when: BLOCKS[phase.block].when, entries });
    }
  }
  const orphanCoach = active.thread.filter((message) => message.role === "assistant" && !message.phaseId);
  if (orphanCoach.length) {
    groups.push({
      phase: "Coach feedback",
      when: "",
      entries: orphanCoach.map((message) => ({ kind: "coach", text: message.content })).reverse(),
    });
  }
  return groups;
}

function renderJournal(active) {
  const groups = collectActiveNoteGroups(active);
  return `
    <div class="pf-page pf-page-read pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:28px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Notes</span>
        <h1 class="pf-h1">Everything you've captured</h1>
        <p class="pf-page-sub">Notes, questions, prayers, and coach feedback — gathered by phase${
          active ? ` for <strong>${escapeHtml(active.passage || "this sermon")}</strong>` : ""
        }.</p>
      </div>
      ${
        groups.length
          ? `<div class="pf-notes-list">${groups.map(renderNoteGroup).join("")}</div>`
          : `<div class="pf-empty">No notes yet. Start writing in a phase and it will be filed here automatically.</div>`
      }
    </div>
  `;
}

function renderNoteGroup(group) {
  return `
    <section class="pf-note-group">
      <div class="pf-note-group-head">
        <span class="pf-note-phase">${escapeHtml(group.phase)}</span>
        ${group.when ? `<span class="pf-note-when">${escapeHtml(group.when)}</span>` : ""}
      </div>
      <div>
        ${group.entries
          .map((entry) =>
            entry.editable
              ? `
              <div class="pf-note-entry">
                <span class="pf-kind ${entry.kind}">${kindLabel(entry.kind)}</span>
                <div
                  class="pf-note-body pf-note-editable"
                  contenteditable="true"
                  spellcheck="true"
                  data-action="notes-editor"
                  data-phase="${attr(entry.phaseId)}"
                  data-placeholder="Write a note for this phase…"
                  title="Click to edit — saves automatically"
                >${sanitizeRichHtml(entry.html)}</div>
              </div>
            `
              : `
              <div class="pf-note-entry">
                <span class="pf-kind ${entry.kind}">${kindLabel(entry.kind)}</span>
                <div class="pf-note-body">${escapeHtml(entry.text || "")}</div>
              </div>
            `,
          )
          .join("")}
      </div>
    </section>
  `;
}

function journalSermonLabel(sermon) {
  return `${sermon.passage || "Untitled sermon"}${sermon.title ? ` - ${sermon.title}` : ""}`;
}

function journalCourseLabel(sermonId) {
  const sermon = state.sermons.find((item) => item.id === sermonId);
  return sermon ? journalSermonLabel(sermon) : "General journal";
}

function journalSectionLabel(phaseId) {
  return PHASES.find((phase) => phase.id === phaseId)?.name || "General";
}

function groupJournalEntries() {
  const sorted = [...state.journalEntries].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const courseMap = new Map();
  for (const entry of sorted) {
    const courseKey = entry.sermonId || "general";
    if (!courseMap.has(courseKey)) {
      courseMap.set(courseKey, {
        key: courseKey,
        label: journalCourseLabel(entry.sermonId),
        entries: [],
        sectionMap: new Map(),
      });
    }
    const course = courseMap.get(courseKey);
    course.entries.push(entry);
    const sectionKey = entry.phaseId || "general";
    if (!course.sectionMap.has(sectionKey)) {
      course.sectionMap.set(sectionKey, {
        key: sectionKey,
        label: journalSectionLabel(entry.phaseId),
        entries: [],
      });
    }
    course.sectionMap.get(sectionKey).entries.push(entry);
  }

  return [...courseMap.values()].map((course) => ({
    ...course,
    sections: [...course.sectionMap.values()],
  }));
}

function resetJournalDraft() {
  ui.journalEditingId = "";
  ui.journalDraft = {
    sermonId: "",
    phaseId: "",
    title: "",
    body: "",
  };
}

function saveJournalEntry(overrides = {}) {
  const now = new Date().toISOString();
  const selectedSermon = document.querySelector('[data-action="journal-draft-sermon"]')?.value || "";
  const selectedPhase = document.querySelector('[data-action="journal-draft-phase"]')?.value || "";
  const draft = {
    ...ui.journalDraft,
    sermonId: ui.journalDraft.sermonId || selectedSermon,
    phaseId: ui.journalDraft.phaseId || selectedPhase,
    ...overrides,
  };
  const body = (draft.body || "").trim();
  if (!body) {
    showBanner("Write a journal note first.");
    return;
  }
  const title = (draft.title || firstLine(body) || "Untitled note").trim();

  if (ui.journalEditingId) {
    state.journalEntries = state.journalEntries.map((entry) =>
      entry.id === ui.journalEditingId
        ? normalizeJournalEntry({
            ...entry,
            sermonId: draft.sermonId || "",
            phaseId: draft.phaseId || "general",
            title,
            body,
            updatedAt: now,
          })
        : entry,
    );
    showBanner("Journal note updated.");
  } else {
    state.journalEntries.unshift(
      normalizeJournalEntry({
        id: genId(),
        sermonId: draft.sermonId || "",
        phaseId: draft.phaseId || "general",
        title,
        body,
        createdAt: now,
        updatedAt: now,
      }),
    );
    showBanner("Journal note saved.");
  }

  resetJournalDraft();
  saveState();
  render();
}

function firstLine(value) {
  return String(value || "")
    .split("\n")
    .map((line) => line.replace(/^#+\s*/, "").replace(/^\-\s*/, "").trim())
    .find(Boolean);
}

function editJournalEntry(entryId) {
  const entry = state.journalEntries.find((item) => item.id === entryId);
  if (!entry) return;
  ui.journalEditingId = entry.id;
  ui.journalDraft = {
    sermonId: entry.sermonId || "",
    phaseId: entry.phaseId || "general",
    title: entry.title || "",
    body: entry.body || "",
  };
  state.view = "journal";
  render();
}

function deleteJournalEntry(entryId) {
  const entry = state.journalEntries.find((item) => item.id === entryId);
  if (!entry) return;
  const ok = confirm(`Delete "${entry.title || "this journal note"}"?`);
  if (!ok) return;
  state.journalEntries = state.journalEntries.filter((item) => item.id !== entryId);
  if (ui.journalEditingId === entryId) resetJournalDraft();
  saveState();
  showBanner("Journal note deleted.");
  render();
}

function renderJournalGroup(group) {
  return `
    <section class="panel panel-pad journal-group">
      <div class="section-head">
        <div>
          <span class="eyebrow">Course</span>
          <h2 class="mini-title">${escapeHtml(group.label)}</h2>
        </div>
        <span class="badge neutral">${group.entries.length}</span>
      </div>
      ${group.sections
        .map(
          (section) => `
            <div class="journal-section">
              <div class="block-label">${escapeHtml(section.label)}<span>${section.entries.length} notes</span></div>
              <div class="journal-entry-list">
                ${section.entries.map(renderJournalEntryCard).join("")}
              </div>
            </div>
          `,
        )
        .join("")}
    </section>
  `;
}

function renderJournalEntryCard(entry) {
  return `
    <article class="journal-entry-card">
      <div>
        <h3>${escapeHtml(entry.title || "Untitled note")}</h3>
        <p>${escapeHtml(entry.body.slice(0, 220))}${entry.body.length > 220 ? "..." : ""}</p>
        <div class="meta-line">Updated ${formatTime(entry.updatedAt)}</div>
      </div>
      <div class="entry-actions">
        <button class="btn" data-action="edit-journal-entry" data-entry="${attr(entry.id)}">Edit</button>
        <button class="btn btn-danger" data-action="delete-journal-entry" data-entry="${attr(entry.id)}">Delete</button>
      </div>
    </article>
  `;
}

function renderEmptyJournal() {
  return `
    <section class="panel panel-pad stack journal-empty">
      <span class="eyebrow">No notes yet</span>
      <h2 class="title">Start in a focus box.</h2>
      <p class="subtle">Workspace notes will appear here grouped by sermon, workflow section, and focus point.</p>
    </section>
  `;
}

const REVIEW_CHECKS = [
  ["gospel", "The gospel is clearly present"],
  ["hero", "Christ is the hero — not the hearer"],
  ["illustration", "At least one concrete illustration"],
  ["application", "Application is specific (something for Monday)"],
  ["invitation", "A clear invitation to respond"],
  ["walkaway", "One memorable walk-away line"],
];

function renderReview() {
  const okCount = REVIEW_CHECKS.filter(([key]) => state.reviewChecks[key]).length;
  const pct = Math.round((okCount / REVIEW_CHECKS.length) * 100);
  return `
    <div class="pf-page pf-page-narrow pf-fade">
      <div class="pf-page-head" style="display:block;margin-bottom:26px;">
        <span class="pf-eyebrow pf-eyebrow-brand" style="display:block;margin-bottom:8px;">Readiness check</span>
        <h1 class="pf-h1">Is it ready to preach?</h1>
        <p class="pf-page-sub">The non-negotiables before Sunday. Nothing here writes the sermon for you — it just makes sure nothing's missing.</p>
      </div>

      <section class="pf-score-card">
        <div class="pf-score-head">
          <span class="pf-score-label">${okCount} of ${REVIEW_CHECKS.length} ready</span>
          <div class="pf-score-track"><div class="pf-score-fill" style="width:${pct}%;"></div></div>
        </div>
        <div>
          ${REVIEW_CHECKS.map(([key, label]) => {
            const ok = Boolean(state.reviewChecks[key]);
            return `
              <button class="pf-review-item" style="width:100%;background:none;border-top:1px solid var(--border-subtle);cursor:pointer;text-align:left;" data-action="review-check" data-key="${key}">
                <span class="pf-review-box ${ok ? "ok" : ""}">${ok ? SVG_CHECK(14, 3.4) : ""}</span>
                <span class="pf-review-label ${ok ? "ok" : ""}">${escapeHtml(label)}</span>
              </button>
            `;
          }).join("")}
        </div>
        <form data-form="review-sermon">
          <button class="pf-review-btn" type="submit" ${ui.reviewLoading || !state.reviewText.trim() ? "disabled" : ""}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3 1.9 4.6L19 9.5l-4.1 2.4L12 17l-2.9-5.1L5 9.5l5.1-1.9z"/></svg>
            ${ui.reviewLoading ? "Running review…" : "Run the full coach review"}
          </button>
        </form>
      </section>

      <section class="pf-score-card" style="margin-top:18px;">
        <div class="pf-modal-head">
          <span class="pf-eyebrow">Manuscript</span>
          <h2 class="pf-modal-title" style="font-size:18px;">Bring a finished sermon</h2>
        </div>
        <div class="pf-form-grid">
          <div class="pf-field">
            <label class="pf-label" for="review-passage">Passage</label>
            <input id="review-passage" class="pf-input" data-action="review-meta" data-field="passage" value="${attr(state.reviewMeta.passage)}" placeholder="Ephesians 3:1-13" />
          </div>
          <div class="pf-field">
            <label class="pf-label" for="review-title">Title</label>
            <input id="review-title" class="pf-input" data-action="review-meta" data-field="title" value="${attr(state.reviewMeta.title)}" />
          </div>
        </div>
        <div class="pf-review-upload">
          <div class="pf-field" style="margin:0;">
            <label class="pf-label" for="review-file">Upload (.txt, .md, .docx)</label>
            <input id="review-file" class="pf-input" type="file" data-action="review-file" accept=".txt,.md,.markdown,.docx" />
          </div>
          <textarea class="pf-textarea" data-action="review-text" placeholder="Paste the manuscript here.">${escapeHtml(state.reviewText)}</textarea>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button class="pf-btn pf-btn-ghost" type="button" data-action="clear-review">Clear</button>
          </div>
        </div>
        ${
          ui.reviewLoading
            ? `<div class="pf-review-result">${loadingDots()}</div>`
            : ui.reviewResult
              ? `<div class="pf-review-result">${escapeHtml(ui.reviewResult)}</div>`
              : ""
        }
      </section>
    </div>
  `;
}

function addSermon(form) {
  const data = Object.fromEntries(new FormData(form));
  const sermon = normalizeSermon({
    id: genId(),
    passage: data.passage.trim(),
    title: data.title.trim(),
    date: data.date,
    series: data.series.trim(),
    length: data.length.trim() || "40",
    format: data.format || "Full manuscript",
    activePhase: "plan",
  });
  state.sermons.push(sermon);
  state.activeId = sermon.id;
  state.view = "workspace";
  ui.showNew = false;
  saveState();
  render();
}

function saveDetails(form) {
  const data = Object.fromEntries(new FormData(form));
  updateActive({
    passage: data.passage.trim(),
    title: data.title.trim(),
    date: data.date,
    series: data.series.trim(),
    length: data.length.trim() || "40",
    format: data.format,
  });
  ui.showDetails = false;
  showBanner("Sermon details saved.");
  render();
}

function showBanner(message) {
  ui.banner = message;
  clearTimeout(bannerTimer);
  bannerTimer = setTimeout(() => {
    ui.banner = "";
    render();
  }, 4200);
}

function toggleComplete(phaseId) {
  const active = getActive();
  if (!active) return;
  const done = active.completed.includes(phaseId);
  const completed = done
    ? active.completed.filter((id) => id !== phaseId)
    : [...active.completed, phaseId];
  const phase = PHASES.find((item) => item.id === phaseId);
  const patch = { completed };
  if (!done && phase) {
    const index = PHASES.findIndex((item) => item.id === phaseId);
    patch.activePhase = PHASES[Math.min(index + 1, PHASES.length - 1)].id;
    showBanner(phase.enc);
  }
  updateActive(patch);
  render();
}

function activeContext(active) {
  const phase = getPhase(active);
  const status = sermonStatus(active);
  return [
    `CURRENT SERMON: ${active.passage}${active.title ? ` - "${active.title}"` : ""}`,
    `Preaching date: ${active.date ? fmtDate(active.date) : "(no date)"}`,
    `Series: ${active.series || "-"}`,
    `Target length: ${active.length || "-"} minutes`,
    `Deliverable: ${active.format}`,
    `Working phase: ${phase.name}`,
    status.days === null
      ? ""
      : `${status.days} days out; ${active.completed.length}/${PHASES.length} phases complete; verdict ${status.label}.`,
  ]
    .filter(Boolean)
    .join("\n");
}

async function send(textArg, metaLabel) {
  const active = getActive();
  const text = (textArg ?? ui.composer).trim();
  if (!text || ui.loading || !active) return;
  if (!requireOpenAIKey()) return;

  const phaseId = active.activePhase;
  const base = [...active.thread];
  if (metaLabel) base.push({ role: "meta", content: metaLabel, phaseId });
  const next = [...base, { role: "user", content: text, phaseId }];
  updateActive({ thread: next });
  ui.composer = "";
  ui.showCoach = true;
  ui.loading = true;
  render();

  try {
    const response = await fetch("./api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...openAIHeaders() },
      body: JSON.stringify({
        context: activeContext(getActive()),
        messages: next
          .filter((message) => message.role === "user" || message.role === "assistant")
          .map((message) => ({ role: message.role, content: message.content })),
      }),
    });
    const data = await response.json();
    updateActive({
      thread: [
        ...next,
        {
          role: "assistant",
          content: data.text || "No response came back. Try again.",
          phaseId,
        },
      ],
    });
  } catch {
    updateActive({
      thread: [
        ...next,
        {
          role: "assistant",
          content:
            "I could not reach the coach server. Check the deployment, then make sure your OpenAI API key is saved in this browser.",
          phaseId,
        },
      ],
    });
  } finally {
    ui.loading = false;
    render();
  }
}

function tapPhaseAction(index) {
  const active = getActive();
  const phase = getPhase(active);
  const action = phase.actions?.[index];
  if (!action) return;
  if (action.direct) {
    send(action.seed, phase.name);
    return;
  }
  ui.composer = action.seed;
  render();
  requestAnimationFrame(() => {
    const composer = document.querySelector("[data-action='coach-input']");
    if (composer) {
      composer.focus();
      composer.setSelectionRange(composer.value.length, composer.value.length);
    }
  });
}

async function reviewSermon() {
  const text = state.reviewText.trim();
  if (!text || ui.reviewLoading) return;
  if (!requireOpenAIKey()) {
    ui.reviewResult = "Add your own OpenAI API key to run the sermon review.";
    render();
    return;
  }
  ui.reviewLoading = true;
  ui.reviewResult = "";
  render();
  try {
    const response = await fetch("./api/review", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...openAIHeaders() },
      body: JSON.stringify({
        sermon: text,
        meta: state.reviewMeta,
      }),
    });
    const data = await response.json();
    ui.reviewResult = data.text || "No review came back. Try again.";
  } catch {
    ui.reviewResult =
      "I could not reach the review server. Check the deployment, then make sure your OpenAI API key is saved in this browser.";
  } finally {
    ui.reviewLoading = false;
    render();
  }
}

async function handleReviewFile(input) {
  const file = input.files?.[0];
  if (!file) return;
  if (file.name.toLowerCase().endsWith(".docx")) {
    try {
      const buffer = await file.arrayBuffer();
      const response = await fetch("./api/extract-docx", {
        method: "POST",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: buffer,
      });
      const data = await response.json();
      state.reviewText = data.text || "";
      if (!data.text) ui.reviewResult = data.error || "The document did not contain extractable text.";
      saveState();
      render();
    } catch {
      ui.reviewResult = "I could not extract that .docx. Paste the manuscript text instead.";
      render();
    }
    return;
  }
  state.reviewText = await file.text();
  saveState();
  render();
}

function exportMarkdown(sermon) {
  const status = sermonStatus(sermon);
  const lines = [
    `# ${sermon.passage || "Untitled sermon"}${sermon.title ? ` - ${sermon.title}` : ""}`,
    "",
    `Series: ${sermon.series || "-"}`,
    `Date: ${sermon.date ? fmtDate(sermon.date) : "-"}`,
    `Length: ${sermon.length || "-"} minutes`,
    `Deliverable: ${sermon.format}`,
    `Status: ${status.label}`,
    `Progress: ${sermon.completed.length}/${PHASES.length}`,
    "",
    "## Workflow",
    "",
  ];

  for (const block of BLOCKS) {
    lines.push(`### ${block.label}`);
	    for (const phase of PHASES.filter((item) => item.block === BLOCKS.indexOf(block))) {
	      const done = sermon.completed.includes(phase.id) ? "done" : "open";
	      lines.push(`- [${done === "done" ? "x" : " "}] ${phase.name}`);
	      const note = getPhaseFocusNotesText(sermon, phase).trim();
	      if (note) {
	        lines.push("");
	        lines.push(note);
	        lines.push("");
	      }
    }
    lines.push("");
  }

  if (sermon.thread.length) {
    lines.push("## Coach Thread", "");
    for (const message of sermon.thread) {
      if (message.role === "meta") lines.push(`### ${message.content}`, "");
      if (message.role === "user") lines.push("**You**", "", message.content, "");
      if (message.role === "assistant") lines.push("**Coach**", "", message.content, "");
    }
  }

  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    showBanner("Copied.");
  } catch {
    showBanner("Copy failed. Export instead.");
  }
}

function getUserOpenAIKey() {
  return localStorage.getItem(OPENAI_KEY_STORE) || "";
}

function openAIHeaders() {
  const key = getUserOpenAIKey();
  return key ? { "x-openai-api-key": key } : {};
}

function refreshOpenAIKeyState() {
  ui.openai.hasKey = Boolean(getUserOpenAIKey());
}

function saveOpenAIKey() {
  const key = ui.openAIKeyInput.trim();
  if (!key) {
    showBanner("Paste an OpenAI API key first.");
    return;
  }
  localStorage.setItem(OPENAI_KEY_STORE, key);
  ui.openAIKeyInput = "";
  refreshOpenAIKeyState();
  ui.showOpenAIKey = false;
  showBanner("OpenAI key saved in this browser.");
  render();
}

function clearOpenAIKey() {
  localStorage.removeItem(OPENAI_KEY_STORE);
  ui.openAIKeyInput = "";
  refreshOpenAIKeyState();
  showBanner("OpenAI key removed from this browser.");
  render();
}

function requireOpenAIKey() {
  refreshOpenAIKeyState();
  if (ui.openai.hasKey) return true;
  ui.showOpenAIKey = true;
  showBanner("Add your own OpenAI API key to power the coach.");
  render();
  return false;
}

async function loadGoogleConfig() {
  try {
    const response = await fetch("./api/config");
    const data = await response.json();
    ui.google.clientId = data.googleClientId || "";
    ui.google.configured = Boolean(ui.google.clientId);
    ui.google.status = ui.google.configured
      ? "Google Docs ready to connect"
      : "Add GOOGLE_CLIENT_ID in Vercel";
    ui.google.statusKey = ui.google.configured ? "neutral" : "missing";
    await initSupabase(data);
  } catch {
    ui.google.configured = false;
    ui.google.status = "Google Docs config unavailable";
    ui.google.statusKey = "missing";
    ui.auth.configured = false;
    ui.auth.status = "Login config unavailable";
    ui.auth.statusKey = "missing";
  }
  render();
}

function loadSupabaseScript() {
  if (window.supabase?.createClient) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector("script[data-supabase]");
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = SUPABASE_SCRIPT;
    script.async = true;
    script.defer = true;
    script.dataset.supabase = "true";
    script.addEventListener("load", () => resolve(true), { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.append(script);
  });
}

async function initSupabase(config) {
  ui.auth.configured = Boolean(config.supabaseUrl && config.supabaseAnonKey);
  if (!ui.auth.configured) {
    ui.auth.status = "Saved on this device";
    ui.auth.statusKey = "missing";
    return;
  }

  const loaded = await loadSupabaseScript();
  if (!loaded || !window.supabase?.createClient) {
    ui.auth.configured = false;
    ui.auth.status = "Could not load login service";
    ui.auth.statusKey = "missing";
    return;
  }

  ui.auth.client = window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  const { data } = await ui.auth.client.auth.getSession();
  ui.auth.user = data.session?.user || null;
  ui.auth.status = ui.auth.user ? "Loading cloud progress..." : "Sign in to sync across devices";
  ui.auth.statusKey = ui.auth.user ? "syncing" : "neutral";

  ui.auth.client.auth.onAuthStateChange((_event, session) => {
    ui.auth.user = session?.user || null;
    ui.auth.status = ui.auth.user ? "Loading cloud progress..." : "Signed out. Saving on this device.";
    ui.auth.statusKey = ui.auth.user ? "syncing" : "neutral";
    render();
    if (ui.auth.user) loadCloudState();
  });

  if (ui.auth.user) await loadCloudState();
}

async function sendMagicLink() {
  const email = ui.auth.emailInput.trim();
  if (!email || !ui.auth.client) {
    showBanner("Enter your email first.");
    return;
  }

  ui.auth.loading = true;
  ui.auth.status = "Sending magic link...";
  render();

  const { error } = await ui.auth.client.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + window.location.pathname,
    },
  });

  ui.auth.loading = false;
  if (error) {
    ui.auth.status = error.message || "Could not send magic link.";
    ui.auth.statusKey = "missing";
    showBanner("Could not send magic link.");
  } else {
    ui.auth.status = "Check your email for the sign-in link.";
    ui.auth.statusKey = "ready";
    showBanner("Magic link sent.");
  }
  render();
}

function requireAuthConfigured() {
  if (ui.auth.configured && ui.auth.client) return true;
  ui.auth.status = "Accounts need Supabase setup in Vercel. Your work is still saved on this device.";
  ui.auth.statusKey = "missing";
  showBanner("Sign-in needs Supabase setup (SUPABASE_URL, SUPABASE_ANON_KEY).");
  render();
  return false;
}

function afterSignedIn() {
  ui.auth.passwordInput = "";
  state.view = ui.lastView && ui.lastView !== "signin" ? ui.lastView : "workspace";
}

async function signInWithPassword() {
  if (!requireAuthConfigured()) return;
  const email = ui.auth.emailInput.trim();
  const password = ui.auth.passwordInput;
  if (!email || !password) {
    showBanner("Enter your email and password.");
    return;
  }
  ui.auth.loading = true;
  ui.auth.status = "Signing in...";
  ui.auth.statusKey = "syncing";
  render();

  const { error } = await ui.auth.client.auth.signInWithPassword({ email, password });
  ui.auth.loading = false;
  if (error) {
    ui.auth.status = error.message || "Could not sign in.";
    ui.auth.statusKey = "missing";
    showBanner("Sign-in failed.");
  } else {
    afterSignedIn();
    showBanner("Signed in.");
  }
  render();
}

async function signUpWithPassword() {
  if (!requireAuthConfigured()) return;
  const email = ui.auth.emailInput.trim();
  const password = ui.auth.passwordInput;
  if (!email || !password) {
    showBanner("Enter your email and a password.");
    return;
  }
  if (password.length < 6) {
    showBanner("Use a password of at least 6 characters.");
    return;
  }
  ui.auth.loading = true;
  ui.auth.status = "Creating your account...";
  ui.auth.statusKey = "syncing";
  render();

  const { data, error } = await ui.auth.client.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: window.location.origin + window.location.pathname },
  });
  ui.auth.loading = false;
  if (error) {
    ui.auth.status = error.message || "Could not create account.";
    ui.auth.statusKey = "missing";
    showBanner("Sign-up failed.");
  } else if (data.session) {
    afterSignedIn();
    showBanner("Account created.");
  } else {
    ui.signinMode = "signin";
    ui.auth.status = "Account created — check your email to confirm, then sign in.";
    ui.auth.statusKey = "ready";
    showBanner("Check your email to confirm your account.");
  }
  render();
}

async function signInWithGoogle() {
  if (!requireAuthConfigured()) return;
  ui.auth.loading = true;
  ui.auth.status = "Redirecting to Google...";
  ui.auth.statusKey = "syncing";
  render();
  const { error } = await ui.auth.client.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + window.location.pathname },
  });
  if (error) {
    ui.auth.loading = false;
    ui.auth.status = error.message || "Could not start Google sign-in.";
    ui.auth.statusKey = "missing";
    showBanner("Google sign-in failed.");
    render();
  }
}

async function signOut() {
  if (!ui.auth.client) return;
  ui.auth.loading = true;
  render();
  await ui.auth.client.auth.signOut();
  ui.auth.user = null;
  ui.auth.loading = false;
  ui.auth.status = "Signed out. Saving on this device.";
  ui.auth.statusKey = "neutral";
  showBanner("Signed out.");
  render();
}

async function loadCloudState() {
  if (!ui.auth.client || !ui.auth.user) return;

  ui.auth.loading = true;
  ui.auth.status = "Loading cloud progress...";
  ui.auth.statusKey = "syncing";
  render();

  const { data, error } = await ui.auth.client
    .from("preach_flow_user_state")
    .select("app_state, updated_at")
    .eq("user_id", ui.auth.user.id)
    .maybeSingle();

  if (error) {
    ui.auth.loading = false;
    ui.auth.status = error.message || "Could not load cloud progress.";
    ui.auth.statusKey = "missing";
    render();
    return;
  }

  if (data?.app_state && hasCloudContent(data.app_state)) {
    cloudSyncPaused = true;
    applyStateSnapshot(data.app_state);
    saveState();
    cloudSyncPaused = false;
    ui.auth.status = `Cloud progress loaded${data.updated_at ? ` ${formatTime(data.updated_at)}` : ""}.`;
    ui.auth.statusKey = "ready";
  } else {
    await saveCloudState({ announce: false });
    ui.auth.status = "Local progress copied to cloud.";
    ui.auth.statusKey = "ready";
  }

  ui.auth.loading = false;
  render();
}

function hasCloudContent(snapshot) {
  return Boolean(
    snapshot?.sermons?.length ||
      snapshot?.journalEntries?.length ||
      snapshot?.reviewText ||
      snapshot?.reviewMeta?.passage ||
      snapshot?.reviewMeta?.title,
  );
}

function scheduleCloudSync() {
  clearTimeout(cloudSyncTimer);
  if (!ui.auth.client || !ui.auth.user) return;

  cloudSyncTimer = setTimeout(() => {
    saveCloudState({ background: true });
  }, 1400);
}

async function saveCloudState(options = {}) {
  if (!ui.auth.client || !ui.auth.user) return;

  setAuthStatus("Saving to cloud...", "syncing");
  if (!options.background) render();

  const updatedAt = new Date().toISOString();
  const { error } = await ui.auth.client.from("preach_flow_user_state").upsert(
    {
      user_id: ui.auth.user.id,
      app_state: stateSnapshot(),
      updated_at: updatedAt,
    },
    { onConflict: "user_id" },
  );

  if (error) {
    setAuthStatus(error.message || "Cloud save failed.", "missing");
    if (!options.background) showBanner("Cloud save failed.");
  } else {
    setAuthStatus(`Saved to cloud ${formatTime(updatedAt)}.`, "ready");
    if (options.announce) showBanner("Saved to cloud.");
  }
  if (!options.background || options.announce) render();
}

function setAuthStatus(message, key = "neutral") {
  ui.auth.status = message;
  ui.auth.statusKey = key;
  const button = document.querySelector("[data-auth-status]");
  if (!button) return;
  const label = ui.auth.user
    ? `Signed in: ${ui.auth.user.email || "Account"}`
    : ui.auth.configured
      ? "Sign in"
      : "Local save only";
  const dotKey = ui.auth.user ? "ready" : ui.auth.configured ? "neutral" : "missing";
  button.title = label;
  button.innerHTML = `<i class="status-dot ${dotKey}"></i>${escapeHtml(label)}`;
  const panelStatus = document.querySelector("[data-auth-panel-status]");
  if (panelStatus) panelStatus.textContent = message;
}

function loadGoogleScript() {
  if (window.google?.accounts?.oauth2) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector("script[data-google-identity]");
    if (existing) {
      existing.addEventListener("load", () => resolve(true), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleIdentity = "true";
    script.addEventListener("load", () => resolve(true), { once: true });
    script.addEventListener("error", () => resolve(false), { once: true });
    document.head.append(script);
  });
}

async function ensureGoogleToken() {
  if (ui.google.accessToken) return true;
  if (!ui.google.clientId) {
    setGoogleStatus("Add GOOGLE_CLIENT_ID in Vercel", "missing");
    showBanner("Google Docs needs GOOGLE_CLIENT_ID in Vercel first.");
    return false;
  }

  const loaded = await loadGoogleScript();
  if (!loaded || !window.google?.accounts?.oauth2) {
    setGoogleStatus("Could not load Google sign-in", "missing");
    return false;
  }

  if (!googleTokenClient) {
    googleTokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: ui.google.clientId,
      scope: GOOGLE_SCOPES,
      callback: () => {},
    });
  }

  setGoogleStatus("Waiting for Google permission", "syncing");
  return new Promise((resolve) => {
    googleTokenClient.callback = (response) => {
      if (response.error || !response.access_token) {
        ui.google.accessToken = "";
        ui.google.connected = false;
        setGoogleStatus("Google connection cancelled", "missing");
        render();
        resolve(false);
        return;
      }
      ui.google.accessToken = response.access_token;
      ui.google.connected = true;
      setGoogleStatus("Google connected", "ready");
      render();
      resolve(true);
    };
    googleTokenClient.requestAccessToken({ prompt: "consent" });
  });
}

async function googleFetch(url, options = {}) {
  const headers = {
    Authorization: `Bearer ${ui.google.accessToken}`,
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };
  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      ui.google.accessToken = "";
      ui.google.connected = false;
      setGoogleStatus("Reconnect Google to sync", "missing");
    }
    throw new Error(data.error?.message || `Google returned ${response.status}`);
  }

  return data;
}

async function createGoogleDoc() {
  const active = getActive();
  if (!active || ui.google.loading) return;
  const connected = await ensureGoogleToken();
  if (!connected) return;

  ui.google.loading = true;
  setGoogleStatus("Creating Google Doc...", "syncing");
  render();

  try {
    const title = googleDocTitle(active);
    const doc = await googleFetch("https://www.googleapis.com/drive/v3/files?fields=id,name,webViewLink", {
      method: "POST",
      body: JSON.stringify({
        name: title,
        mimeType: "application/vnd.google-apps.document",
      }),
    });

    googleSyncPaused = true;
    updateActive({
      googleDoc: {
        id: doc.id,
        url: doc.webViewLink || `https://docs.google.com/document/d/${doc.id}/edit`,
        title: doc.name || title,
        syncedAt: "",
      },
    });
    googleSyncPaused = false;

    await syncGoogleDoc(state.activeId, { force: true, announce: true });
  } catch (error) {
    setGoogleStatus(error.message || "Google Doc creation failed", "missing");
    showBanner("Google Doc creation failed.");
  } finally {
    ui.google.loading = false;
    render();
  }
}

function googleDocTitle(sermon) {
  const passage = sermon?.passage || "Untitled sermon";
  const title = sermon?.title ? ` - ${sermon.title}` : "";
  return `Preach Flow | ${passage}${title}`;
}

function buildGoogleDocText(sermon) {
  const updated = new Date().toLocaleString();
  const status = sermonStatus(sermon);
  const lines = [
    googleDocTitle(sermon),
    "",
    `Synced from Preach Flow: ${updated}`,
    "This document is organized from the notes inside the Preach Flow app.",
    "Edits made directly in Google Docs may be replaced on the next sync.",
    "",
    "SERMON OVERVIEW",
    "",
    `Passage: ${sermon.passage || "-"}`,
    `Title: ${sermon.title || "-"}`,
    `Series: ${sermon.series || "-"}`,
    `Date: ${sermon.date ? fmtDate(sermon.date) : "-"}`,
    `Length: ${sermon.length || "-"} minutes`,
    `Deliverable: ${sermon.format || "-"}`,
    `Status: ${status.label}`,
    `Progress: ${sermon.completed.length}/${PHASES.length} phases`,
    "",
    "PREPARATION NOTES",
    "",
  ];

  for (const [blockIndex, block] of BLOCKS.entries()) {
    lines.push(block.label.toUpperCase());
    lines.push(`Target window: ${block.when}`);
    lines.push("");

	    for (const phase of PHASES.filter((item) => item.block === blockIndex)) {
	      const done = sermon.completed.includes(phase.id);
	      const note = getPhaseFocusNotesText(sermon, phase, true).trim();
	      lines.push(`${done ? "[x]" : "[ ]"} ${phase.name}`);
	      lines.push(`Focus: ${phase.focus}`);
	      lines.push("Notes:");
	      lines.push(note || "(No notes yet.)");
      lines.push("");
    }
  }

  if (sermon.thread.length) {
    lines.push("COACH THREAD");
    lines.push("");
    for (const message of sermon.thread) {
      if (message.role === "meta") {
        lines.push(message.content.toUpperCase(), "");
      }
      if (message.role === "user") {
        lines.push("You:", message.content, "");
      }
      if (message.role === "assistant") {
        lines.push("Coach:", message.content, "");
      }
    }
  }

  lines.push("END OF PREACH FLOW SYNC");
  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

async function replaceGoogleDocText(docId, text) {
  const doc = await googleFetch(
    `https://docs.googleapis.com/v1/documents/${encodeURIComponent(docId)}?fields=body(content(endIndex))`,
  );
  const endIndex = Math.max(1, ...(doc.body?.content || []).map((item) => item.endIndex || 1));
  const requests = [];
  if (endIndex > 2) {
    requests.push({
      deleteContentRange: {
        range: {
          startIndex: 1,
          endIndex: endIndex - 1,
        },
      },
    });
  }
  requests.push({
    insertText: {
      location: { index: 1 },
      text: text.endsWith("\n") ? text : `${text}\n`,
    },
  });

  await googleFetch(`https://docs.googleapis.com/v1/documents/${encodeURIComponent(docId)}:batchUpdate`, {
    method: "POST",
    body: JSON.stringify({ requests }),
  });
}

function scheduleGoogleSync() {
  clearTimeout(googleSyncTimer);
  const active = getActive();
  if (!active?.googleDoc?.id || state.google?.autoSync === false || !ui.google.accessToken) return;

  const sermonId = active.id;
  googleSyncTimer = setTimeout(() => {
    syncGoogleDoc(sermonId, { background: true });
  }, 2500);
}

async function syncGoogleDoc(sermonId = state.activeId, options = {}) {
  const sermon = state.sermons.find((item) => item.id === sermonId);
  if (!sermon?.googleDoc?.id) return;

  if (!ui.google.accessToken) {
    setGoogleStatus("Reconnect Google to sync", "missing");
    return;
  }

  setGoogleStatus("Syncing to Google Docs...", "syncing");
  try {
    await replaceGoogleDocText(sermon.googleDoc.id, buildGoogleDocText(sermon));
    const syncedAt = new Date().toISOString();
    googleSyncPaused = true;
    state.sermons = state.sermons.map((item) =>
      item.id === sermonId
        ? {
            ...item,
            googleDoc: {
              ...item.googleDoc,
              syncedAt,
            },
          }
        : item,
    );
    saveState();
    googleSyncPaused = false;
    setGoogleStatus(`Last synced ${formatTime(syncedAt)}`, "ready");
    if (options.announce) showBanner("Synced to Google Docs.");
  } catch (error) {
    setGoogleStatus(error.message || "Google Docs sync failed", "missing");
    if (!options.background) showBanner("Google Docs sync failed.");
  }
}

function setGoogleStatus(message, key = "neutral") {
  ui.google.status = message;
  ui.google.statusKey = key;
  const label = document.querySelector("[data-google-status]");
  if (label) label.textContent = message;
  const dot = document.querySelector("[data-google-dot]");
  if (dot) dot.className = `google-status-dot ${key}`;
}

const EXEC_COMMANDS = {
  bold: ["bold"],
  italic: ["italic"],
  underline: ["underline"],
  ul: ["insertUnorderedList"],
  ol: ["insertOrderedList"],
  h3: ["formatBlock", "h3"],
  quote: ["formatBlock", "blockquote"],
};

function formatDoc(format) {
  const editor = document.querySelector('[data-action="phase-editor"]');
  const command = EXEC_COMMANDS[format];
  if (!editor || !command) return;
  editor.focus({ preventScroll: true });
  try {
    document.execCommand(command[0], false, command[1] || null);
  } catch (_) {
    /* execCommand is deprecated but still works for this rich-text editor */
  }
  persistPhaseEditor(editor);
}

function persistPhaseEditor(editor) {
  const active = getActive();
  if (!active || !editor.dataset.phase) return;
  const clean = sanitizeRichHtml(editor.innerHTML);
  active.notes[editor.dataset.phase] = richHtmlToText(clean) ? clean : "";
  active.updatedAt = new Date().toISOString();
  saveState();
}

function formatEditor(targetKey, format) {
  const editor = getFormattingEditor(targetKey);
  if (!editor) return;

  const start = editor.selectionStart ?? editor.value.length;
  const end = editor.selectionEnd ?? start;
  const selected = editor.value.slice(start, end);
  let replacement = selected;
  let cursorStart = start;
  let cursorEnd = end;

  if (format === "bold") {
    replacement = `**${selected || "important thought"}**`;
    cursorStart = start + 2;
    cursorEnd = start + replacement.length - 2;
  }
  if (format === "italic") {
    replacement = `_${selected || "emphasis"}_`;
    cursorStart = start + 1;
    cursorEnd = start + replacement.length - 1;
  }
  if (format === "bullet") {
    const text = selected || "First point\nSecond point";
    replacement = text
      .split("\n")
      .map((line) => (line.trim().startsWith("- ") ? line : `- ${line}`))
      .join("\n");
    cursorStart = start + replacement.length;
    cursorEnd = cursorStart;
  }
  if (format === "heading") {
    replacement = `## ${selected || "Section heading"}`;
    cursorStart = start + 3;
    cursorEnd = start + replacement.length;
  }

  editor.value = `${editor.value.slice(0, start)}${replacement}${editor.value.slice(end)}`;
  persistFormattedEditorValue(targetKey, editor);
  editor.focus();
  if (typeof editor.setSelectionRange === "function") {
    editor.setSelectionRange(cursorStart, cursorEnd);
  }
}

function getFormattingEditor(targetKey) {
  if (targetKey === "phase-note") return document.querySelector('[data-action="phase-note"]');
  if (targetKey === "journal-quick") return document.querySelector('[data-action="journal-quick-body"]');
  if (targetKey === "journal-main") return document.querySelector('[data-action="journal-draft-body"]');
  return null;
}

function persistFormattedEditorValue(targetKey, editor) {
  if (targetKey === "phase-note") {
    const active = getActive();
    if (!active) return;
    active.notes[editor.dataset.phase] = editor.value;
    active.updatedAt = new Date().toISOString();
    saveState();
    return;
  }
  ui.journalDraft.body = editor.value;
  const submit = document.querySelector('form[data-form="journal-entry"] button[type="submit"]');
  if (submit) submit.disabled = !ui.journalDraft.body.trim();
  const quickSubmit = document.querySelector('[data-action="save-quick-journal"]');
  if (quickSubmit) quickSubmit.disabled = !ui.journalDraft.body.trim();
}

function slug(value) {
  return (value || "sermon")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

function deleteActive() {
  const active = getActive();
  if (!active) return;
  const ok = confirm(`Remove "${active.passage || "this sermon"}" from Preach Flow?`);
  if (!ok) return;
  state.sermons = state.sermons.filter((sermon) => sermon.id !== active.id);
  state.activeId = state.sermons[0]?.id || null;
  if (!state.activeId) state.view = "workspace";
  saveState();
  render();
}

async function checkServerStatus() {
  try {
    const response = await fetch("./api/status");
    ui.serverStatus = { ...(await response.json()), checked: true };
  } catch {
    ui.serverStatus = { available: false, configured: false, checked: true };
  }
  render();
}

function closeOverlays() {
  ui.showAuth = false;
  ui.showOpenAIKey = false;
  ui.showSwitcher = false;
  ui.showDetails = false;
  ui.showGoogleDocs = false;
}

document.addEventListener("click", (event) => {
  // Backdrop click on a modal overlay closes it.
  const overlay = event.target.closest("[data-overlay]");
  if (overlay && !event.target.closest("[data-stop]")) {
    closeOverlays();
    render();
    return;
  }

  const target = event.target.closest("[data-action], [data-view], [data-sermon-card]");
  if (!target) return;

  if (target.dataset.view) {
    state.view = target.dataset.view;
    ui.showNew = false;
    closeOverlays();
    saveState();
    render();
    return;
  }

  if (target.dataset.sermonCard) {
    state.activeId = target.dataset.sermonCard;
    state.view = "workspace";
    saveState();
    render();
    return;
  }

  const action = target.dataset.action;
  if (action === "toggle-theme") setTheme(state.theme === "dark" ? "light" : "dark");
  if (action === "go-signin") {
    if (state.view !== "signin") ui.lastView = state.view;
    state.view = "signin";
    closeOverlays();
    render();
  }
  if (action === "close-signin") {
    state.view = ui.lastView && ui.lastView !== "signin" ? ui.lastView : "workspace";
    render();
  }
  if (action === "new-sermon") {
    ui.showNew = true;
    ui.showSwitcher = false;
    state.view = "workspace";
    render();
  }
  if (action === "cancel-new") {
    ui.showNew = false;
    render();
  }
  if (action === "set-phase") {
    updateActive({ activePhase: target.dataset.phase });
    render();
  }
  if (action === "journey-jump") {
    const bi = Number(target.dataset.block);
    const phase = PHASES.find((p) => p.block === bi) || PHASES[0];
    updateActive({ activePhase: phase.id });
    render();
  }
  if (action === "prev-phase" || action === "next-phase") {
    const active = getActive();
    if (!active) return;
    const curIdx = PHASES.findIndex((p) => p.id === active.activePhase);
    const nextIdx = Math.min(PHASES.length - 1, Math.max(0, curIdx + (action === "next-phase" ? 1 : -1)));
    updateActive({ activePhase: PHASES[nextIdx].id });
    render();
  }
  if (action === "toggle-complete") {
    toggleComplete(target.dataset.phase);
  }
  if (action === "toggle-check") {
    const active = getActive();
    if (!active) return;
    const key = noteItemKey(target.dataset.phase, Number(target.dataset.index));
    const checklist = { ...active.checklist, [key]: !active.checklist?.[key] };
    updateActive({ checklist });
    render();
  }
  if (action === "phase-action") {
    tapPhaseAction(Number(target.dataset.actionIndex));
  }
  if (action === "send") {
    send();
  }
  if (action === "open-coach") {
    ui.showCoach = true;
    render();
  }
  if (action === "close-coach") {
    ui.showCoach = false;
    render();
  }
  if (action === "format-doc") {
    formatDoc(target.dataset.format);
  }
  if (action === "open-switcher") {
    ui.showSwitcher = true;
    render();
  }
  if (action === "close-switcher") {
    ui.showSwitcher = false;
    render();
  }
  if (action === "select-sermon") {
    state.activeId = target.dataset.sermon;
    state.view = "workspace";
    ui.showSwitcher = false;
    ui.showNew = false;
    saveState();
    render();
  }
  if (action === "open-details") {
    ui.showSwitcher = false;
    ui.showDetails = true;
    render();
  }
  if (action === "close-details") {
    ui.showDetails = false;
    render();
  }
  if (action === "open-google-docs") {
    ui.showGoogleDocs = true;
    render();
  }
  if (action === "close-google-docs") {
    ui.showGoogleDocs = false;
    render();
  }
  if (action === "delete-sermon") {
    ui.showDetails = false;
    deleteActive();
  }
  if (action === "export-active") {
    const active = getActive();
    if (active) downloadText(`${slug(active.passage)}.md`, exportMarkdown(active));
  }
  if (action === "copy-active") {
    const active = getActive();
    if (active) copyText(exportMarkdown(active));
  }
  if (action === "openai-key") {
    ui.showOpenAIKey = true;
    render();
  }
  if (action === "save-openai-key") {
    saveOpenAIKey();
  }
  if (action === "clear-openai-key") {
    clearOpenAIKey();
  }
  if (action === "close-openai-key") {
    ui.openAIKeyInput = "";
    ui.showOpenAIKey = false;
    render();
  }
  if (action === "auth-panel") {
    ui.showAuth = true;
    render();
  }
  if (action === "close-auth-panel") {
    ui.showAuth = false;
    render();
  }
  if (action === "google-signin") {
    signInWithGoogle();
  }
  if (action === "password-signin") {
    signInWithPassword();
  }
  if (action === "password-signup") {
    signUpWithPassword();
  }
  if (action === "signin-mode-signup") {
    ui.signinMode = "signup";
    render();
  }
  if (action === "signin-mode-signin") {
    ui.signinMode = "signin";
    render();
  }
  if (action === "forgot-password") {
    sendMagicLink();
  }
  if (action === "send-magic-link") {
    sendMagicLink();
  }
  if (action === "sign-out") {
    signOut();
  }
  if (action === "cloud-sync-now") {
    saveCloudState({ announce: true });
  }
  if (action === "google-connect") {
    ensureGoogleToken();
  }
  if (action === "google-create-doc") {
    createGoogleDoc();
  }
  if (action === "google-sync-now") {
    ensureGoogleToken().then((connected) => {
      if (connected) syncGoogleDoc(state.activeId, { announce: true });
    });
  }
  if (action === "export-all") {
    const all = state.sermons.map(exportMarkdown).join("\n\n---\n\n");
    downloadText("preach-flow-sermons.md", all || "# Preach Flow\n");
  }
  if (action === "pipeline-filter") {
    state.filter = target.dataset.filter;
    saveState();
    render();
  }
  if (action === "review-check") {
    const key = target.dataset.key;
    state.reviewChecks = { ...state.reviewChecks, [key]: !state.reviewChecks[key] };
    saveState();
    render();
  }
  if (action === "clear-review") {
    state.reviewText = "";
    ui.reviewResult = "";
    saveState();
    render();
  }
});

document.addEventListener("submit", (event) => {
  const form = event.target.closest("form[data-form]");
  if (!form) return;
  event.preventDefault();
  if (form.dataset.form === "new-sermon") addSermon(form);
  if (form.dataset.form === "sermon-details") saveDetails(form);
  if (form.dataset.form === "review-sermon") reviewSermon();
  if (form.dataset.form === "journal-entry") saveJournalEntry();
});

document.addEventListener("input", (event) => {
  const target = event.target;
  const action = target.dataset.action;
  if (action === "coach-input") {
    ui.composer = target.value;
    const sendButton = document.querySelector("[data-action='send']");
    if (sendButton) sendButton.disabled = ui.loading || !ui.composer.trim();
  }
  if (action === "openai-key-input") {
    ui.openAIKeyInput = target.value;
  }
  if (action === "auth-email-input") {
    ui.auth.emailInput = target.value;
  }
  if (action === "auth-password-input") {
    ui.auth.passwordInput = target.value;
  }
  if (action === "phase-editor" || action === "notes-editor") {
    persistPhaseEditor(target);
  }
  if (action === "pipeline-query") {
    state.query = target.value;
    saveState();
    render();
  }
  if (action === "review-text") {
    state.reviewText = target.value;
    saveState();
    const submit = document.querySelector("form[data-form='review-sermon'] button[type='submit']");
    if (submit) submit.disabled = ui.reviewLoading || !state.reviewText.trim();
  }
  if (action === "review-meta") {
    state.reviewMeta[target.dataset.field] = target.value;
    saveState();
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  const action = target.dataset.action;
  if (action === "review-file") {
    handleReviewFile(target);
  }
  if (action === "google-autosync") {
    state.google = { ...(state.google || {}), autoSync: target.checked };
    saveState();
    setGoogleStatus(target.checked ? "Auto-sync enabled" : "Auto-sync paused", target.checked ? "ready" : "neutral");
  }
});

// Keep the contenteditable's selection when a toolbar button is pressed.
document.addEventListener("mousedown", (event) => {
  if (event.target.closest('[data-action="format-doc"]')) {
    event.preventDefault();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.target.dataset?.action === "coach-input" && event.key === "Enter") {
    event.preventDefault();
    send();
    return;
  }
  const card = event.target.closest("[data-sermon-card]");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    state.activeId = card.dataset.sermonCard;
    state.view = "workspace";
    saveState();
    render();
  }
});

render();
checkServerStatus();
loadGoogleConfig();
