const STORE_KEY = "pulpitos:web:v1";
const OPENAI_KEY_STORE = "preach-flow:openai-api-key:v1";
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

const ui = {
  showNew: false,
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
if (!state.view) state.view = "workspace";
if (!state.query) state.query = "";
if (!state.filter) state.filter = "all";
if (!state.reviewMeta) state.reviewMeta = { passage: "", title: "" };
if (!state.reviewText) state.reviewText = "";
if (!state.google) state.google = { autoSync: true };

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
      google: parsed.google || { autoSync: true },
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
    };
  }
}

function saveState() {
  localStorage.setItem(
    STORE_KEY,
    JSON.stringify({
      sermons: state.sermons,
      activeId: state.activeId,
      view: state.view,
      query: state.query,
      filter: state.filter,
      reviewMeta: state.reviewMeta,
      reviewText: state.reviewText,
      google: state.google,
    }),
  );
  if (!googleSyncPaused) scheduleGoogleSync();
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
    notes: sermon.notes && typeof sermon.notes === "object" ? sermon.notes : {},
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
  return '<span class="loading-dots"><i></i><i></i><i></i></span>';
}

function render() {
  const active = getActive();
  app.innerHTML = `
    <div class="app-shell">
      ${renderTopbar(active)}
      <main class="app-main">
        ${ui.banner ? `<div class="banner">${escapeHtml(ui.banner)}</div>` : ""}
        ${ui.showOpenAIKey ? renderOpenAIKeyPanel() : ""}
        ${renderMain(active)}
      </main>
    </div>
  `;
  requestAnimationFrame(() => {
    const thread = document.querySelector("[data-thread]");
    if (thread) thread.scrollTop = thread.scrollHeight;
  });
}

function renderTopbar(active) {
  const status = ui.openai.hasKey ? "ready" : "missing";
  const statusLabel = ui.openai.hasKey ? "Coach key added" : "Add OpenAI key";

  return `
    <header class="topbar">
      <div class="brand">
        <img class="brand-mark" src="./assets/preach-flow-mark.svg" alt="" />
        <div class="brand-text">
          <div class="brand-name">Preach <span>Flow</span></div>
          <div class="brand-kicker">From text to pulpit with clarity.</div>
        </div>
      </div>
      <div class="top-actions">
        <button class="status-line status-button" data-action="openai-key" title="${attr(statusLabel)}"><i class="status-dot ${status}"></i>${escapeHtml(statusLabel)}</button>
        ${
          state.sermons.length
            ? `<select class="select" data-action="active-sermon" aria-label="Active sermon">
                ${state.sermons
                  .map(
                    (sermon) =>
                      `<option value="${attr(sermon.id)}" ${sermon.id === active?.id ? "selected" : ""}>${escapeHtml(
                        sermon.passage || "Untitled sermon",
                      )}${sermon.title ? ` - ${escapeHtml(sermon.title)}` : ""}</option>`,
                  )
                  .join("")}
              </select>`
            : ""
        }
        <button class="btn nav-btn ${state.view === "workspace" ? "active" : ""}" data-view="workspace">Workspace</button>
        <button class="btn nav-btn ${state.view === "pipeline" ? "active" : ""}" data-view="pipeline">Pipeline</button>
        <button class="btn nav-btn ${state.view === "review" ? "active" : ""}" data-view="review">Review</button>
        <button class="btn btn-primary" data-action="new-sermon">+ Sermon</button>
      </div>
    </header>
  `;
}

function renderOpenAIKeyPanel() {
  return `
    <section class="panel panel-pad key-panel">
      <div>
        <span class="eyebrow">Coach Engine</span>
        <h2 class="title">Use your own OpenAI key</h2>
      </div>
      <p class="subtle">Preach Flow does not use a shared server key. Each user adds their own OpenAI API key, stored only in this browser and sent over HTTPS for coach/review requests.</p>
      <div class="field">
        <label for="openai-key">OpenAI API key</label>
        <input id="openai-key" class="input" type="password" data-action="openai-key-input" value="${attr(ui.openAIKeyInput)}" placeholder="sk-proj-..." autocomplete="off" />
      </div>
      <div class="action-row">
        <button class="btn btn-primary" data-action="save-openai-key">Save key in this browser</button>
        <button class="btn" data-action="clear-openai-key">Remove key</button>
        <button class="btn btn-ghost" data-action="close-openai-key">Close</button>
      </div>
      <p class="helper-text">For a public app, visitors should use keys from their own OpenAI Platform accounts so usage bills to them, not to you.</p>
    </section>
  `;
}

function renderMain(active) {
  if (ui.showNew) return renderNewSermon();
  if (state.view === "pipeline") return renderPipeline();
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
    <section class="two-col">
      <form class="panel panel-pad stack" data-form="new-sermon">
        <div class="section-head">
          <div>
            <span class="eyebrow">New sermon</span>
            <h1 class="title">Start a sermon</h1>
          </div>
        </div>
        <div class="form-grid">
          <div class="field full-span">
            <label for="new-passage">Passage</label>
            <input id="new-passage" class="input" name="passage" placeholder="Ephesians 3:1-13" required />
          </div>
          <div class="field full-span">
            <label for="new-title">Working title</label>
            <input id="new-title" class="input" name="title" placeholder="The Church on Display" />
          </div>
          <div class="field">
            <label for="new-date">Preaching date</label>
            <input id="new-date" class="input" type="date" name="date" />
          </div>
          <div class="field">
            <label for="new-length">Length</label>
            <input id="new-length" class="input" name="length" inputmode="numeric" value="${attr(DEFAULT_DRAFT.length)}" />
          </div>
          <div class="field">
            <label for="new-series">Series</label>
            <input id="new-series" class="input" name="series" placeholder="Family Matters" />
          </div>
          <div class="field">
            <label for="new-format">Deliverable</label>
            <select id="new-format" class="select" name="format">
              <option>Full manuscript</option>
              <option>Preaching notes</option>
            </select>
          </div>
        </div>
        <div class="action-row">
          <button class="btn btn-primary" type="submit">Begin prep</button>
          ${state.sermons.length ? `<button class="btn" type="button" data-action="cancel-new">Cancel</button>` : ""}
        </div>
      </form>
      <aside class="panel panel-pad stack">
        <div>
          <span class="eyebrow">Prep blocks</span>
          <h2 class="title">Four movements</h2>
        </div>
        ${BLOCKS.map(
          (block, index) => `
            <div>
              <div class="block-label">${index + 1}. ${escapeHtml(block.label)}<span>${escapeHtml(block.when)}</span></div>
              <div class="meta-line">${PHASES.filter((phase) => phase.block === index)
                .map((phase) => escapeHtml(phase.name))
                .join(", ")}</div>
            </div>
          `,
        ).join("")}
      </aside>
    </section>
  `;
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
      return sermonStatus(sermon).key === state.filter;
    })
    .sort((a, b) => {
      if (!a.date && !b.date) return a.createdAt.localeCompare(b.createdAt);
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });

  return `
    <section>
      <div class="section-head">
        <div>
          <span class="eyebrow">Pipeline</span>
          <h1 class="title">Sermons in motion</h1>
        </div>
        <button class="btn btn-primary" data-action="new-sermon">+ Sermon</button>
      </div>
      <div class="pipeline-tools">
        <input class="input" data-action="pipeline-query" value="${attr(state.query)}" placeholder="Search passage, title, or series" />
        <select class="select" data-action="pipeline-filter" aria-label="Filter sermons">
          ${[
            ["all", "All"],
            ["behind", "Behind"],
            ["on-track", "On track"],
            ["ahead", "Ahead"],
            ["neutral", "No date"],
          ]
            .map(
              ([value, label]) =>
                `<option value="${value}" ${state.filter === value ? "selected" : ""}>${label}</option>`,
            )
            .join("")}
        </select>
        <button class="btn" data-action="export-all">Export all</button>
      </div>
      ${
        sermons.length
          ? `<div class="pipeline-grid">${sermons.map(renderSermonCard).join("")}</div>`
          : `<div class="panel panel-pad"><p class="subtle">No sermons match this view.</p></div>`
      }
    </section>
  `;
}

function renderSermonCard(sermon) {
  const status = sermonStatus(sermon);
  const expected = expectedBlock(status.days);
  return `
    <article class="panel sermon-card" data-sermon-card="${attr(sermon.id)}" tabindex="0">
      <div class="section-head">
        <div>
          <h3>${escapeHtml(sermon.passage || "Untitled sermon")}</h3>
          <div class="meta-line">${escapeHtml(sermon.title || sermon.series || "No title")}</div>
        </div>
        <span class="badge ${status.key}">${escapeHtml(status.label)}</span>
      </div>
      <div class="meta-line">
        ${sermon.date ? escapeHtml(fmtDate(sermon.date)) : "No date"}
        ${status.days !== null ? ` - ${status.days} days out` : ""}
        ${expected !== null ? ` - ${escapeHtml(BLOCKS[expected].label)}` : ""}
      </div>
      <div class="segment-bar">
        ${BLOCKS.map((_, blockIndex) => {
          const phases = PHASES.filter((phase) => phase.block === blockIndex);
          const done = phases.every((phase) => sermon.completed.includes(phase.id));
          return `<span class="segment ${done ? "done" : ""}"></span>`;
        }).join("")}
      </div>
      <div class="meta-line">${sermon.completed.length}/${PHASES.length} phases - ${progressPct(sermon)}%</div>
    </article>
  `;
}

function renderWorkspace(active) {
  const phase = getPhase(active);
  return `
    <section class="workspace-grid">
      <aside class="stack">
        ${renderSermonSummary(active)}
        ${renderSermonDetails(active)}
        ${renderClock(active)}
        ${renderWorkflow(active, phase)}
      </aside>
      <div class="stack">
        ${renderPhasePanel(active, phase)}
        ${phase.devotional ? renderDevotionalPanel(phase) : renderConversation(active)}
      </div>
      ${renderNotes(active, phase)}
    </section>
  `;
}

function renderSermonSummary(active) {
  const status = sermonStatus(active);
  return `
    <section class="panel panel-pad stack">
      <div>
        <span class="eyebrow">Active sermon</span>
        <h1 class="title">${escapeHtml(active.passage || "Untitled sermon")}</h1>
        <div class="meta-line">${escapeHtml(active.title || active.series || "No title")}</div>
      </div>
      <div>
        <div class="metric">
          <dt>Progress</dt>
          <dd>${progressPct(active)}%</dd>
        </div>
        <div class="progress"><span style="width: ${progressPct(active)}%"></span></div>
      </div>
      <span class="badge ${status.key}">${escapeHtml(status.label)}</span>
    </section>
  `;
}

function renderSermonDetails(active) {
  return `
    <form class="panel panel-pad stack" data-form="sermon-details">
      <div class="section-head">
        <div>
          <span class="eyebrow">Details</span>
          <h2 class="title">Sermon file</h2>
        </div>
      </div>
      <div class="field">
        <label for="detail-passage">Passage</label>
        <input id="detail-passage" class="input" name="passage" value="${attr(active.passage)}" required />
      </div>
      <div class="field">
        <label for="detail-title">Title</label>
        <input id="detail-title" class="input" name="title" value="${attr(active.title)}" />
      </div>
      <div class="field">
        <label for="detail-series">Series</label>
        <input id="detail-series" class="input" name="series" value="${attr(active.series)}" />
      </div>
      <div class="form-grid">
        <div class="field">
          <label for="detail-date">Date</label>
          <input id="detail-date" class="input" type="date" name="date" value="${attr(active.date)}" />
        </div>
        <div class="field">
          <label for="detail-length">Length</label>
          <input id="detail-length" class="input" name="length" inputmode="numeric" value="${attr(active.length)}" />
        </div>
      </div>
      <div class="field">
        <label for="detail-format">Deliverable</label>
        <select id="detail-format" class="select" name="format">
          <option ${active.format === "Full manuscript" ? "selected" : ""}>Full manuscript</option>
          <option ${active.format === "Preaching notes" ? "selected" : ""}>Preaching notes</option>
        </select>
      </div>
      <div class="action-row">
        <button class="btn btn-primary" type="submit">Save</button>
        <button class="btn btn-danger" type="button" data-action="delete-sermon">Remove</button>
      </div>
    </form>
  `;
}

function renderClock(active) {
  const status = sermonStatus(active);
  const blockIndex = expectedBlock(status.days);
  return `
    <section class="panel panel-pad stack">
      <div>
        <span class="eyebrow">Clock</span>
        <h2 class="title">Timing</h2>
      </div>
      <dl class="metric-list">
        <div class="metric"><dt>Days out</dt><dd>${status.days === null ? "-" : status.days}</dd></div>
        <div class="metric"><dt>Should be in</dt><dd>${blockIndex === null ? "Set date" : escapeHtml(BLOCKS[blockIndex].label)}</dd></div>
        <div class="metric"><dt>Done</dt><dd>${active.completed.length}/${PHASES.length}</dd></div>
      </dl>
      <button class="btn btn-primary" data-action="orient" ${ui.loading ? "disabled" : ""}>Orient me</button>
    </section>
  `;
}

function renderWorkflow(active, currentPhase) {
  return `
    <section class="panel panel-pad">
      <span class="eyebrow">Workflow</span>
      ${BLOCKS.map(
        (block, blockIndex) => `
          <div class="phase-block">
            <div class="block-label">${escapeHtml(block.label)}<span>${escapeHtml(block.when)}</span></div>
            <div class="phase-list">
              ${PHASES.filter((phase) => phase.block === blockIndex)
                .map((phase) => {
                  const done = active.completed.includes(phase.id);
                  const current = currentPhase.id === phase.id;
                  return `
                    <button class="phase-row ${current ? "active" : ""}" data-action="set-phase" data-phase="${attr(phase.id)}">
                      <span class="phase-dot ${done ? "done" : ""}">${done ? "OK" : ""}</span>
                      <span>${escapeHtml(phase.name)}</span>
                    </button>
                  `;
                })
                .join("")}
            </div>
          </div>
        `,
      ).join("")}
    </section>
  `;
}

function renderPhasePanel(active, phase) {
  const phaseIndex = PHASES.findIndex((item) => item.id === phase.id);
  const complete = active.completed.includes(phase.id);
  return `
    <section class="panel panel-pad">
      <div class="section-head">
        <div>
          <span class="eyebrow">Step ${phaseIndex + 1} of ${PHASES.length} - ${escapeHtml(BLOCKS[phase.block].label)}</span>
          <h1 class="title">${escapeHtml(phase.name)}</h1>
        </div>
        ${phase.devotional ? `<span class="badge neutral">Devotional</span>` : ""}
      </div>
      <p class="phase-focus">${escapeHtml(phase.focus)}</p>
      <ul class="todo-list">
        ${phase.doItems.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
      </ul>
      ${
        phase.actions
          ? `<div class="action-row">${phase.actions
              .map(
                (action, index) =>
                  `<button class="btn" data-action="phase-action" data-action-index="${index}" ${ui.loading ? "disabled" : ""}>${escapeHtml(action.label)}</button>`,
              )
              .join("")}</div>`
          : ""
      }
      <div class="action-row">
        <button class="btn ${complete ? "" : "btn-primary"}" data-action="toggle-complete" data-phase="${attr(phase.id)}">
          ${complete ? "Completed - undo" : "Mark complete"}
        </button>
      </div>
    </section>
  `;
}

function renderDevotionalPanel(phase) {
  if (phase.id !== "heart") {
    return `
      <section class="panel panel-pad">
        <span class="eyebrow">Private work</span>
        <p class="phase-focus">This phase is between you and the Lord. Capture notes in the rail when you want to keep them with the sermon.</p>
      </section>
    `;
  }
  return `
    <section class="panel panel-pad">
      <span class="eyebrow">One last thing</span>
      <p class="phase-focus">The work is done. Walk into Sunday emptied of yourself and full of Christ. He does not need a perfect sermon - he uses a surrendered preacher.</p>
    </section>
  `;
}

function renderConversation(active) {
  return `
    <section class="panel">
      <div class="panel-pad section-head">
        <div>
          <span class="eyebrow">Coach</span>
          <h2 class="title">Feedback thread</h2>
        </div>
      </div>
      <div class="thread" data-thread>
        <div class="message-list">
          ${
            active.thread.length
              ? active.thread.map(renderMessage).join("")
              : `<div class="subtle">Bring your work to a phase action, or ask from the composer.</div>`
          }
          ${ui.loading ? `<div class="message coach"><div class="who">Coach</div><div class="bubble">${loadingDots()}</div></div>` : ""}
        </div>
      </div>
      <div class="composer">
        <label class="visually-hidden" for="composer">Message</label>
        <textarea id="composer" class="textarea" data-action="composer-input" placeholder="${attr(ui.composerPlaceholder)}">${escapeHtml(ui.composer)}</textarea>
        <div class="composer-actions">
          <button class="btn btn-ghost" data-action="clear-composer">Clear</button>
          <button class="btn btn-primary" data-action="send" ${ui.loading || !ui.composer.trim() ? "disabled" : ""}>${ui.loading ? "Thinking" : "Send"}</button>
        </div>
      </div>
    </section>
  `;
}

function renderMessage(message) {
  if (message.role === "meta") {
    return `<div class="divider">${escapeHtml(message.content)}</div>`;
  }
  const kind = message.role === "user" ? "user" : "coach";
  return `
    <div class="message ${kind}">
      ${message.role === "assistant" ? `<div class="who">Coach</div>` : ""}
      <div class="bubble">${escapeHtml(message.content)}</div>
    </div>
  `;
}

function renderNotes(active, phase) {
  return `
    <aside class="panel panel-pad stack note-rail">
      <div>
        <span class="eyebrow">Notes</span>
        <h2 class="title">${escapeHtml(phase.name)}</h2>
      </div>
      <textarea class="textarea" data-action="phase-note" data-phase="${attr(phase.id)}" placeholder="Capture your own work for this phase.">${escapeHtml(
        active.notes[phase.id] || "",
      )}</textarea>
      <div class="action-row">
        <button class="btn" data-action="export-active">Export sermon</button>
        <button class="btn" data-action="copy-active">Copy</button>
      </div>
      ${renderGoogleDocsPanel(active)}
    </aside>
  `;
}

function renderGoogleDocsPanel(active) {
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
    <div class="google-docs-box">
      <div class="section-head">
        <div>
          <span class="eyebrow">Google Docs</span>
          <h3 class="mini-title">${doc?.title ? escapeHtml(doc.title) : "Live sermon doc"}</h3>
        </div>
        <span class="google-status-dot ${attr(ui.google.statusKey || "neutral")}" data-google-dot></span>
      </div>
      <p class="meta-line" data-google-status>${escapeHtml(status)}</p>
      ${
        doc?.url
          ? `<a class="doc-link" href="${attr(doc.url)}" target="_blank" rel="noopener">Open linked Google Doc</a>`
          : ""
      }
      <label class="toggle-row">
        <input type="checkbox" data-action="google-autosync" ${autoSync ? "checked" : ""} ${doc?.id ? "" : "disabled"} />
        <span>Auto-sync after edits</span>
      </label>
      <div class="action-row compact-actions">
        ${
          configured && !connected
            ? `<button class="btn" data-action="google-connect" ${ui.google.loading ? "disabled" : ""}>Connect Google</button>`
            : ""
        }
        ${
          configured && connected && !doc?.id
            ? `<button class="btn btn-primary" data-action="google-create-doc" ${ui.google.loading ? "disabled" : ""}>Create Doc</button>`
            : ""
        }
        ${
          doc?.id
            ? `<button class="btn" data-action="google-sync-now" ${ui.google.loading ? "disabled" : ""}>Sync now</button>`
            : ""
        }
      </div>
      ${
        configured
          ? ""
          : `<p class="helper-text">Set <code>GOOGLE_CLIENT_ID</code> in Vercel to enable Google Docs sync.</p>`
      }
    </div>
  `;
}

function renderReview() {
  return `
    <section class="two-col">
      <form class="panel panel-pad stack" data-form="review-sermon">
        <div>
          <span class="eyebrow">Review</span>
          <h1 class="title">Completeness check</h1>
        </div>
        <div class="form-grid">
          <div class="field">
            <label for="review-passage">Passage</label>
            <input id="review-passage" class="input" data-action="review-meta" data-field="passage" value="${attr(state.reviewMeta.passage)}" placeholder="Ephesians 3:1-13" />
          </div>
          <div class="field">
            <label for="review-title">Title</label>
            <input id="review-title" class="input" data-action="review-meta" data-field="title" value="${attr(state.reviewMeta.title)}" />
          </div>
        </div>
        <div class="field">
          <label for="review-file">Upload</label>
          <input id="review-file" class="input" type="file" data-action="review-file" accept=".txt,.md,.markdown,.docx" />
        </div>
        <div class="field">
          <label for="review-text">Sermon text</label>
          <textarea id="review-text" class="textarea" style="min-height: 300px" data-action="review-text" placeholder="Paste the manuscript here.">${escapeHtml(
            state.reviewText,
          )}</textarea>
        </div>
        <div class="action-row">
          <button class="btn btn-primary" type="submit" ${ui.reviewLoading || !state.reviewText.trim() ? "disabled" : ""}>${
            ui.reviewLoading ? "Reviewing" : "Review sermon"
          }</button>
          <button class="btn" type="button" data-action="clear-review">Clear</button>
        </div>
      </form>
      <aside class="panel panel-pad stack">
        <div>
          <span class="eyebrow">Framework</span>
          <h2 class="title">Checks</h2>
        </div>
        <ul class="todo-list">
          ${[
            "One clear big idea and purpose",
            "Structure flowing from the text",
            "Christ as hero, not moralism",
            "Gospel woven throughout and landed strongly",
            "Explanation, illustration, and application under each point",
            "Concrete imagery and specific application",
            "Invitation, conclusion, and walk-away point",
          ]
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}
        </ul>
        ${
          ui.reviewLoading || ui.reviewResult
            ? `<div class="review-result">
                ${
                  ui.reviewLoading
                    ? `<div class="message review"><div class="who">Review</div><div class="bubble">${loadingDots()}</div></div>`
                    : `<div class="message review"><div class="who">Review</div><div class="bubble">${escapeHtml(ui.reviewResult)}</div></div>`
                }
              </div>`
            : ""
        }
      </aside>
    </section>
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

  const base = [...active.thread];
  if (metaLabel) base.push({ role: "meta", content: metaLabel });
  const next = [...base, { role: "user", content: text }];
  updateActive({ thread: next });
  ui.composer = "";
  ui.composerPlaceholder = "Bring your work, or ask the coach a question...";
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
  ui.composerPlaceholder = action.placeholder || ui.composerPlaceholder;
  render();
  requestAnimationFrame(() => {
    const composer = document.querySelector("[data-action='composer-input']");
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
      const note = sermon.notes[phase.id]?.trim();
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
  } catch {
    ui.google.configured = false;
    ui.google.status = "Google Docs config unavailable";
    ui.google.statusKey = "missing";
  }
  render();
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
    const title = `Preach Flow - ${active.passage || active.title || "Untitled sermon"}`;
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

function buildGoogleDocText(sermon) {
  const updated = new Date().toLocaleString();
  return [
    "Preach Flow",
    `Synced: ${updated}`,
    "",
    exportMarkdown(sermon),
    "",
    "Note: Preach Flow sync writes this document from the app. Edits made directly in Google Docs may be replaced on the next sync.",
  ].join("\n");
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

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action], [data-view], [data-sermon-card]");
  if (!target) return;

  if (target.dataset.view) {
    state.view = target.dataset.view;
    ui.showNew = false;
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
  if (action === "new-sermon") {
    ui.showNew = true;
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
  if (action === "toggle-complete") {
    toggleComplete(target.dataset.phase);
  }
  if (action === "phase-action") {
    tapPhaseAction(Number(target.dataset.actionIndex));
  }
  if (action === "orient") {
    send(
      "Orient me. Based on the clock and how many phases I have completed, where should I be, am I behind or on track, and what is my single next move?",
      "Orientation",
    );
  }
  if (action === "send") {
    send();
  }
  if (action === "clear-composer") {
    ui.composer = "";
    render();
  }
  if (action === "delete-sermon") {
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
});

document.addEventListener("input", (event) => {
  const target = event.target;
  const action = target.dataset.action;
  if (action === "composer-input") {
    ui.composer = target.value;
    const sendButton = document.querySelector("[data-action='send']");
    if (sendButton) sendButton.disabled = ui.loading || !ui.composer.trim();
  }
  if (action === "openai-key-input") {
    ui.openAIKeyInput = target.value;
  }
  if (action === "phase-note") {
    const active = getActive();
    if (!active) return;
    active.notes[target.dataset.phase] = target.value;
    active.updatedAt = new Date().toISOString();
    saveState();
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
  if (action === "active-sermon") {
    state.activeId = target.value;
    state.view = "workspace";
    saveState();
    render();
  }
  if (action === "pipeline-filter") {
    state.filter = target.value;
    saveState();
    render();
  }
  if (action === "review-file") {
    handleReviewFile(target);
  }
  if (action === "google-autosync") {
    state.google = { ...(state.google || {}), autoSync: target.checked };
    saveState();
    setGoogleStatus(target.checked ? "Auto-sync enabled" : "Auto-sync paused", target.checked ? "ready" : "neutral");
  }
});

document.addEventListener("keydown", (event) => {
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
