const criteria = [
  {
    id: "screen-work",
    label: "Screen work",
    hint: "Looks for design, development, review, and content handling tasks that clearly need a computer.",
    keywords: ["design", "develop", "online courses", "digital", "content", "software", "tools"],
    weight: 2,
  },
  {
    id: "keyboard-work",
    label: "Keyboard work",
    hint: "Strongly suggests writing, planning, documentation, editing, or coordination-heavy work.",
    keywords: ["write", "draft", "documentation", "update", "communicate", "status", "plans"],
    weight: 2,
  },
  {
    id: "mouse-work",
    label: "Mouse work",
    hint: "Covers visual editing, media selection, graphics, interactive elements, or interface work.",
    keywords: ["media", "video", "graphics", "interactive", "user-centered", "accessibility", "technology"],
    weight: 2,
  },
  {
    id: "mic-work",
    label: "Microphone work",
    hint: "Finds facilitation, workshops, advising, and live collaboration that would usually involve speaking.",
    keywords: ["workshops", "consultation", "guidance", "webinars", "training", "faculty", "advising"],
    weight: 2,
  },
  {
    id: "ai-support",
    label: "AI-friendly",
    hint: "Highlights tasks where AI can accelerate first drafts, summarising, variation generation, or analysis.",
    keywords: ["ai", "emerging technologies", "innovative", "efficiency", "accelerated", "leverage", "explore"],
    weight: 3,
  },
  {
    id: "translation",
    label: "Content translation",
    hint: "Shows places where dense material gets turned into clearer, scaffolded learner-facing material.",
    keywords: ["translate", "complex content", "scaffolded", "meaningful", "learning experiences", "student feedback"],
    weight: 2,
  },
  {
    id: "project-management",
    label: "Project management",
    hint: "Covers timelines, scope, risks, and status updates, which are easy to support with AI planning tools.",
    keywords: ["project plans", "timelines", "scope", "risk", "status updates", "progress", "deliver"],
    weight: 2,
  },
];

const sampleText = `The Learning Designer is responsible for the design and development of high-quality online courses that reflect best practice in learning theory, instructional design, and current scholarship in digital education. The role makes innovative use of emerging technologies, and principally AI, to enhance efficiency in course development and delivery, to explore alternative treatments of course content, and to support the professional growth of colleagues through sharing and training in these approaches. Working closely with academic staff and cross-functional teams, the role ensures that courses are aligned to programme objectives, quality standards, and agreed timelines, while contributing to the consistency and effectiveness of the learning design team.

Key Duties And Responsibilities

Course Design:
Collaborate closely with university faculty to design courses that are creative, inspiring and engaging and aligned to programme learning objectives.
Apply online learning best practices, appropriate learning theory, user-centered design methods, and accessibility standards to improve faculty’s courses in terms of effectiveness, use of technology, and student engagement.
Translate complex content into clear, meaningful and scaffolded learning experiences for students.
Keep practices current by drawing on educational research, innovations in digital pedagogy and student feedback to inform design approaches.
Provide recommendations and guidance on media use, including video, interactive elements and graphics to strengthen learning outcomes.

Faculty Advising:
Establish strong rapport and credibility with faculty members; provide expert guidance and creative consultation through course development process.
Act as a thought partner for academics and programme directors, offering advice grounded in adult learning theory, industry trends and Risepoint design principles.
Encourage experimentation and identify opportunities to improve student learning, faculty experience, business impact, and client relationships.
Support faculty development through the delivery of online workshops, job aids and resources to strengthen teaching practice

Use of AI:
Explore the creative use of AI to produce engaging treatment of content delivering and supporting a personalized online student experience conducive to facilitating learning.
Regularly leverage AI tools to support the efficient and accelerated development of courses.

Project Management:
Manage course development projects, academics and schedules to ensure courses are delivered on time and within scope.
Develop and follow sound project plans, communicate clearly with internal and external stakeholders and escalate risks appropriately
Leverage Risepoint’s established processes and tools to track progress, maintain accurate status updates and continue to process improvements.

Additional Position Responsibilities
Perform in accordance with Risepoint Policies
Perform other duties as assigned`;

const jobText = document.getElementById("jobText");
const analyzeButton = document.getElementById("analyzeButton");
const clearButton = document.getElementById("clearButton");
const loadSampleButton = document.getElementById("loadSampleButton");
const copyButton = document.getElementById("copyButton");
const downloadButton = document.getElementById("downloadButton");
const reportTitleInput = document.getElementById("reportTitle");
const results = document.getElementById("results");
const summary = document.getElementById("summary");
const matchCount = document.getElementById("matchCount");
const criteriaGrid = document.getElementById("criteriaGrid");

let lastFindings = [];
let lastText = "";

function splitSentences(text) {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function analyse(text) {
  const sentences = splitSentences(text);
  const findings = [];

  for (const criterion of criteria) {
    const matches = sentences.filter((sentence) => {
      const lowered = sentence.toLowerCase();
      return criterion.keywords.some((keyword) => lowered.includes(keyword.toLowerCase()));
    });

    if (matches.length > 0) {
      findings.push({
        ...criterion,
        matches,
        score: matches.length * criterion.weight,
      });
    }
  }

  findings.sort((a, b) => b.score - a.score);
  return findings;
}

function renderCriteria() {
  criteriaGrid.innerHTML = criteria
    .map(
      (criterion) => `
        <article class="criteria-card">
          <h3>${criterion.label}</h3>
          <p>${criterion.hint}</p>
        </article>
      `,
    )
    .join("");
}

function renderResults(findings, text) {
  lastFindings = findings;
  lastText = text;

  if (!text.trim()) {
    results.innerHTML = "";
    summary.innerHTML = "Paste a JD and choose <strong>Analyse text</strong> to see the strongest matches.";
    matchCount.textContent = "0 matches";
    return;
  }

  if (findings.length === 0) {
    results.innerHTML = "";
    summary.textContent = "No strong matches were found. Try pasting a fuller JD or one with explicit delivery, coordination, workshop, AI, or media language.";
    matchCount.textContent = "0 matches";
    return;
  }

  const strongest = findings[0];
  const totalMentions = findings.reduce((sum, item) => sum + item.matches.length, 0);
  summary.innerHTML = `Found <strong>${findings.length}</strong> matching rule areas and <strong>${totalMentions}</strong> supporting mentions. The strongest signal is <strong>${strongest.label}</strong>.`;
  matchCount.textContent = `${findings.length} matches`;

  results.innerHTML = findings
    .map(
      (item) => `
        <article class="result-card">
          <strong>${item.label}</strong>
          <p class="quote">${item.matches[0]}</p>
          <div class="tag-row">
            <span class="tag">${item.matches.length} mention${item.matches.length === 1 ? "" : "s"}</span>
            <span class="tag tag--soft">AI-friendly</span>
          </div>
        </article>
      `,
    )
    .join("");
}

function runAnalysis() {
  renderResults(analyse(jobText.value), jobText.value);
}

function buildReport(findings, text) {
  const lines = [];
  const reportTitle = reportTitleInput.value.trim() || "Learning Designer JD Review";
  const now = new Date();
  lines.push(reportTitle);
  lines.push("");
  lines.push(`Created: ${now.toLocaleString()}`);
  lines.push("");
  lines.push(`Source length: ${text.trim().split(/\s+/).filter(Boolean).length} words`);
  lines.push(`Matches found: ${findings.length}`);
  lines.push("");

  if (findings.length === 0) {
    lines.push("No strong matches were found.");
    return lines.join("\n");
  }

  lines.push("Stakeholder-ready summary:");
  lines.push("This job description contains multiple clear signals for screen-based, keyboard-based, mouse-based, and microphone-based work, plus strong AI-friendly opportunities.");
  lines.push("");
  lines.push("Top evidence:");
  for (const finding of findings) {
    lines.push(`- ${finding.label}: ${finding.matches[0]}`);
  }

  return lines.join("\n");
}

async function copyReport() {
  const report = buildReport(lastFindings, lastText);

  if (!navigator.clipboard) {
    window.alert("Your browser does not support clipboard copy here. You can still select and copy the report manually.");
    return;
  }

  await navigator.clipboard.writeText(report);
  copyButton.textContent = "Copied!";
  window.setTimeout(() => {
    copyButton.textContent = "Copy report";
  }, 1500);
}

function downloadReport() {
  const report = buildReport(lastFindings, lastText);
  const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "learning-designer-jd-matcher-report.txt";
  anchor.click();
  URL.revokeObjectURL(url);
}

analyzeButton.addEventListener("click", runAnalysis);
clearButton.addEventListener("click", () => {
  jobText.value = "";
  renderResults([], "");
});
loadSampleButton.addEventListener("click", () => {
  jobText.value = sampleText;
  runAnalysis();
});
copyButton.addEventListener("click", copyReport);
downloadButton.addEventListener("click", downloadReport);

jobText.addEventListener("keydown", (event) => {
  if (event.metaKey || event.ctrlKey) {
    if (event.key === "Enter") {
      runAnalysis();
    }
  }
});

renderCriteria();
jobText.value = sampleText;
runAnalysis();
