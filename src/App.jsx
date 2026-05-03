import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";


const sections = [
  {
    domain: "Spirit",
    key: "spirit",
    theme: "Connection to God",
    questions: [
"I spend intentional, consistent time in prayer.",
"I engage with Scripture in a meaningful way.",
"I depend on God when making decisions rather than defaulting to myself.",
"I seek God first rather than only when I need help.",
    ],
  },
  {
    domain: "Spirit",
    key: "spirit",
    theme: "Conviction",
    questions: [
"I recognize when something in my life is not aligned with God.",
"I respond to conviction rather than ignoring it.",
"I take responsibility for my actions instead of justifying them.",
"I am sensitive to areas where I need to change.",
    ],
  },
  {
    domain: "Spirit",
    key: "spirit",
    theme: "Desire for Righteousness",
    questions: [
"I genuinely want to grow in righteousness, not just appear good.",
"I feel a pull toward truth even when it is difficult.",
"I am not comfortable staying in patterns I know are wrong.",
"I desire to become more like Christ over time.",
    ],
  },
  {
    domain: "Spirit",
    key: "spirit",
    theme: "Surrender",
    questions: [
"I trust God even when I do not understand the situation.",
"I am willing to release control when I know I should.",
"I follow through on what I believe God is leading me to do.",
"I choose obedience even when it costs me something.",
    ],
  },
  {
    domain: "Soul",
    key: "soul",
    theme: "Thought Life",
    questions: [
"My thoughts are grounded in truth rather than fear or distortion.",
"I am able to refocus when my mind becomes negative or scattered.",
"I have clarity in my thinking rather than constant mental noise.",
"I intentionally direct my thoughts instead of being controlled by them.",
    ],
  },
  {
    domain: "Soul",
    key: "soul",
    theme: "Emotional Stability",
    questions: [
"I remain steady in situations that would normally cause stress.",
"My emotions do not control my decisions.",
"I am aware of my emotional state and able to regulate it.",
"I recover quickly after difficult emotional moments.",
    ],
  },
  {
    domain: "Soul",
    key: "soul",
    theme: "Identity and Humility",
    questions: [
"I have a stable sense of identity that is not dependent on others.",
"I am teachable and open to correction.",
"I can admit when I am wrong without defensiveness.",
"I am not driven by comparison or the need to prove myself.",
    ],
  },
  {
    domain: "Soul",
    key: "soul",
    theme: "Relationships",
    questions: [
"I forgive others rather than holding onto resentment.",
"I approach conflict with a desire for resolution, not control.",
"I treat others with mercy and patience.",
"I avoid creating unnecessary tension or division.",
    ],
  },
  {
    domain: "Body",
    key: "body",
    theme: "Physical Health",
    questions: [
"I maintain consistent energy throughout the day.",
"I take care of my body through food, movement, and rest.",
"I am aware of how my physical state affects my overall functioning.",
"I get enough rest to function well.",
    ],
  },
  {
    domain: "Body",
    key: "body",
    theme: "Discipline",
    questions: [
"I follow through on commitments I make.",
"I maintain consistent routines that support growth.",
"I do what needs to be done even when I don’t feel like it.",
"I avoid procrastination and delay.",
    ],
  },
  {
    domain: "Body",
    key: "body",
    theme: "Self-Control",
    questions: [
"I manage impulses rather than giving in to them.",
"I avoid habits that weaken me physically or mentally.",
"I practice restraint in areas where I know I struggle.",
"I am intentional with how I use my time and energy.",
    ],
  },
];

const allQuestions = sections.flatMap((section, sectionIndex) =>
  section.questions.map((question, questionIndex) => ({
    id: `${sectionIndex}-${questionIndex}`,
    key: section.key,
    domain: section.domain,
    theme: section.theme,
    sectionIndex,
    questionIndex,
    question,
  }))
);

const domainMeta = {
  spirit: {
    label: "Spirit",
    weight: "50%",
    description: "Connection to God",
    interpretation: "Spirit controls closeness to center.",
  },
  soul: {
    label: "Soul",
    weight: "30%",
    description: "Thoughts, emotions, identity",
    interpretation: "Soul controls stability/distortion.",
  },
  body: {
    label: "Body",
    weight: "20%",
    description: "Actions and discipline",
    interpretation: "Body controls containment/expression.",
  },
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function scoreAnswers(answers) {
  const domainValues = { spirit: [], soul: [], body: [] };
  allQuestions.forEach((item) => {
    if (answers[item.id]) {
domainValues[item.key].push(answers[item.id]);
    }
  });

  const average = (items) =>
    items.length ? items.reduce((sum, value) => sum + value, 0) / items.length : 0;

  const spirit = average(domainValues.spirit);
  const soul = average(domainValues.soul);
  const body = average(domainValues.body);
  const total = spirit * 0.5 + soul * 0.3 + body * 0.2;

  return {
    spirit,
    soul,
    body,
    total,
    resistance: 10 - total,
  };
}

function scoreSubcategories(answers) {
  const groups = ["Spirit", "Soul", "Body"].map((domain) => {
    const items = sections
.map((section, sectionIndex) => ({ ...section, sectionIndex }))
.filter((section) => section.domain === domain)
.map((section) => {
  const values = section.questions
    .map((_, questionIndex) => answers[`${section.sectionIndex}-${questionIndex}`])
    .filter(Boolean);
  const score = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
  return {
    category: section.key,
    domain,
    name: section.theme,
    score,
  };
});
    const score = items.length ? items.reduce((sum, item) => sum + item.score, 0) / items.length : 0;
    return { domain, items, score };
  });
  const allItems = groups.flatMap((group) => group.items);
  const subScores = allItems.reduce((scores, item) => {
    scores[item.name] = item.score;
    return scores;
  }, {});
  return {
    groups,
    subScores,
    highest: allItems.reduce((highest, item) => (item.score > highest.score ? item : highest), allItems[0]),
    lowest: allItems.reduce((lowest, item) => (item.score < lowest.score ? item : lowest), allItems[0]),
  };
}

const historyStorageKey = "etytomic-assessment-history";

function alignmentLevelFor(score) {
  return score >= 7 ? "High Alignment" : score >= 4 ? "Moderate Alignment" : "Low Alignment";
}

function resistanceLevelFor(score) {
  return score <= 3 ? "Low Resistance" : score <= 6 ? "Moderate Resistance" : "High Resistance";
}

function lowestCategoryFor(scores) {
  return [
    ["spirit", scores.spirit],
    ["soul", scores.soul],
    ["body", scores.body],
  ].reduce((lowest, current) => (current[1] < lowest[1] ? current : lowest))[0];
}

function loadAssessmentHistory() {
  try {
    const saved = window.localStorage.getItem(historyStorageKey);
    const parsed = saved ? JSON.parse(saved) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function persistAssessmentHistory(entries) {
  window.localStorage.setItem(historyStorageKey, JSON.stringify(entries));
}

function createHistoryEntry(scores, subcategoryResults) {
  const timestamp = new Date().toISOString();
  return {
    id: `${Date.now()}`,
    dateCompleted: timestamp,
    timestamp,
    overallScore: scores.total,
    total: scores.total,
    spiritAvg: scores.spirit,
    soulAvg: scores.soul,
    bodyAvg: scores.body,
    spirit: scores.spirit,
    soul: scores.soul,
    body: scores.body,
    subScores: subcategoryResults.subScores,
    lowestCategory: lowestCategoryFor(scores),
    alignmentLevel: alignmentLevelFor(scores.total),
    resistanceLevel: resistanceLevelFor(scores.resistance),
  };
}

function ellipsePath({ cx = 240, cy = 240, rx, ry, wobble = 0, points = 180 }) {
  const path = [];

  for (let i = 0; i <= points; i += 1) {
    const t = (Math.PI * 2 * i) / points;
    const wave = Math.sin(t * 4) * wobble + Math.sin(t * 7 + 1.2) * wobble * 0.22;
    const x = cx + Math.cos(t) * (rx + wave);
    const y = cy + Math.sin(t) * (ry - wave * 0.36);
    path.push(`${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }

  return `${path.join(" ")} Z`;
}

function EtytomicVisual({ scores, compact = false }) {
  const safeScores = {
    spirit: scores.spirit || 5,
    soul: scores.soul || 5,
    body: scores.body || 5,
    total: scores.total || 5,
  };

  const totalAlignment = safeScores.total;
  const normalized = totalAlignment / 10;
  const resistance = clamp(1 - normalized, 0, 1);
  const centerX = compact ? 240 : 320;
  const centerY = 240;
  const centerStrength = clamp(0.42 + normalized * 0.52, 0.4, 0.94);
  const scoreStyle = (score) => {
    const alignment = clamp(score / 10, 0, 1);
    return {
      opacity: 0.78 + alignment * 0.2,
      width: 2.4 + alignment * 1.1,
      glowOpacity: 0.18 + alignment * 0.24,
    };
  };
  const spiritStyle = scoreStyle(safeScores.spirit);
  const soulStyle = scoreStyle(safeScores.soul);
  const bodyStyle = scoreStyle(safeScores.body);

  const style = {
    "--light-strength": normalized,
    "--ring-definition": normalized,
    "--beam-opacity": 0.18 + normalized * 0.34,
    "--beam-blur": `${2 + normalized * 3}px`,
  };

  return (
    <section
className={`alignment-stage mx-auto w-full ${compact ? "aspect-square max-w-[420px]" : "aspect-[4/3] max-w-[760px]"}`}
style={style}
aria-label="Personal Etytomic Structure visual"
    >
<svg className="relative h-full w-full overflow-visible" viewBox={compact ? "0 0 480 480" : "0 0 640 480"} role="img">
  <defs>
    <linearGradient id="structureWarmBg" x1="0%" x2="100%" y1="0%" y2="100%">
      <stop offset="0%" stopColor="#fffdf6" />
      <stop offset="48%" stopColor="#fff6df" />
      <stop offset="100%" stopColor="#f4dfb6" />
    </linearGradient>
    <radialGradient id="minimalCenterGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#fffef8" />
      <stop offset="22%" stopColor="#fff0bd" stopOpacity="0.95" />
      <stop offset="58%" stopColor="#d8a64a" stopOpacity="0.2" />
      <stop offset="100%" stopColor="#d8a64a" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="crossHorizontal" x1="0%" x2="100%">
      <stop offset="0%" stopColor="#fff3c4" stopOpacity="0" />
      <stop offset="42%" stopColor="#ffe59b" stopOpacity="0.72" />
      <stop offset="50%" stopColor="#fffdf4" stopOpacity="1" />
      <stop offset="58%" stopColor="#ffe59b" stopOpacity="0.72" />
      <stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="crossVertical" x1="0%" x2="0%" y1="0%" y2="100%">
      <stop offset="0%" stopColor="#fff3c4" stopOpacity="0" />
      <stop offset="42%" stopColor="#ffe59b" stopOpacity="0.72" />
      <stop offset="50%" stopColor="#fffdf4" stopOpacity="1" />
      <stop offset="58%" stopColor="#ffe59b" stopOpacity="0.72" />
      <stop offset="100%" stopColor="#fff3c4" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="minimalField" cx="50%" cy="50%" r="58%">
      <stop offset="0%" stopColor="#fff8df" stopOpacity="0.26" />
      <stop offset="48%" stopColor="#f8ead2" stopOpacity="0.12" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
    </radialGradient>
    <filter id="minimalBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
  </defs>

  <rect x="0" y="0" width={compact ? "480" : "640"} height="480" rx="36" fill="url(#structureWarmBg)" opacity="0.95" />
  <rect x="0" y="0" width={compact ? "480" : "640"} height="480" rx="36" fill="url(#minimalField)" opacity="0.62" />
  <circle cx={centerX} cy={centerY} r={134 + resistance * 8} fill="url(#minimalCenterGlow)" opacity={0.2 + normalized * 0.18} filter="url(#minimalBlur)" />

  <g className="structure-orbit-system" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
    <g className="structure-orbit-layer body-orbit-layer">
      <ellipse className="structure-orbit-glow body-orbit" cx={centerX} cy={centerY} rx="188" ry="54" strokeWidth={bodyStyle.width + 4} opacity={bodyStyle.glowOpacity} />
      <ellipse className="structure-orbit body-orbit" cx={centerX} cy={centerY} rx="188" ry="54" strokeWidth={bodyStyle.width} opacity={bodyStyle.opacity} />
    </g>
    <g className="structure-orbit-layer spirit-orbit-layer" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
      <ellipse className="structure-orbit-glow spirit-orbit" cx={centerX} cy={centerY} rx="74" ry="176" strokeWidth={spiritStyle.width + 4} opacity={spiritStyle.glowOpacity} />
      <ellipse className="structure-orbit spirit-orbit" cx={centerX} cy={centerY} rx="74" ry="176" strokeWidth={spiritStyle.width} opacity={spiritStyle.opacity} />
    </g>
    <g className="structure-orbit-layer soul-orbit-layer" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
      <ellipse className="structure-orbit-glow soul-orbit" cx={centerX} cy={centerY} rx="78" ry="174" strokeWidth={soulStyle.width + 4} opacity={soulStyle.glowOpacity} />
      <ellipse className="structure-orbit soul-orbit" cx={centerX} cy={centerY} rx="78" ry="174" strokeWidth={soulStyle.width} opacity={soulStyle.opacity} />
    </g>
    <g className="structure-node-track body-node-track" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
      <circle className="structure-node body-node" cx={centerX + 188} cy={centerY} r="8.5" />
    </g>
    <g className="structure-node-track spirit-node-track" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
      <circle className="structure-node spirit-node" cx={centerX} cy={centerY - 176} r="9" />
    </g>
    <g className="structure-node-track soul-node-track" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
      <circle className="structure-node soul-node" cx={centerX} cy={centerY - 174} r="9" />
    </g>
  </g>

  <g className="cross-of-light">
    <rect className="beam-halo" x={centerX - 196} y={centerY - 12} width="392" height="24" rx="12" fill="url(#crossHorizontal)" />
    <rect className="beam-halo" x={centerX - 12} y={centerY - 196} width="24" height="392" rx="12" fill="url(#crossVertical)" />
    <rect className="axis-energy" x={centerX - 178} y={centerY - 2.5} width="356" height="5" rx="2.5" fill="url(#crossHorizontal)" />
    <rect className="axis-energy vertical" x={centerX - 2.5} y={centerY - 178} width="5" height="356" rx="2.5" fill="url(#crossVertical)" />
    <rect className="beam-core" x={centerX - 118} y={centerY - 4} width="236" height="8" rx="4" fill="#fff8df" />
    <rect className="beam-core" x={centerX - 4} y={centerY - 118} width="8" height="236" rx="4" fill="#fff8df" />
  </g>

  <g className="light-streams">
    <circle className="light-particle particle-right" cx={centerX + 18} cy={centerY} r="2.8" fill="#fff1b6" />
    <circle className="light-particle particle-left" cx={centerX - 18} cy={centerY} r="2.4" fill="#fff1b6" />
    <circle className="light-particle particle-up" cx={centerX} cy={centerY - 18} r="2.5" fill="#fff1b6" />
    <circle className="light-particle particle-down" cx={centerX} cy={centerY + 18} r="2.2" fill="#fff1b6" />
  </g>

  <circle cx={centerX} cy={centerY} r={42 + normalized * 12} fill="url(#minimalCenterGlow)" opacity={centerStrength * 0.62} filter="url(#minimalBlur)" />
  <circle className="cross-source" cx={centerX} cy={centerY} r={16 + normalized * 5} fill="#fffdf6" opacity={0.9 + normalized * 0.08} />
  <circle cx={centerX} cy={centerY} r={5 + normalized * 2} fill="#d4a84f" opacity={0.78 + normalized * 0.18} />
</svg>
    </section>
  );
}

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 72 72" role="img" aria-label="Etytomic Alignment symbol">
      <defs>
        <radialGradient id="logoLight" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fffef7" />
          <stop offset="34%" stopColor="#edd08c" stopOpacity="0.38" />
          <stop offset="100%" stopColor="#c98521" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle className="logo-light-field" cx="36" cy="36" r="22" fill="url(#logoLight)" />
      <ellipse className="logo-orbit logo-orbit-body" cx="36" cy="36" rx="25" ry="7.5" />
      <ellipse className="logo-orbit logo-orbit-spirit" cx="36" cy="36" rx="9.5" ry="27" transform="rotate(-35 36 36)" />
      <ellipse className="logo-orbit logo-orbit-soul" cx="36" cy="36" rx="9.5" ry="27" transform="rotate(35 36 36)" />
      <g className="logo-cross">
        <path d="M36 27.5v17" />
        <path d="M27.5 36h17" />
      </g>
      <circle className="logo-center" cx="36" cy="36" r="2.45" />
    </svg>
  );
}

function Header({ page, setPage, user, onLogout }) {
  const nav = [
    ["about", "About"],
    ["assessment", "Alignment Assessment"],
    ["results", "Results"],
    ["checkin", "Check-In"],
  ];
  const displayName = user?.user_metadata?.display_name || user?.user_metadata?.username || user?.email;

  return (
    <header className="app-header sticky top-0 z-20">
      <div className="app-header-inner mx-auto flex w-full max-w-[1100px] flex-col gap-4 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
<button className="brand-lockup group flex items-center gap-3 text-left" onClick={() => setPage("about")}>
  <span className="brand-mark" aria-hidden="true">
    <LogoMark />
  </span>
  <div>
    <div className="brand-title serif">Etytomic Alignment</div>
    <div className="brand-subtitle">Alignment in practice</div>
  </div>
</button>
<div className="flex flex-col gap-3 lg:items-end">
  <nav className="app-nav flex flex-wrap">
    {nav.map(([key, label]) => (
      <button
        key={key}
        onClick={() => setPage(key)}
        className={`app-nav-item ${page === key ? "is-active" : ""}`}
      >
        {label}
      </button>
    ))}
  </nav>
  <div className="flex flex-wrap items-center gap-3 text-sm">
    <span className="user-pill">{displayName}</span>
    <button
      onClick={onLogout}
      className="logout-button"
    >
      Log Out
    </button>
  </div>
</div>
      </div>
    </header>
  );
}

const legalPages = {
  terms: {
    title: "Terms of Use",
    intro: [
"Welcome to Etytomic Alignment.",
"By using this application, you agree to the following terms.",
    ],
    sections: [
{
  title: "1. Purpose of the App",
  body: "This app is designed as a personal reflection and alignment tool. It is not intended to provide medical, psychological, or professional advice.",
},
{
  title: "2. User Responsibility",
  body: "You are responsible for how you interpret and use the information provided. The app is a guide for reflection, not a definitive measure of your identity, worth, or condition.",
},
{
  title: "3. No Guarantees",
  body: "We make no guarantees regarding outcomes, results, or personal changes from using this app.",
},
{
  title: "4. Limitation of Liability",
  body: "The app and its creator are not responsible for any decisions, actions, or outcomes resulting from use of this tool.",
},
{
  title: "5. Acceptable Use",
  body: "You agree not to misuse the app, attempt to disrupt functionality, or use it in a harmful or unlawful way.",
},
{
  title: "6. Changes",
  body: "These terms may be updated as the app evolves.",
},
    ],
    closing: "By continuing to use the app, you agree to these terms.",
  },
  privacy: {
    title: "Privacy Policy",
    intro: ["Your privacy is important.", "This app collects only the information necessary to provide the alignment tracking experience."],
    sections: [
{
  title: "1. Information Collected",
  body: "We may collect:",
  list: ["account information (email/login if used)", "assessment responses", "alignment scores and history"],
},
{
  title: "2. How Information Is Used",
  body: "Your data is used to:",
  list: ["calculate your results", "track your progress over time", "improve your experience"],
},
{
  title: "3. Data Storage",
  body: "Your data is stored securely using backend services (such as Supabase). We do not sell or share your data with third parties.",
},
{
  title: "4. User Control",
  body: "You may request deletion of your data by clearing your history within the app.",
},
{
  title: "5. Security",
  body: "We take reasonable measures to protect your data, but no system is completely secure.",
},
{
  title: "6. Changes",
  body: "This policy may be updated as features evolve.",
},
    ],
    closing: "By using the app, you agree to this policy.",
  },
  disclaimer: {
    title: "Disclaimer",
    intro: ["This app is a reflection and growth tool.", "It is not:"],
    list: ["medical advice", "psychological counseling", "therapy", "a diagnosis of any condition"],
    sections: [
{ body: "Results are based entirely on your responses and are intended for personal insight only." },
{ body: "This tool is meant to guide awareness, not define identity." },
{ body: "You are responsible for how you interpret and apply the information." },
{ body: "If you need professional support, seek guidance from a qualified professional." },
    ],
  },
};

function LegalPage({ type }) {
  const page = legalPages[type];
  return (
    <main className="mx-auto max-w-4xl px-5 pb-12 pt-4 sm:px-8">
<section className="glass-panel rounded-md p-6 sm:p-8">
  <h1 className="serif text-3xl font-semibold text-[#302a21] sm:text-4xl">{page.title}</h1>
  <div className="mt-6 space-y-4 text-base leading-8 text-[#5c513f]">
    {page.intro?.map((line) => <p key={line}>{line}</p>)}
    {page.list && (
      <ul className="list-disc space-y-2 pl-5">
        {page.list.map((item) => <li key={item}>{item}</li>)}
      </ul>
    )}
    {page.sections.map((section, index) => (
      <div key={section.title || index} className="pt-2">
        {section.title && <h2 className="text-base font-semibold text-[#3c3428]">{section.title}</h2>}
        {section.body && <p className={section.title ? "mt-1" : ""}>{section.body}</p>}
        {section.list && (
          <ul className="mt-2 list-disc space-y-2 pl-5">
            {section.list.map((item) => <li key={item}>{item}</li>)}
          </ul>
        )}
      </div>
    ))}
    {page.closing && <p>{page.closing}</p>}
  </div>
</section>
    </main>
  );
}

function Footer({ setPage }) {
  const links = [
    ["terms", "Terms of Use"],
    ["privacy", "Privacy Policy"],
    ["disclaimer", "Disclaimer"],
  ];

  return (
    <footer className="mx-auto w-full max-w-6xl px-5 pb-8 pt-2 sm:px-8">
<div className="flex flex-wrap gap-4 border-t border-[#d9c8a8] pt-5 text-sm text-[#6c5d46]">
  {links.map(([key, label]) => (
    <button key={key} onClick={() => setPage(key)} className="font-medium hover:text-[#9f7026]">
      {label}
    </button>
  ))}
</div>
    </footer>
  );
}

function SignUpAgreement({ setPage }) {
  return (
    <p className="text-xs leading-5 text-[#6c604d]">
By creating an account, you agree to our{" "}
<button onClick={() => setPage("terms")} className="font-semibold text-[#8d621d] underline">
  Terms of Use
</button>{" "}
and{" "}
<button onClick={() => setPage("privacy")} className="font-semibold text-[#8d621d] underline">
  Privacy Policy
</button>
.
    </p>
  );
}

function WelcomePage({ setPage, onAuthSuccess }) {
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState("");
  const [loadingAction, setLoadingAction] = useState("");
  const [accountCreated, setAccountCreated] = useState(false);
  const authReady = Boolean(supabase);

  async function handleCreateAccount(event) {
    event.preventDefault();
    setError("");
    setAccountCreated(false);

    if (!authReady) {
      setError("Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.");
      return;
    }

    setLoadingAction("create");
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: createEmail,
      password: createPassword,
      options: {
        data: {
          display_name: displayName.trim() || createEmail,
          username: displayName.trim() || createEmail,
        },
      },
    });
    setLoadingAction("");

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      await supabase.auth.signOut();
    }

    setAccountCreated(true);
    setLoginEmail(createEmail);
    setCreatePassword("");
  }

  async function handleLogin(event) {
    event.preventDefault();
    setError("");

    if (!authReady) {
      setError("Supabase is not configured yet. Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.local.");
      return;
    }

    setLoadingAction("login");
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPassword,
    });
    setLoadingAction("");

    if (loginError) {
      setError(loginError.message);
      return;
    }

    onAuthSuccess(data.user);
  }

  const inputClass =
    "mt-2 w-full rounded-md border border-[#d7cab2] bg-white/80 px-3 py-2 text-sm text-[#3c3428] shadow-sm outline-none transition focus:border-[#b8832d] focus:ring-2 focus:ring-[#ead8b3]";

  return (
    <main className="mx-auto max-w-6xl px-5 pb-12 pt-8 sm:px-8">
      <section className="glass-panel rounded-md p-6 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="eyebrow mb-4">Welcome</p>
            <h1 className="serif text-4xl font-semibold tracking-normal text-[#2f2a21] sm:text-5xl">
              Etytomic Alignment
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#5c513f]">
              Create an account or log in to take the assessment, save your results, and return for monthly check-ins over time.
            </p>
            <div className="soft-panel mt-8 rounded-md p-5 text-sm leading-7 text-[#6c604d]">
              <p>This is a personal reflection tool for noticing alignment, resistance, and growth across spirit, soul, and body.</p>
              <p className="mt-3">Your account keeps your results connected to you as the app grows beyond this prototype.</p>
            </div>
          </div>

          <div className="space-y-6">
            {accountCreated && (
              <div className="rounded-md border border-[#c99b45] bg-[#fff9ed] p-6 shadow-sm">
                <p className="eyebrow mb-3">Confirmation sent</p>
                <h2 className="serif text-3xl font-semibold text-[#302a21]">Account created!</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[#5c513f]">
                  <p>Please check your email to confirm your account before logging in.</p>
                  <p>
                    We sent a confirmation link to the email address you entered. After you confirm,
                    return here and log in.
                  </p>
                </div>
              </div>
            )}

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <form onSubmit={handleCreateAccount} className="soft-panel rounded-md p-5">
              <h2 className="serif text-2xl font-semibold text-[#302a21]">Create Account</h2>
              <label className="mt-5 block text-sm font-semibold text-[#3c3428]">
                Email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={createEmail}
                  onChange={(event) => setCreateEmail(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="mt-4 block text-sm font-semibold text-[#3c3428]">
                Password
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={createPassword}
                  onChange={(event) => setCreatePassword(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="mt-4 block text-sm font-semibold text-[#3c3428]">
                Display name <span className="font-normal text-[#7b6b50]">(optional)</span>
                <input
                  type="text"
                  autoComplete="nickname"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                disabled={loadingAction === "create"}
                className="gold-button mt-5 w-full rounded-md px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingAction === "create" ? "Creating..." : "Create Account"}
              </button>
              <div className="mt-4">
                <SignUpAgreement setPage={setPage} />
              </div>
            </form>

            <form onSubmit={handleLogin} className="soft-panel rounded-md p-5">
              <h2 className="serif text-2xl font-semibold text-[#302a21]">Log In</h2>
              <label className="mt-5 block text-sm font-semibold text-[#3c3428]">
                Email
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  className={inputClass}
                />
              </label>
              <label className="mt-4 block text-sm font-semibold text-[#3c3428]">
                Password
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  className={inputClass}
                />
              </label>
              <button
                type="submit"
                disabled={loadingAction === "login"}
                className="gold-button mt-5 w-full rounded-md px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loadingAction === "login" ? "Logging in..." : "Log In"}
              </button>
            </form>
            </div>
          </div>
        </div>

        {error && (
          <div className={`mt-6 rounded-md border p-4 text-sm leading-6 ${error ? "border-[#d8a6a1] bg-[#fff6f4] text-[#8a3d34]" : "border-[#d9c8a8] bg-white/65 text-[#5c513f]"}`}>
            {error}
          </div>
        )}
      </section>
    </main>
  );
}

function AboutPage({ setPage }) {
  const overviewCards = [
    {
      title: "What is Etytomic Alignment",
      body: "A God-centered model for noticing alignment and resistance across spirit, soul, and body.",
      note: "God is the center — the source of truth, light, order, and life.",
    },
    {
      title: "How it works",
      body: "You answer 44 reflection questions. The app calculates Spirit, Soul, Body, total alignment, and resistance.",
      note: "Spirit 50%, Soul 30%, Body 20%.",
    },
    {
      title: "What you’ll gain",
      body: "A clear snapshot of your strongest area, growth area, next step, and monthly check-in rhythm.",
      note: "This measures alignment, not perfection.",
    },
  ];

  const dimensions = [
    ["Spirit", "Connection to God", "Prayer, Scripture, conviction, righteousness, surrender."],
    ["Soul", "Inner life", "Thoughts, emotions, identity, humility, relationships."],
    ["Body", "Outward action", "Health, discipline, self-control, habits, follow-through."],
  ];

  return (
    <main className="page-shell">
      <section className="page-hero glass-panel rounded-md p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-center">
          <div>
            <p className="eyebrow mb-4">About</p>
            <h1 className="serif max-w-3xl text-4xl font-semibold tracking-normal text-[#2f2a21] sm:text-5xl">
              Alignment begins at the center.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6a5b45]">
              Spirit, soul, and body ordered around God.
            </p>
          </div>
          <div className="soft-panel rounded-md p-5 text-sm leading-6 text-[#6c604d]">
            <p className="font-semibold text-[#302a21]">Acts 17:28</p>
            <p className="mt-2">“In Him we live and move and have our being.”</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => setPage("assessment")} className="gold-button rounded-md px-5 py-3 text-sm font-semibold text-white">
            Begin Assessment
          </button>
          <button onClick={() => setPage("checkin")} className="rounded-md border border-[#d6c8ad] bg-white/70 px-5 py-3 text-sm font-semibold text-[#705a34] shadow-sm hover:bg-white">
            Check-In Rhythm
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {overviewCards.map((card) => (
          <article key={card.title} className="soft-panel rounded-md p-5 transition hover:-translate-y-0.5">
            <h2 className="serif text-xl font-semibold text-[#302a21]">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#5c513f]">{card.body}</p>
            <p className="mt-4 rounded-md bg-white/55 p-3 text-xs font-semibold leading-5 text-[#8d621d]">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-md p-5 sm:p-6">
          <p className="eyebrow mb-3">Structure</p>
          <h2 className="serif text-2xl font-semibold text-[#302a21]">Spirit, soul, body</h2>
          <div className="mt-5 grid gap-3">
            {dimensions.map(([name, title, body]) => (
              <div key={name} className="soft-panel rounded-md p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-[#302a21]">{name}</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9f7026]">{title}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#5c513f]">{body}</p>
              </div>
            ))}
          </div>
        </div>
        <section className="glass-panel rounded-md p-5">
          <p className="eyebrow mb-3 text-center">Etytomic Structure</p>
          <EtytomicVisual scores={{ spirit: 8, soul: 8, body: 8, total: 8 }} compact />
        </section>
      </section>
    </main>
  );
}

function ScoreButtons({ value, onChange }) {
  return (
    <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
{Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
  <button
    key={score}
    onClick={() => onChange(score)}
    className={`h-10 rounded-md border text-sm font-semibold transition ${
      value === score
        ? "border-[#9f7026] bg-[#9f7026] text-white shadow-md shadow-[#9f7026]/20"
        : "border-[#d9ccb5] bg-white/75 text-[#665842] shadow-sm hover:border-[#b98735] hover:bg-[#fffaf0]"
    }`}
  >
    {score}
  </button>
))}
    </div>
  );
}

function AssessmentPage({ answers, setAnswers, setPage, assessmentComplete, setAssessmentComplete, onCompleteAssessment }) {
  const [hasStarted, setHasStarted] = useState(Object.keys(answers).length > 0);
  const firstIncompleteSection = sections.findIndex((section, sectionIndex) =>
    !section.questions.every((_, questionIndex) => answers[`${sectionIndex}-${questionIndex}`])
  );
  const [sectionIndex, setSectionIndex] = useState(firstIncompleteSection >= 0 ? firstIncompleteSection : 0);
  const section = sections[sectionIndex];
  const sectionQuestionIds = section.questions.map((_, index) => `${sectionIndex}-${index}`);
  const completeInSection = sectionQuestionIds.filter((id) => answers[id]).length;
  const answeredCount = Object.keys(answers).length;
  const completedSections = sections.filter((item, itemIndex) =>
    item.questions.every((_, questionIndex) => answers[`${itemIndex}-${questionIndex}`])
  ).length;
  const sectionProgress = (completedSections / sections.length) * 100;
  const canContinue = completeInSection === section.questions.length;
  const isLast = sectionIndex === sections.length - 1;
  const allSectionsComplete = completedSections === sections.length;

  function updateAnswer(questionIndex, value) {
    if (assessmentComplete) return;
    setAnswers((existing) => ({ ...existing, [`${sectionIndex}-${questionIndex}`]: value }));
  }

  function goNext() {
    if (!canContinue) return;
    if (isLast) {
      if (!allSectionsComplete) return;
      setAssessmentComplete(true);
      onCompleteAssessment();
      setPage("results");
      return;
    }
    setSectionIndex((index) => Math.min(index + 1, sections.length - 1));
  }

  function goBack() {
    setSectionIndex((index) => Math.max(index - 1, 0));
  }

  if (assessmentComplete) {
    return (
      <main className="page-shell">
        <section className="glass-panel rounded-md p-6 sm:p-8">
          <p className="eyebrow mb-4">Assessment</p>
          <h1 className="serif text-4xl font-semibold text-[#302a21] sm:text-5xl">Assessment complete.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5c513f]">Your answers are locked and your full results are ready.</p>
          <button onClick={() => setPage("results")} className="gold-button mt-8 rounded-md px-5 py-3 text-sm font-semibold text-white">
            View Full Results
          </button>
        </section>
      </main>
    );
  }

  if (!hasStarted) {
    return (
      <main className="page-shell">
        <section className="glass-panel rounded-md p-6 sm:p-8">
          <p className="eyebrow mb-4">Etytomic Alignment Assessment</p>
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <h1 className="serif text-4xl font-semibold text-[#302a21] sm:text-5xl">Before you begin</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#5c513f]">
                This is a reflection tool for noticing alignment and resistance. Answer honestly based on where you are today.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                "Not a measure of worth or standing.",
                "Not a final judgment, diagnosis, or label.",
                "Not a replacement for guidance, counseling, or support.",
                "Growth begins with clarity.",
              ].map((line) => (
                <div key={line} className="soft-panel rounded-md p-4 text-sm font-medium leading-6 text-[#5c513f]">{line}</div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setHasStarted(true)} className="gold-button rounded-md px-5 py-3 text-sm font-semibold text-white">
              Start Alignment Assessment
            </button>
            <button onClick={() => setPage("about")} className="rounded-md border border-[#d7cab2] bg-white/70 px-5 py-3 text-sm font-semibold text-[#705f42] shadow-sm">
              Review Foundation
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="glass-panel rounded-md p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-4 text-sm text-[#76684f]">
          <span>Section {sectionIndex + 1} of {sections.length}</span>
          <span>{answeredCount} of {allQuestions.length} scored</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#e6dac3]">
          <div className="h-full rounded-full bg-[#b9832b] transition-all duration-500" style={{ width: `${sectionProgress}%` }} />
        </div>
        <div className="mt-3 text-xs text-[#8a7a5f]">
          {allSectionsComplete ? "Assessment complete" : `${completedSections} of ${sections.length} sections completed`}
        </div>
      </section>

      <section key={sectionIndex} className="assessment-section glass-panel mt-6 rounded-md p-6 sm:p-8">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#9f7026]">
              <span>{section.domain}</span>
              <span>•</span>
              <span>{domainMeta[section.key].weight}</span>
            </div>
            <h1 className="serif mt-3 text-3xl font-semibold leading-tight text-[#302a21] sm:text-4xl">{section.theme}</h1>
            <p className="mt-3 text-sm leading-6 text-[#6c604d]">Score each statement from 1 to 10 before continuing.</p>
          </div>
          <div className="soft-panel rounded-md px-4 py-3 text-sm font-semibold text-[#705f42]">
            {completeInSection} of {section.questions.length} answered
          </div>
        </div>

        <div className="grid gap-5">
          {section.questions.map((question, questionIndex) => {
            const id = `${sectionIndex}-${questionIndex}`;
            return (
              <div key={id} className="soft-panel rounded-md p-4 sm:p-5">
                <div className="mb-4 flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fff4d5] text-sm font-semibold text-[#9f7026] shadow-sm">
                    {questionIndex + 1}
                  </span>
                  <p className="text-base font-medium leading-7 text-[#3d3528]">{question}</p>
                </div>
                <ScoreButtons value={answers[id]} onChange={(value) => updateAnswer(questionIndex, value)} />
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={goBack} disabled={sectionIndex === 0} className="rounded-md border border-[#d7cab2] bg-white/70 px-5 py-3 text-sm font-semibold text-[#705f42] shadow-sm disabled:cursor-not-allowed disabled:opacity-40">
            Back
          </button>
          {canContinue ? (
            <button onClick={goNext} className="gold-button rounded-md px-6 py-3 text-sm font-semibold text-white">
              {isLast ? "View Full Results" : "Continue"}
            </button>
          ) : (
            <div className="rounded-md border border-[#e1d6c0] bg-white/60 px-4 py-3 text-sm font-medium text-[#7b6c54]">
              Answer all questions in this section to continue.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function ResultMetric({ label, value, detail }) {
  return (
    <div className="soft-panel rounded-md p-4">
<div className="flex items-baseline justify-between gap-3">
  <div className="text-sm font-semibold text-[#3c3428]">{label}</div>
  <div className="text-2xl font-semibold tabular-nums text-[#8d621d]">{value.toFixed(1)}</div>
</div>
<div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eadfca]">
  <div className="h-full rounded-full bg-[#b9832b]" style={{ width: `${value * 10}%` }} />
</div>
<div className="mt-3 text-xs leading-5 text-[#6c604d]">{detail}</div>
<div className="mt-1 text-xs font-medium text-[#7e6d52]">Resistance {(10 - value).toFixed(1)}</div>
    </div>
  );
}

function CategoryOverviewCard({ name, value, detail }) {
  return (
    <div className="soft-panel rounded-md p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="serif text-xl font-semibold text-[#302a21]">{name}</h3>
          <p className="mt-1 text-xs leading-5 text-[#6c604d]">{detail}</p>
        </div>
        <div className="text-3xl font-semibold tabular-nums text-[#8d621d]">{formatScore(value)}</div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#eadfca]">
        <div className="h-full rounded-full bg-[#b9832b]" style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}

function SubcategoryResults({ results }) {
  return (
    <section className="glass-panel rounded-md p-5 sm:p-6">
<h2 className="serif text-2xl font-semibold text-[#302a21]">Where Growth Is Needed Most</h2>
<p className="mt-3 text-sm leading-6 text-[#6c604d]">
  These sub-scores show which areas are creating the most alignment and where resistance may be strongest.
</p>

<div className="mt-5 grid gap-4">
  {results.groups.map((group) => (
    <div key={group.domain} className="soft-panel rounded-md p-4">
      <h3 className="border-b border-[#eadfcb] pb-3 text-base font-semibold text-[#3c3428]">
        <span>{group.domain} (Avg: {formatScore(group.score)})</span>
      </h3>
      <div className="mt-3 grid gap-3">
        {group.items.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[#5c513f]">{item.name}</span>
              <span className="font-semibold tabular-nums text-[#8d621d]">{formatScore(item.score)}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#eadfca]">
              <div className="h-full rounded-full bg-[#b9832b]" style={{ width: `${item.score * 10}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

<div className="mt-5 rounded-md border border-[#eadfcb] bg-white/60 p-4 text-sm leading-6 text-[#5c513f]">
  <p>
    Your strongest area right now: <span className="font-semibold text-[#3c3428]">{results.highest.name}</span>
  </p>
  <p className="mt-2">
    Your greatest growth area right now: <span className="font-semibold text-[#3c3428]">{results.lowest.name}</span>
  </p>
  <p className="mt-3 text-[#6c604d]">This area may be affecting clarity, stability, or alignment.</p>
</div>
    </section>
  );
}

function formatScore(value) {
  return value.toFixed(1);
}

function formatChange(value) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}`;
}

function trendLabel(value) {
  if (value > 0) return "↑ Improving";
  if (value < 0) return "↓ Declining";
  return "→ Steady";
}

function calculateCheckInStreak(history) {
  if (!history.length) return 0;
  let streak = 1;
  for (let index = history.length - 1; index > 0; index -= 1) {
    const currentDate = new Date(history[index].dateCompleted || history[index].timestamp);
    const previousDate = new Date(history[index - 1].dateCompleted || history[index - 1].timestamp);
    if (daysBetween(previousDate, currentDate) <= 45) {
streak += 1;
    } else {
break;
    }
  }
  return streak;
}

function formatDisplayDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function daysBetween(start, end) {
  const dayInMs = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.floor((end - start) / dayInMs));
}

function ProgressOverTime({ history, onClearHistory, onStartNewCheckIn }) {
  const current = history[history.length - 1];
  const previous = history[history.length - 2];
  const first = history[0];
  const currentTotal = current?.overallScore ?? current?.total ?? 0;
  const previousTotal = previous ? previous.overallScore ?? previous.total : 0;
  const firstTotal = first?.overallScore ?? first?.total ?? 0;
  const completedDate = current ? new Date(current.dateCompleted) : null;
  const nextCheckInDate = completedDate ? addDays(completedDate, 30) : null;
  const daysSinceLastCheckIn = completedDate ? daysBetween(completedDate, new Date()) : 0;
  const checkInStreak = calculateCheckInStreak(history);
  const returnMessage =
    daysSinceLastCheckIn >= 30
? "It may be time for another check-in. Retake the assessment to see what has changed."
: "Your next check-in is not about pressure. Use this time to practice your next step and notice what changes.";

  let trendInsight = "";
  let identityProgressLanguage = "";
  let mostImproved = null;
  let largestDecline = null;
  const categoryChanges = previous
    ? ["spirit", "soul", "body"].map((category) => ({
  category,
  label: domainMeta[category].label,
  previous: previous[`${category}Avg`] ?? previous[category],
  current: current[`${category}Avg`] ?? current[category],
  change: (current[`${category}Avg`] ?? current[category]) - (previous[`${category}Avg`] ?? previous[category]),
}))
    : [];

  if (previous) {
    const totalChange = currentTotal - previousTotal;
    if (totalChange > 0) {
trendInsight = "You are moving toward greater alignment. Stay consistent.";
identityProgressLanguage = "You are moving toward greater alignment.";
    } else if (totalChange < 0) {
trendInsight = "Something may be pulling you off center. Return to your focus area and begin again with one faithful step.";
identityProgressLanguage = "This does not define you. It shows where to return your attention.";
    } else {
trendInsight = "Your alignment is holding steady. Growth may require more intentional action in your focus area.";
identityProgressLanguage = "Steady scores can still reflect hidden growth. Continue practicing with intention.";
    }
    mostImproved = categoryChanges.reduce((best, item) => (item.change > best.change ? item : best), categoryChanges[0]);
    largestDecline = categoryChanges.reduce((lowest, item) => (item.change < lowest.change ? item : lowest), categoryChanges[0]);
  }

  return (
    <section className="glass-panel mt-6 rounded-md p-5 sm:p-6">
<div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
  <div>
    <h2 className="serif text-2xl font-semibold text-[#302a21]">Your Progress Over Time</h2>
    {current && (
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-md border border-[#eadfcb] bg-white/60 p-4 text-[#5c513f]">
          Next suggested check-in: <span className="font-semibold text-[#8d621d]">{formatDisplayDate(nextCheckInDate)}</span>
        </div>
        <div className="rounded-md border border-[#eadfcb] bg-white/60 p-4 text-[#5c513f]">
          Days since last check-in: <span className="font-semibold text-[#8d621d]">{daysSinceLastCheckIn}</span>
        </div>
      </div>
    )}
    <p className="mt-4 text-base leading-8 text-[#5c513f]">{returnMessage}</p>
    {history.length <= 1 ? (
      <div className="mt-3 space-y-3 text-base leading-8 text-[#5c513f]">
        <p>This is your starting point.</p>
        <p>Return in 30 days to complete another check-in and see how your alignment changes over time.</p>
      </div>
    ) : (
      <div className="mt-4 space-y-5">
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <div className="soft-panel rounded-md p-4">
            <div className="font-semibold text-[#3c3428]">First check-in</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-[#8d621d]">{formatScore(firstTotal)}</div>
          </div>
          <div className="soft-panel rounded-md p-4">
            <div className="font-semibold text-[#3c3428]">Previous check-in</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-[#8d621d]">{formatScore(previousTotal)}</div>
          </div>
          <div className="soft-panel rounded-md p-4">
            <div className="font-semibold text-[#3c3428]">Current check-in</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-[#8d621d]">{formatScore(currentTotal)}</div>
          </div>
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-md border border-[#eadfcb] bg-white/60 p-4 text-[#5c513f]">
            Change since last check-in: <span className="font-semibold text-[#8d621d]">{formatChange(currentTotal - previousTotal)}</span>
            <span className="ml-2 text-[#7b6b50]">{trendLabel(currentTotal - previousTotal)}</span>
          </div>
          <div className="rounded-md border border-[#eadfcb] bg-white/60 p-4 text-[#5c513f]">
            Change since first check-in: <span className="font-semibold text-[#8d621d]">{formatChange(currentTotal - firstTotal)}</span>
            <span className="ml-2 text-[#7b6b50]">{trendLabel(currentTotal - firstTotal)}</span>
          </div>
        </div>
        <p className="text-base leading-8 text-[#5c513f]">{identityProgressLanguage}</p>
        <p className="text-base leading-8 text-[#5c513f]">{trendInsight}</p>
        <div className="rounded-md border border-[#eadfcb] bg-white/60 p-4">
          <div className="text-sm font-semibold text-[#3c3428]">Category trend</div>
          <div className="mt-3 grid gap-2 text-sm text-[#5c513f]">
            {categoryChanges.map((item) => (
              <div key={item.category} className="flex justify-between gap-4">
                <span>{item.label}</span>
                <span className="tabular-nums">{formatScore(item.previous)} to {formatScore(item.current)}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-[#6c604d]">
            {mostImproved && mostImproved.change > 0
              ? `Most improved area: ${mostImproved.label} (${formatChange(mostImproved.change)})`
              : "No area increased since your last check-in. Choose one small step and return to it consistently."}
          </p>
          {largestDecline && largestDecline.change < 0 && (
            <p className="mt-2 text-sm leading-6 text-[#6c604d]">
              Largest decline: {largestDecline.label} ({formatChange(largestDecline.change)})
            </p>
          )}
        </div>
      </div>
    )}
    <div className="mt-5 space-y-3 text-sm leading-6 text-[#6c604d]">
      <p>Check-in streak: {checkInStreak} {checkInStreak === 1 ? "month" : "months"}</p>
      <p>This does not define you. It shows where to return your attention.</p>
      <p>Something may be pulling you off center. Return to your focus area and begin again with one faithful step.</p>
    </div>
  </div>
  <div className="flex shrink-0 flex-col gap-2">
    <button
      onClick={onStartNewCheckIn}
      className="gold-button rounded-md px-4 py-2 text-sm font-semibold text-white"
    >
      Start New Check-In
    </button>
    <button
      onClick={onClearHistory}
      className="rounded-md border border-[#d7cab2] bg-white/70 px-4 py-2 text-sm font-semibold text-[#705f42] shadow-sm"
    >
      Clear History
    </button>
  </div>
</div>
    </section>
  );
}

function CheckInPage({ history, onStartNewCheckIn }) {
  const latest = history[history.length - 1];
  const completedDate = latest ? new Date(latest.dateCompleted) : null;
  const nextCheckInDate = completedDate ? addDays(completedDate, 30) : null;
  const daysSinceLastCheckIn = completedDate ? daysBetween(completedDate, new Date()) : 0;
  const returnMessage =
    daysSinceLastCheckIn >= 30
      ? "It may be time for another check-in. Retake the assessment to see what has changed."
      : "Use this time to practice your next step and notice what changes.";
  const recentHistory = [...history].reverse();

  return (
    <main className="page-shell">
      <section className="glass-panel rounded-md p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow mb-4">Check-In</p>
            <h1 className="serif text-4xl font-semibold text-[#302a21] sm:text-5xl">
              {latest ? "Your next check-in" : "Start your first check-in"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#5c513f]">
              {latest
                ? returnMessage
                : "Create your starting point and begin noticing alignment, resistance, and growth over time."}
            </p>
          </div>
          <button onClick={onStartNewCheckIn} className="gold-button rounded-md px-5 py-3 text-sm font-semibold text-white">
            {latest ? "New Check-In" : "Start Assessment"}
          </button>
        </div>
      </section>

      {latest && (
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="soft-panel rounded-md p-4">
            <div className="text-sm font-semibold text-[#3c3428]">Last check-in</div>
            <div className="mt-2 text-base text-[#5c513f]">{formatDisplayDate(completedDate)}</div>
          </div>
          <div className="soft-panel rounded-md p-4">
            <div className="text-sm font-semibold text-[#3c3428]">Last score</div>
            <div className="mt-1 text-3xl font-semibold tabular-nums text-[#8d621d]">{formatScore(latest.total)}</div>
          </div>
          <div className="soft-panel rounded-md p-4">
            <div className="text-sm font-semibold text-[#3c3428]">Next suggested</div>
            <div className="mt-2 text-base text-[#5c513f]">{formatDisplayDate(nextCheckInDate)}</div>
          </div>
          <div className="soft-panel rounded-md p-4">
            <div className="text-sm font-semibold text-[#3c3428]">Days since</div>
            <div className="mt-1 text-3xl font-semibold tabular-nums text-[#8d621d]">{daysSinceLastCheckIn}</div>
          </div>
        </section>
      )}

      <section className="glass-panel mt-6 rounded-md p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="serif text-2xl font-semibold text-[#302a21]">Check-in history</h2>
            <p className="mt-2 text-sm leading-6 text-[#6c604d]">Suggested rhythm: once per month.</p>
          </div>
        </div>

        {recentHistory.length ? (
          <div className="mt-5 grid gap-3">
            {recentHistory.map((entry, index) => (
              <article key={entry.id || `${entry.dateCompleted}-${index}`} className="soft-panel rounded-md p-4 transition hover:-translate-y-0.5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-[#302a21]">{formatDisplayDate(new Date(entry.dateCompleted || entry.timestamp))}</div>
                    <div className="mt-1 text-sm text-[#6c604d]">Lowest area: {domainMeta[entry.lowestCategory]?.label || "Not recorded"}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center text-sm sm:min-w-[360px]">
                    <div><div className="font-semibold text-[#8d621d]">{formatScore(entry.total)}</div><div className="text-xs text-[#6c604d]">Total</div></div>
                    <div><div className="font-semibold text-[#8d621d]">{formatScore(entry.spirit)}</div><div className="text-xs text-[#6c604d]">Spirit</div></div>
                    <div><div className="font-semibold text-[#8d621d]">{formatScore(entry.soul)}</div><div className="text-xs text-[#6c604d]">Soul</div></div>
                    <div><div className="font-semibold text-[#8d621d]">{formatScore(entry.body)}</div><div className="text-xs text-[#6c604d]">Body</div></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="soft-panel mt-5 rounded-md p-5 text-sm leading-6 text-[#5c513f]">
            No check-ins yet. Complete the assessment to create your first entry.
          </div>
        )}
      </section>
    </main>
  );
}

function ResultsPage({ answers, setPage, assessmentComplete, history, onClearHistory, onStartNewCheckIn }) {
  const scores = assessmentComplete ? scoreAnswers(answers) : null;
  const visualScores = scores;
  const subcategoryResults = assessmentComplete ? scoreSubcategories(answers) : null;
  const alignmentLevel = scores && alignmentLevelFor(scores.total);
  const resistanceLevel = scores && resistanceLevelFor(scores.resistance);
  const lowestCategory = scores && lowestCategoryFor(scores);
  const summaryInsights = {
    spirit:
      "Your outward life may be active, but alignment begins at the center. Growth will come from strengthening your connection to God.",
    soul:
      "You may be active and engaged, but inner clarity is affecting consistency. Growth will come from renewing your thinking and stabilizing your inner life.",
    body:
      "Your alignment is strongest internally, but less consistent in outward action. Growth will come from turning intention into consistent habits and follow-through.",
  };
  const summaryInsight = lowestCategory && summaryInsights[lowestCategory];
  const focusAreas = {
    spirit: [
      "Your lowest area right now is Spirit (connection to God).",
      "This is where your alignment begins to strengthen.",
    ],
    soul: [
      "Your lowest area right now is Soul (thoughts, emotions, and inner stability).",
      "This is where clarity and renewal are needed most.",
    ],
    body: [
      "Your lowest area right now is Body (outward action and consistency).",
      "This is where your greatest opportunity for growth exists.",
    ],
  };
  const focusArea = lowestCategory && focusAreas[lowestCategory];
  const nextSteps = {
    "Connection to God": "Spend 5 quiet minutes in prayer with no distractions.",
    Conviction: "Act on something you know is right today, even if small.",
    "Desire for Righteousness": "Choose what is right over what is easy once today.",
    Surrender: "Release control of one situation and trust God with it.",
    "Thought Life": "Notice one recurring thought today and challenge it.",
    "Emotional Stability": "Pause before reacting once today.",
    "Identity and Humility": "Choose humility in one interaction today.",
    Relationships: "Reach out intentionally to one person today.",
    "Physical Health": "Do one thing today that strengthens your body.",
    Discipline: "Follow through on one small commitment today.",
    "Self-Control": "Pause and choose your response once today.",
  };
  const nextStep = subcategoryResults && nextSteps[subcategoryResults.lowest.name];
  const growthPaths = {
    spirit: {
      beatitudes: ["Blessed are the poor in spirit, for theirs is the kingdom of heaven."],
      explanation:
        "Growth begins by returning to the center. Consistent time with God will begin to restore clarity, direction, and alignment across every area of your life.",
      explanationLines: [
        "Growth begins by returning to the center.",
        "Consistent time with God will begin to restore clarity, direction, and alignment across every area of your life.",
      ],
    },
    soul: {
      beatitudes: ["Blessed are the pure in heart, for they shall see God."],
      explanation: "Growth comes through renewing your thinking and aligning your inner life with truth.",
    },
    body: {
      beatitudes: ["Blessed are those who hunger and thirst for righteousness, for they shall be filled."],
      explanation:
        "Growth here means turning intention into consistent follow-through. Small, repeated actions will bring your outer life into alignment with what you believe.",
    },
  };
  const growthPath = lowestCategory && growthPaths[lowestCategory];
  const categoryCards = scores
    ? [
        { name: "Spirit", value: scores.spirit, detail: "Connection to God" },
        { name: "Soul", value: scores.soul, detail: "Thoughts, emotions, identity" },
        { name: "Body", value: scores.body, detail: "Actions and discipline" },
      ]
    : [];

  if (!assessmentComplete) {
    return (
      <main className="mx-auto max-w-6xl px-5 pb-12 pt-4 sm:px-8">
        <section className="glass-panel rounded-md p-6 sm:p-8">
          <p className="eyebrow mb-4">Results</p>
          <h1 className="serif text-3xl font-semibold text-[#302a21] sm:text-4xl">Results are not ready yet</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#5c513f]">
            Complete the assessment to view your alignment score, category overview, structure visual, and next step.
          </p>
          <button
            onClick={() => setPage("assessment")}
            className="gold-button mt-6 rounded-md px-5 py-3 text-sm font-semibold text-white"
          >
            Continue Assessment
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-5 pb-12 pt-4 sm:px-8">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow mb-3">Results</p>
          <h1 className="serif text-3xl font-semibold text-[#302a21] sm:text-4xl">Your alignment dashboard</h1>
        </div>
        <p className="max-w-xl text-sm leading-6 text-[#6c604d]">A concise view of your completed assessment.</p>
      </div>

      <section className="glass-panel rounded-md p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9f7026]">Alignment Score</div>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-6xl font-semibold tabular-nums text-[#8d621d]">{formatScore(scores.total)}</span>
              <span className="pb-2 text-xl font-medium text-[#7b6b50]">/ 10</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-[#5c513f]">
              <span>{alignmentLevel}</span>
              <span>These results reflect your current alignment.</span>
            </div>
          </div>
          <div className="soft-panel rounded-md px-6 py-5 text-left md:min-w-[220px]">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9f7026]">Resistance</div>
            <div className="mt-2 text-4xl font-semibold tabular-nums text-[#302a21]">{formatScore(scores.resistance)}</div>
            <div className="mt-2 text-sm font-semibold text-[#6c604d]">{resistanceLevel}</div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {categoryCards.map((card) => (
          <CategoryOverviewCard key={card.name} name={card.name} value={card.value} detail={card.detail} />
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="grid gap-6">
          <section className="glass-panel rounded-md p-5 sm:p-6">
            <h2 className="serif text-2xl font-semibold text-[#302a21]">Key Insight</h2>
            <div className="mt-4 grid gap-3 text-sm leading-6 text-[#5c513f]">
              <div className="soft-panel rounded-md p-4">
                <span className="font-semibold text-[#302a21]">Strongest area:</span> {subcategoryResults.highest.name}
              </div>
              <div className="soft-panel rounded-md p-4">
                <span className="font-semibold text-[#302a21]">Weakest area:</span> {subcategoryResults.lowest.name}
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-md p-5 sm:p-6">
            <h2 className="serif text-2xl font-semibold text-[#302a21]">Next Step</h2>
            <div className="mt-4 space-y-4 text-sm leading-6 text-[#5c513f]">
              <p className="font-medium text-[#3c3428]">{focusArea?.[0]}</p>
              <p className="rounded-md border border-[#eadfcb] bg-white/65 p-4 italic text-[#4f4434]">
                “{growthPath.beatitudes[0]}”
              </p>
              <p className="font-semibold text-[#8d621d]">{nextStep}</p>
            </div>
          </section>
        </div>

        <section className="glass-panel flex flex-col items-center rounded-md p-5 sm:p-6">
          <div className="mb-3 text-center">
            <p className="eyebrow">Structure</p>
            <h2 className="serif mt-2 text-2xl font-semibold text-[#302a21]">Your Structure</h2>
          </div>
          <EtytomicVisual scores={visualScores} compact />
        </section>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SubcategoryResults results={subcategoryResults} />
        <section className="glass-panel rounded-md p-5 sm:p-6">
          <h2 className="serif text-2xl font-semibold text-[#302a21]">Details</h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-[#5c513f]">
            <p><span className="font-semibold text-[#302a21]">Focus:</span> {focusArea?.[1]}</p>
            <p><span className="font-semibold text-[#302a21]">Summary:</span> {summaryInsight}</p>
            <p><span className="font-semibold text-[#302a21]">Growth:</span> {growthPath.explanation}</p>
            {scores.spirit >= 7 && (
              <p className="rounded-md border border-[#eadfcb] bg-white/55 px-4 py-3 text-xs leading-5 text-[#6c604d]">
                A strong spirit reflects Christ. Even in imperfect circumstances, His light becomes visible through you.
              </p>
            )}
          </div>
        </section>
      </section>

      <details className="glass-panel mt-6 rounded-md p-5 sm:p-6">
        <summary className="cursor-pointer serif text-xl font-semibold text-[#302a21]">Progress over time</summary>
        <ProgressOverTime history={history} onClearHistory={onClearHistory} onStartNewCheckIn={onStartNewCheckIn} />
      </details>

      <section className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          onClick={onStartNewCheckIn}
          className="gold-button rounded-md px-5 py-3 text-sm font-semibold text-white"
        >
          Retake Assessment
        </button>
        <button
          onClick={() => setPage("checkin")}
          className="rounded-md border border-[#d7cab2] bg-white/70 px-5 py-3 text-sm font-semibold text-[#705f42] shadow-sm"
        >
          Check In Later
        </button>
      </section>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [page, setPage] = useState("about");
  const [answers, setAnswers] = useState({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [history, setHistory] = useState(loadAssessmentHistory);
  const [assessmentRunId, setAssessmentRunId] = useState(0);

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user || null);
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setPage("about");
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  function saveCompletedAssessment() {
    const scores = scoreAnswers(answers);
    const subcategoryResults = scoreSubcategories(answers);
    const entry = createHistoryEntry(scores, subcategoryResults);
    setHistory((current) => {
const updated = [...current, entry];
persistAssessmentHistory(updated);
return updated;
    });
  }

  function clearHistory() {
    if (!window.confirm("Clear saved assessment history? Your current answers will stay on this page.")) return;
    window.localStorage.removeItem(historyStorageKey);
    setHistory([]);
  }

  function startNewCheckIn() {
    setAnswers({});
    setAssessmentComplete(false);
    setAssessmentRunId((current) => current + 1);
    setPage("assessment");
  }

  function handleAuthSuccess(nextUser) {
    setUser(nextUser);
    setPage("about");
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setPage("welcome");
  }

  if (authLoading) {
    return (
      <>
        <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <section className="glass-panel rounded-md p-8 text-center">
            <h1 className="serif text-3xl font-semibold text-[#302a21]">Etytomic Alignment</h1>
            <p className="mt-4 text-base leading-7 text-[#5c513f]">Preparing your account session...</p>
          </section>
        </main>
        <Footer setPage={setPage} />
      </>
    );
  }

  if (!user) {
    return (
      <>
        {["terms", "privacy", "disclaimer"].includes(page) ? (
          <LegalPage type={page} />
        ) : (
          <WelcomePage setPage={setPage} onAuthSuccess={handleAuthSuccess} />
        )}
        <Footer setPage={setPage} />
      </>
    );
  }

  return (
    <>
<Header page={page} setPage={setPage} user={user} onLogout={handleLogout} />
{page === "about" && <AboutPage setPage={setPage} />}
{page === "assessment" && (
  <AssessmentPage
    key={assessmentRunId}
    answers={answers}
    setAnswers={setAnswers}
    setPage={setPage}
    assessmentComplete={assessmentComplete}
    setAssessmentComplete={setAssessmentComplete}
    onCompleteAssessment={saveCompletedAssessment}
  />
)}
{page === "results" && (
  <ResultsPage
    answers={answers}
    setPage={setPage}
    assessmentComplete={assessmentComplete}
    history={history}
    onClearHistory={clearHistory}
    onStartNewCheckIn={startNewCheckIn}
  />
)}
{page === "checkin" && <CheckInPage history={history} onStartNewCheckIn={startNewCheckIn} />}
{["terms", "privacy", "disclaimer"].includes(page) && <LegalPage type={page} />}
<Footer setPage={setPage} />
    </>
  );
}



export default App;
