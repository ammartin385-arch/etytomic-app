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
{ text: "When I feel uncertain or out of control, I become anxious rather than trusting God.", reverseScored: true },
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

function getQuestionText(question) {
  return typeof question === "string" ? question : question.text;
}

function scoreQuestionAnswer(question, value) {
  if (!value) return value;
  return typeof question === "object" && question.reverseScored ? 11 - value : value;
}

const allQuestions = sections.flatMap((section, sectionIndex) =>
  section.questions.map((question, questionIndex) => ({
    id: `${sectionIndex}-${questionIndex}`,
    key: section.key,
    domain: section.domain,
    theme: section.theme,
    sectionIndex,
    questionIndex,
    question: getQuestionText(question),
    reverseScored: typeof question === "object" && question.reverseScored,
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
domainValues[item.key].push(item.reverseScored ? 11 - answers[item.id] : answers[item.id]);
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
    .map((question, questionIndex) => scoreQuestionAnswer(question, answers[`${section.sectionIndex}-${questionIndex}`]))
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

function alignmentSentenceFor(score) {
  if (score >= 7) return "You are strongly aligned.";
  if (score >= 4) return "Your alignment is forming with room for steadier growth.";
  return "Your alignment is a starting point for gentle, honest growth.";
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

function isPaidUser(user) {
  const metadata = { ...(user?.app_metadata || {}), ...(user?.user_metadata || {}) };
  const truthyFlags = [metadata.is_paid, metadata.paid, metadata.paid_user, metadata.has_paid_access];
  const tierValues = [
    metadata.plan,
    metadata.tier,
    metadata.role,
    metadata.account_type,
    metadata.subscription_tier,
    metadata.subscription_status,
  ]
    .filter(Boolean)
    .map((value) => String(value).toLowerCase());

  return (
    truthyFlags.some(Boolean) ||
    tierValues.some((value) => ["paid", "premium", "pro", "active", "subscriber"].includes(value))
  );
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

function normalizeResultRow(row) {
  const spirit = Number(row.spirit_score ?? row.spirit ?? row.spiritAvg ?? 0);
  const soul = Number(row.soul_score ?? row.soul ?? row.soulAvg ?? 0);
  const body = Number(row.body_score ?? row.body ?? row.bodyAvg ?? 0);
  const total = Number(row.alignment_score ?? row.total ?? row.overallScore ?? 0);
  const timestamp = row.created_at || row.dateCompleted || row.timestamp || new Date().toISOString();
  const scores = { spirit, soul, body, total, resistance: 10 - total };

  return {
    id: row.id,
    dateCompleted: timestamp,
    timestamp,
    created_at: timestamp,
    overallScore: total,
    total,
    spiritAvg: spirit,
    soulAvg: soul,
    bodyAvg: body,
    spirit,
    soul,
    body,
    lowestCategory: lowestCategoryFor(scores),
    alignmentLevel: alignmentLevelFor(total),
    resistanceLevel: resistanceLevelFor(scores.resistance),
  };
}

function sortHistoryNewestFirst(entries) {
  return [...entries].sort(
    (a, b) =>
      new Date(b.created_at || b.dateCompleted || b.timestamp) -
      new Date(a.created_at || a.dateCompleted || a.timestamp)
  );
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
    const pull = 1 - alignment;
    return {
      opacity: 0.38 + alignment * 0.46,
      width: 1.45 + alignment * 1.35,
      glowOpacity: 0.06 + alignment * 0.16,
      blur: 0.05 + pull * 0.45,
      pull,
    };
  };
  const spiritStyle = scoreStyle(safeScores.spirit);
  const soulStyle = scoreStyle(safeScores.soul);
  const bodyStyle = scoreStyle(safeScores.body);
  const bodyPull = bodyStyle.pull;
  const spiritPull = spiritStyle.pull;
  const soulPull = soulStyle.pull;

  const style = {
    "--light-strength": normalized,
    "--ring-definition": normalized,
    "--beam-opacity": 0.12 + normalized * 0.28,
    "--beam-blur": `${2.6 + resistance * 2.8}px`,
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
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="55%" stopColor="#F9FAFB" />
      <stop offset="100%" stopColor="#E5E7EB" />
    </linearGradient>
    <radialGradient id="minimalCenterGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stopColor="#FFFFFF" />
      <stop offset="28%" stopColor="#F3F4F6" stopOpacity="0.92" />
      <stop offset="62%" stopColor="#E6C97A" stopOpacity="0.12" />
      <stop offset="100%" stopColor="#E6C97A" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="bodyRingGradient" x1="0%" x2="100%">
      <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.34" />
      <stop offset="48%" stopColor="#94A3B8" stopOpacity="0.78" />
      <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.34" />
    </linearGradient>
    <linearGradient id="spiritRingGradient" x1="0%" x2="100%">
      <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.36" />
      <stop offset="52%" stopColor="#4A6FA5" stopOpacity="0.82" />
      <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.34" />
    </linearGradient>
    <linearGradient id="soulRingGradient" x1="0%" x2="100%">
      <stop offset="0%" stopColor="#E5E7EB" stopOpacity="0.38" />
      <stop offset="50%" stopColor="#94A3B8" stopOpacity="0.72" />
      <stop offset="100%" stopColor="#E5E7EB" stopOpacity="0.34" />
    </linearGradient>
    <linearGradient id="crossHorizontal" x1="0%" x2="100%">
      <stop offset="0%" stopColor="#E6C97A" stopOpacity="0" />
      <stop offset="42%" stopColor="#E6C97A" stopOpacity="0.68" />
      <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
      <stop offset="58%" stopColor="#E6C97A" stopOpacity="0.68" />
      <stop offset="100%" stopColor="#E6C97A" stopOpacity="0" />
    </linearGradient>
    <linearGradient id="crossVertical" x1="0%" x2="0%" y1="0%" y2="100%">
      <stop offset="0%" stopColor="#E6C97A" stopOpacity="0" />
      <stop offset="42%" stopColor="#E6C97A" stopOpacity="0.68" />
      <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
      <stop offset="58%" stopColor="#E6C97A" stopOpacity="0.68" />
      <stop offset="100%" stopColor="#E6C97A" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="minimalField" cx="50%" cy="50%" r="58%">
      <stop offset="0%" stopColor="#F9FAFB" stopOpacity="0.24" />
      <stop offset="48%" stopColor="#E5E7EB" stopOpacity="0.12" />
      <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
    </radialGradient>
    <filter id="minimalBlur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="7" />
    </filter>
  </defs>

  <rect x="0" y="0" width={compact ? "480" : "640"} height="480" rx="36" fill="url(#structureWarmBg)" opacity="0.95" />
  <rect x="0" y="0" width={compact ? "480" : "640"} height="480" rx="36" fill="url(#minimalField)" opacity="0.62" />
  <ellipse cx={centerX} cy={centerY} rx={118 + resistance * 20} ry={96 + resistance * 14} fill="url(#minimalCenterGlow)" opacity={0.16 + normalized * 0.14} filter="url(#minimalBlur)" />

  <g className="structure-orbit-system" style={{ transformOrigin: `${centerX}px ${centerY}px` }}>
    <g
      className="structure-orbit-layer body-orbit-layer"
      transform={`translate(${(bodyPull * 8).toFixed(2)} ${(bodyPull * 34).toFixed(2)}) rotate(${(bodyPull * 1.6).toFixed(2)} ${centerX} ${centerY}) scale(${(1 + bodyPull * 0.02).toFixed(3)} ${(1 + bodyPull * 0.035).toFixed(3)})`}
      style={{ transformOrigin: `${centerX}px ${centerY}px` }}
    >
      <ellipse className="structure-orbit-glow body-orbit" cx={centerX} cy={centerY} rx={182 + bodyPull * 10} ry={52 + bodyPull * 4} strokeWidth={bodyStyle.width + 4} opacity={bodyStyle.glowOpacity} style={{ filter: `blur(${bodyStyle.blur + 0.55}px)` }} />
      <ellipse className="structure-orbit body-orbit" cx={centerX} cy={centerY} rx={182 + bodyPull * 10} ry={52 + bodyPull * 4} strokeWidth={bodyStyle.width} opacity={bodyStyle.opacity} style={{ filter: `blur(${bodyStyle.blur}px)` }} />
    </g>
    <g
      className="structure-orbit-layer spirit-orbit-layer"
      transform={`translate(${(-spiritPull * 34).toFixed(2)} ${(-spiritPull * 18).toFixed(2)}) rotate(${(-13 - spiritPull * 2.2).toFixed(2)} ${centerX} ${centerY}) skewX(${(spiritPull * 1.1).toFixed(2)}) scale(${(1 + spiritPull * 0.035).toFixed(3)} ${(1 + spiritPull * 0.015).toFixed(3)})`}
      style={{ transformOrigin: `${centerX}px ${centerY}px` }}
    >
      <ellipse className="structure-orbit-glow spirit-orbit" cx={centerX} cy={centerY} rx={72 + spiritPull * 6} ry={172 + spiritPull * 9} strokeWidth={spiritStyle.width + 4} opacity={spiritStyle.glowOpacity} style={{ filter: `blur(${spiritStyle.blur + 0.55}px)` }} />
      <ellipse className="structure-orbit spirit-orbit" cx={centerX} cy={centerY} rx={72 + spiritPull * 6} ry={172 + spiritPull * 9} strokeWidth={spiritStyle.width} opacity={spiritStyle.opacity} style={{ filter: `blur(${spiritStyle.blur}px)` }} />
    </g>
    <g
      className="structure-orbit-layer soul-orbit-layer"
      transform={`translate(${(soulPull * 34).toFixed(2)} ${(soulPull * 18).toFixed(2)}) rotate(${(43 + soulPull * 2.2).toFixed(2)} ${centerX} ${centerY}) skewX(${(-soulPull * 1.1).toFixed(2)}) scale(${(1 + soulPull * 0.035).toFixed(3)} ${(1 + soulPull * 0.018).toFixed(3)})`}
      style={{ transformOrigin: `${centerX}px ${centerY}px` }}
    >
      <ellipse className="structure-orbit-glow soul-orbit" cx={centerX} cy={centerY} rx={76 + soulPull * 7} ry={170 + soulPull * 9} strokeWidth={soulStyle.width + 4} opacity={soulStyle.glowOpacity} style={{ filter: `blur(${soulStyle.blur + 0.55}px)` }} />
      <ellipse className="structure-orbit soul-orbit" cx={centerX} cy={centerY} rx={76 + soulPull * 7} ry={170 + soulPull * 9} strokeWidth={soulStyle.width} opacity={soulStyle.opacity} style={{ filter: `blur(${soulStyle.blur}px)` }} />
    </g>
  </g>

  <g className="cross-of-light">
    <rect className="beam-halo" x={centerX - 196} y={centerY - 12} width="392" height="24" rx="12" fill="url(#crossHorizontal)" />
    <rect className="beam-halo" x={centerX - 12} y={centerY - 196} width="24" height="392" rx="12" fill="url(#crossVertical)" />
    <rect className="axis-energy" x={centerX - 178} y={centerY - 2.5} width="356" height="5" rx="2.5" fill="url(#crossHorizontal)" />
    <rect className="axis-energy vertical" x={centerX - 2.5} y={centerY - 178} width="5" height="356" rx="2.5" fill="url(#crossVertical)" />
    <rect className="beam-core" x={centerX - 118} y={centerY - 4} width="236" height="8" rx="4" fill="#FFFFFF" />
    <rect className="beam-core" x={centerX - 4} y={centerY - 118} width="8" height="236" rx="4" fill="#FFFFFF" />
  </g>

  <ellipse cx={centerX} cy={centerY} rx={48 + resistance * 12} ry={34 + resistance * 8} fill="url(#minimalCenterGlow)" opacity={centerStrength * 0.46} filter="url(#minimalBlur)" />
</svg>
    </section>
  );
}

function LogoMark() {
  return (
    <svg className="logo-mark" viewBox="0 0 72 72" role="img" aria-label="Etytomic Alignment symbol">
      <defs>
        <radialGradient id="logoCenterBloom" cx="50%" cy="50%" r="58%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.88" />
          <stop offset="34%" stopColor="#F4E2B8" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#F4E2B8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="logoHorizontalLight" x1="6" x2="66" y1="36" y2="36">
          <stop offset="0%" stopColor="#F4E2B8" stopOpacity="0" />
          <stop offset="16%" stopColor="#F4E2B8" stopOpacity="0.22" />
          <stop offset="47%" stopColor="#FFFFFF" stopOpacity="0.82" />
          <stop offset="53%" stopColor="#FFFFFF" stopOpacity="0.82" />
          <stop offset="84%" stopColor="#F4E2B8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F4E2B8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="logoVerticalLight" x1="36" x2="36" y1="5" y2="67">
          <stop offset="0%" stopColor="#F4E2B8" stopOpacity="0" />
          <stop offset="16%" stopColor="#F4E2B8" stopOpacity="0.22" />
          <stop offset="47%" stopColor="#FFFFFF" stopOpacity="0.86" />
          <stop offset="53%" stopColor="#FFFFFF" stopOpacity="0.86" />
          <stop offset="84%" stopColor="#F4E2B8" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#F4E2B8" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="logoOrbitBlue" x1="10" x2="62" y1="18" y2="54">
          <stop offset="0%" stopColor="#4A6FA5" stopOpacity="0.3" />
          <stop offset="48%" stopColor="#4A6FA5" stopOpacity="0.66" />
          <stop offset="100%" stopColor="#CBD5E1" stopOpacity="0.32" />
        </linearGradient>
        <linearGradient id="logoOrbitSlate" x1="58" x2="14" y1="18" y2="54">
          <stop offset="0%" stopColor="#CBD5E1" stopOpacity="0.28" />
          <stop offset="52%" stopColor="#94A3B8" stopOpacity="0.58" />
          <stop offset="100%" stopColor="#4A6FA5" stopOpacity="0.28" />
        </linearGradient>
        <filter id="logoSoftBlur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.1" />
        </filter>
      </defs>
      <rect x="0" y="0" width="72" height="72" rx="18" fill="#FFFFFF" opacity="0.92" />
      <ellipse cx="36" cy="36" rx="22" ry="19" fill="url(#logoCenterBloom)" filter="url(#logoSoftBlur)" />

      <ellipse cx="36" cy="36" rx="26" ry="7.4" fill="none" stroke="url(#logoOrbitSlate)" strokeWidth="1.35" strokeLinecap="round" opacity="0.45" />
      <ellipse cx="36" cy="36" rx="9.4" ry="27.6" transform="rotate(-34 36 36)" fill="none" stroke="url(#logoOrbitBlue)" strokeWidth="1.35" strokeLinecap="round" opacity="0.58" />

      <g opacity="0.92">
        <rect x="8" y="32" width="56" height="8" rx="4" fill="url(#logoHorizontalLight)" filter="url(#logoSoftBlur)" />
        <rect x="31.5" y="6" width="9" height="60" rx="4.5" fill="url(#logoVerticalLight)" filter="url(#logoSoftBlur)" />
        <rect x="14" y="34.15" width="44" height="3.7" rx="1.85" fill="url(#logoHorizontalLight)" opacity="0.82" />
        <rect x="34.15" y="12" width="3.7" height="48" rx="1.85" fill="url(#logoVerticalLight)" opacity="0.86" />
      </g>

      <ellipse cx="36" cy="36" rx="9.4" ry="27.6" transform="rotate(34 36 36)" fill="none" stroke="url(#logoOrbitSlate)" strokeWidth="1.35" strokeLinecap="round" opacity="0.52" />
    </svg>
  );
}

function Header({ page, setPage, user, onLogout }) {
  const nav = [
    ["about", "About"],
    ["assessment", "Alignment Assessment"],
    ["results", "Results"],
    ["progress", "Progress"],
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
    <div className="brand-subtitle">Assessment</div>
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
  <h1 className="serif text-3xl font-semibold text-[#1F2937] sm:text-4xl">{page.title}</h1>
  <div className="mt-6 space-y-4 text-base leading-8 text-[#374151]">
    {page.intro?.map((line) => <p key={line}>{line}</p>)}
    {page.list && (
      <ul className="list-disc space-y-2 pl-5">
        {page.list.map((item) => <li key={item}>{item}</li>)}
      </ul>
    )}
    {page.sections.map((section, index) => (
      <div key={section.title || index} className="pt-2">
        {section.title && <h2 className="text-base font-semibold text-[#1F2937]">{section.title}</h2>}
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
    <footer className="mx-auto w-full max-w-6xl px-5 py-6 text-center sm:px-8">
<div className="border-t border-[#E5E7EB] pt-6">
  <div className="flex flex-wrap justify-center gap-4 text-sm text-[#6B7280]">
    {links.map(([key, label]) => (
      <button key={key} onClick={() => setPage(key)} className="font-medium hover:text-[#3F5F8C]">
        {label}
      </button>
    ))}
  </div>
  <p className="mt-4 text-xs text-[#9CA3AF]">
    © 2026 <span className="font-medium text-[#6B7280]">Etytomic Labs</span>, LLC
  </p>
</div>
    </footer>
  );
}

function SignUpAgreement({ setPage }) {
  return (
    <p className="text-xs leading-5 text-[#6B7280]">
By creating an account, you agree to our{" "}
<button onClick={() => setPage("terms")} className="font-semibold text-[#4A6FA5] underline">
  Terms of Use
</button>{" "}
and{" "}
<button onClick={() => setPage("privacy")} className="font-semibold text-[#4A6FA5] underline">
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
    "mt-2 w-full rounded-md border border-[#E5E7EB] bg-white/80 px-3 py-2 text-sm text-[#1F2937] shadow-sm outline-none transition focus:border-[#4A6FA5] focus:ring-2 focus:ring-[#CBD5E1]";

  return (
    <main className="mx-auto max-w-6xl px-5 pb-12 pt-8 sm:px-8">
      <section className="glass-panel rounded-md p-6 sm:p-10">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <p className="eyebrow mb-4">Welcome</p>
            <h1 className="serif text-4xl font-semibold tracking-normal text-[#1F2937] sm:text-5xl">
              Etytomic Alignment
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[#374151]">
              Create an account or log in to take the assessment, save your results, and return for monthly check-ins over time.
            </p>
            <div className="soft-panel mt-8 rounded-md p-5 text-sm leading-7 text-[#6B7280]">
              <p>This is a personal reflection tool for noticing alignment, resistance, and growth across spirit, soul, and body.</p>
              <p className="mt-3">Your account keeps your results connected to you as the app grows beyond this prototype.</p>
            </div>
          </div>

          <div className="space-y-6">
            {accountCreated && (
              <div className="rounded-md border border-[#4A6FA5] bg-[#F9FAFB] p-6 shadow-sm">
                <p className="eyebrow mb-3">Confirmation sent</p>
                <h2 className="serif text-3xl font-semibold text-[#1F2937]">Account created!</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-[#374151]">
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
              <h2 className="serif text-2xl font-semibold text-[#1F2937]">Create Account</h2>
              <label className="mt-5 block text-sm font-semibold text-[#1F2937]">
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
              <label className="mt-4 block text-sm font-semibold text-[#1F2937]">
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
              <label className="mt-4 block text-sm font-semibold text-[#1F2937]">
                Display name <span className="font-normal text-[#6B7280]">(optional)</span>
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
              <h2 className="serif text-2xl font-semibold text-[#1F2937]">Log In</h2>
              <label className="mt-5 block text-sm font-semibold text-[#1F2937]">
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
              <label className="mt-4 block text-sm font-semibold text-[#1F2937]">
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
          <div className={`mt-6 rounded-md border p-4 text-sm leading-6 ${error ? "border-[#d8a6a1] bg-[#F9FAFB] text-[#8a3d34]" : "border-[#E5E7EB] bg-white/65 text-[#374151]"}`}>
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
            <h1 className="serif max-w-3xl text-4xl font-semibold tracking-normal text-[#1F2937] sm:text-5xl">
              Alignment begins at the center.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#374151]">
              Spirit, soul, and body ordered around God.
            </p>
          </div>
          <div className="soft-panel rounded-md p-5 text-sm leading-6 text-[#6B7280]">
            <p className="font-semibold text-[#1F2937]">Acts 17:28</p>
            <p className="mt-2">“In Him we live and move and have our being.”</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={() => setPage("assessment")} className="gold-button rounded-md px-5 py-3 text-sm font-semibold text-white">
            Begin Assessment
          </button>
          <button onClick={() => setPage("checkin")} className="rounded-md border border-[#E5E7EB] bg-white/70 px-5 py-3 text-sm font-semibold text-[#374151] shadow-sm hover:bg-white">
            Check-In Rhythm
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3">
        {overviewCards.map((card) => (
          <article key={card.title} className="soft-panel rounded-md p-5 transition hover:-translate-y-0.5">
            <h2 className="serif text-xl font-semibold text-[#1F2937]">{card.title}</h2>
            <p className="mt-3 text-sm leading-6 text-[#374151]">{card.body}</p>
            <p className="mt-4 rounded-md bg-white/55 p-3 text-xs font-semibold leading-5 text-[#4A6FA5]">{card.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-panel rounded-md p-5 sm:p-6">
          <p className="eyebrow mb-3">Structure</p>
          <h2 className="serif text-2xl font-semibold text-[#1F2937]">Spirit, soul, body</h2>
          <div className="mt-5 grid gap-3">
            {dimensions.map(([name, title, body]) => (
              <div key={name} className="soft-panel rounded-md p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-semibold text-[#1F2937]">{name}</h3>
                  <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4A6FA5]">{title}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#374151]">{body}</p>
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
        ? "border-[#4A6FA5] bg-[#4A6FA5] text-white shadow-md shadow-[#4A6FA5]/20"
        : "border-[#E5E7EB] bg-white/75 text-[#374151] shadow-sm hover:border-[#3F5F8C] hover:bg-[#F9FAFB]"
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
      Promise.resolve(onCompleteAssessment()).catch((error) => {
        console.error("Unable to save completed assessment.", error);
      });
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
          <h1 className="serif text-4xl font-semibold text-[#1F2937] sm:text-5xl">Assessment complete.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#374151]">Your answers are locked and your full results are ready.</p>
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
              <h1 className="serif text-4xl font-semibold text-[#1F2937] sm:text-5xl">Before you begin</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-[#374151]">
                This is a reflection tool for noticing alignment and resistance. Answer honestly based on where you are today.
              </p>
            </div>
            <div className="mt-1 space-y-2 text-sm leading-relaxed text-[#6B7280] lg:mt-2">
              <p>Not a measure of worth or standing</p>
              <p>Not a final judgment, diagnosis, or label</p>
              <p>Not a replacement for guidance, counseling, or support</p>
              <p className="mt-5 text-base font-medium text-[#374151]">Growth begins with clarity.</p>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setHasStarted(true)} className="gold-button rounded-md px-5 py-3 text-sm font-semibold text-white">
              Start Alignment Assessment
            </button>
            <button onClick={() => setPage("about")} className="rounded-md border border-[#E5E7EB] bg-white/70 px-5 py-3 text-sm font-semibold text-[#374151] shadow-sm">
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
        <div className="mb-4 flex items-center justify-between gap-4 text-sm text-[#6B7280]">
          <span>Section {sectionIndex + 1} of {sections.length}</span>
          <span>{answeredCount} of {allQuestions.length} scored</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
          <div className="h-full rounded-full bg-[#CBD5E1] transition-all duration-500" style={{ width: `${sectionProgress}%` }} />
        </div>
        <div className="mt-3 text-xs text-[#6B7280]">
          {allSectionsComplete ? "Assessment complete" : `${completedSections} of ${sections.length} sections completed`}
        </div>
      </section>

      <section key={sectionIndex} className="assessment-section glass-panel mt-6 rounded-md p-6 sm:p-8">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#4A6FA5]">
              <span>{section.domain}</span>
              <span>•</span>
              <span>{domainMeta[section.key].weight}</span>
            </div>
            <h1 className="serif mt-3 text-3xl font-semibold leading-tight text-[#1F2937] sm:text-4xl">{section.theme}</h1>
            <p className="mt-3 text-sm leading-6 text-[#6B7280]">Score each statement from 1 to 10 before continuing.</p>
          </div>
          <div className="soft-panel rounded-md px-4 py-3 text-sm font-semibold text-[#374151]">
            {completeInSection} of {section.questions.length} answered
          </div>
        </div>

        <div className="grid gap-5">
          {section.questions.map((question, questionIndex) => {
            const id = `${sectionIndex}-${questionIndex}`;
            return (
              <div key={id} className="soft-panel rounded-md p-4 sm:p-5">
                <div className="mb-4 flex gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#F9FAFB] text-sm font-semibold text-[#4A6FA5] shadow-sm">
                    {questionIndex + 1}
                  </span>
                  <p className="text-base font-medium leading-7 text-[#1F2937]">{getQuestionText(question)}</p>
                </div>
                <ScoreButtons value={answers[id]} onChange={(value) => updateAnswer(questionIndex, value)} />
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button onClick={goBack} disabled={sectionIndex === 0} className="rounded-md border border-[#E5E7EB] bg-white/70 px-5 py-3 text-sm font-semibold text-[#374151] shadow-sm disabled:cursor-not-allowed disabled:opacity-40">
            Back
          </button>
          {canContinue ? (
            <button onClick={goNext} className="gold-button rounded-md px-6 py-3 text-sm font-semibold text-white">
              {isLast ? "View Full Results" : "Continue"}
            </button>
          ) : (
            <div className="rounded-md border border-[#E5E7EB] bg-white/60 px-4 py-3 text-sm font-medium text-[#6B7280]">
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
  <div className="text-sm font-semibold text-[#1F2937]">{label}</div>
  <div className="text-2xl font-semibold tabular-nums text-[#4A6FA5]">{value.toFixed(1)}</div>
</div>
<div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
  <div className="h-full rounded-full bg-[#CBD5E1]" style={{ width: `${value * 10}%` }} />
</div>
<div className="mt-3 text-xs leading-5 text-[#6B7280]">{detail}</div>
<div className="mt-1 text-xs font-medium text-[#6B7280]">Resistance {(10 - value).toFixed(1)}</div>
    </div>
  );
}

function CategoryOverviewCard({ name, value, detail }) {
  return (
    <div className="soft-panel rounded-md p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="serif text-2xl font-semibold text-[#1F2937]">{name}</h3>
          <p className="mt-1 text-xs leading-5 text-[#6B7280]">{detail}</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Score</div>
          <div className="text-3xl font-semibold tabular-nums text-[#1F2937]">{formatScore(value)}</div>
        </div>
      </div>
      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#CBD5E1]">
        <div className="h-full rounded-full bg-[#CBD5E1]" style={{ width: `${value * 10}%` }} />
      </div>
    </div>
  );
}

function SubcategoryResults({ results }) {
  return (
    <section className="glass-panel rounded-md p-5 sm:p-6">
<h2 className="serif text-2xl font-semibold text-[#1F2937]">Where Growth Is Needed Most</h2>
<div className="mt-3 grid gap-2 text-sm leading-6 text-[#6B7280]">
  <p>These sub-scores show which areas are creating the most alignment.</p>
  <p>They also show where resistance may be strongest.</p>
</div>

<div className="mt-5 grid gap-4">
  {results.groups.map((group) => (
    <div key={group.domain} className="soft-panel rounded-md p-4">
      <h3 className="border-b border-[#E5E7EB] pb-3 text-base font-semibold text-[#1F2937]">
        <span>{group.domain} (Avg: {formatScore(group.score)})</span>
      </h3>
      <div className="mt-3 grid gap-3">
        {group.items.map((item) => (
          <div key={item.name}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-[#374151]">{item.name}</span>
              <span className="font-semibold tabular-nums text-[#4A6FA5]">{formatScore(item.score)}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div className="h-full rounded-full bg-[#CBD5E1]" style={{ width: `${item.score * 10}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

<div className="mt-5 grid gap-3 text-sm leading-6 text-[#374151] sm:grid-cols-2">
  <div className="rounded-md border border-[#E5E7EB] bg-white/60 p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Strongest</p>
    <p className="mt-2 text-base font-semibold text-[#1F2937]">{results.highest.name}</p>
  </div>
  <div className="rounded-md border border-[#E5E7EB] bg-white/60 p-4">
    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Growth area</p>
    <p className="mt-2 text-base font-semibold text-[#1F2937]">{results.lowest.name}</p>
  </div>
  <p className="rounded-md border border-[#E5E7EB] bg-white/60 p-4 text-[#6B7280] sm:col-span-2">
    This area may be affecting clarity, stability, or alignment.
  </p>
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

function sentenceLines(text) {
  return text.match(/[^.!?]+[.!?]+/g)?.map((line) => line.trim()) || [text];
}

function calculateCheckInStreak(history) {
  if (!history.length) return 0;
  const chronological = sortHistoryNewestFirst(history).reverse();
  let streak = 1;
  for (let index = chronological.length - 1; index > 0; index -= 1) {
    const currentDate = new Date(chronological[index].created_at || chronological[index].dateCompleted || chronological[index].timestamp);
    const previousDate = new Date(chronological[index - 1].created_at || chronological[index - 1].dateCompleted || chronological[index - 1].timestamp);
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
  const orderedHistory = sortHistoryNewestFirst(history);
  const current = orderedHistory[0];
  const previous = orderedHistory[1];
  const first = orderedHistory[orderedHistory.length - 1];
  const currentTotal = current?.overallScore ?? current?.total ?? 0;
  const previousTotal = previous ? previous.overallScore ?? previous.total : 0;
  const firstTotal = first?.overallScore ?? first?.total ?? 0;
  const completedDate = current ? new Date(current.created_at || current.dateCompleted || current.timestamp) : null;
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
    <h2 className="serif text-2xl font-semibold text-[#1F2937]">Your Progress Over Time</h2>
    {current && (
      <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div className="rounded-md border border-[#E5E7EB] bg-white/60 p-4 text-[#374151]">
          Next suggested check-in: <span className="font-semibold text-[#4A6FA5]">{formatDisplayDate(nextCheckInDate)}</span>
        </div>
        <div className="rounded-md border border-[#E5E7EB] bg-white/60 p-4 text-[#374151]">
          Days since last check-in: <span className="font-semibold text-[#4A6FA5]">{daysSinceLastCheckIn}</span>
        </div>
      </div>
    )}
    <p className="mt-4 text-base leading-8 text-[#374151]">{returnMessage}</p>
    <div className="mt-4 grid gap-2">
      {orderedHistory.map((entry, index) => (
        <div key={entry.id || `${entry.created_at}-${index}`} className="flex items-center justify-between gap-4 rounded-md border border-[#E5E7EB] bg-white/60 px-4 py-3 text-sm">
          <span className="text-[#374151]">{formatDisplayDate(new Date(entry.created_at || entry.dateCompleted || entry.timestamp))}</span>
          <span className="font-semibold tabular-nums text-[#4A6FA5]">{formatScore(entry.overallScore ?? entry.total)}</span>
        </div>
      ))}
    </div>
    {orderedHistory.length <= 1 ? (
      <div className="mt-3 space-y-3 text-base leading-8 text-[#374151]">
        <p>This is your starting point.</p>
        <p>Return in 30 days to complete another check-in and see how your alignment changes over time.</p>
      </div>
    ) : (
      <div className="mt-4 space-y-5">
        <div className="grid gap-3 text-sm sm:grid-cols-3">
          <div className="soft-panel rounded-md p-4">
            <div className="font-semibold text-[#1F2937]">First check-in</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-[#4A6FA5]">{formatScore(firstTotal)}</div>
          </div>
          <div className="soft-panel rounded-md p-4">
            <div className="font-semibold text-[#1F2937]">Previous check-in</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-[#4A6FA5]">{formatScore(previousTotal)}</div>
          </div>
          <div className="soft-panel rounded-md p-4">
            <div className="font-semibold text-[#1F2937]">Current check-in</div>
            <div className="mt-1 text-2xl font-semibold tabular-nums text-[#4A6FA5]">{formatScore(currentTotal)}</div>
          </div>
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div className="rounded-md border border-[#E5E7EB] bg-white/60 p-4 text-[#374151]">
            Change since last check-in: <span className="font-semibold text-[#4A6FA5]">{formatChange(currentTotal - previousTotal)}</span>
            <span className="ml-2 text-[#6B7280]">{trendLabel(currentTotal - previousTotal)}</span>
          </div>
          <div className="rounded-md border border-[#E5E7EB] bg-white/60 p-4 text-[#374151]">
            Change since first check-in: <span className="font-semibold text-[#4A6FA5]">{formatChange(currentTotal - firstTotal)}</span>
            <span className="ml-2 text-[#6B7280]">{trendLabel(currentTotal - firstTotal)}</span>
          </div>
        </div>
        <p className="text-base leading-8 text-[#374151]">{identityProgressLanguage}</p>
        <p className="text-base leading-8 text-[#374151]">{trendInsight}</p>
        <div className="rounded-md border border-[#E5E7EB] bg-white/60 p-4">
          <div className="text-sm font-semibold text-[#1F2937]">Category trend</div>
          <div className="mt-3 grid gap-2 text-sm text-[#374151]">
            {categoryChanges.map((item) => (
              <div key={item.category} className="flex justify-between gap-4">
                <span>{item.label}</span>
                <span className="tabular-nums">{formatScore(item.previous)} to {formatScore(item.current)}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm leading-6 text-[#6B7280]">
            {mostImproved && mostImproved.change > 0
              ? `Most improved area: ${mostImproved.label} (${formatChange(mostImproved.change)})`
              : "No area increased since your last check-in. Choose one small step and return to it consistently."}
          </p>
          {largestDecline && largestDecline.change < 0 && (
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">
              Largest decline: {largestDecline.label} ({formatChange(largestDecline.change)})
            </p>
          )}
        </div>
      </div>
    )}
    <div className="mt-5 space-y-3 text-sm leading-6 text-[#6B7280]">
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
      className="rounded-md border border-[#E5E7EB] bg-white/70 px-4 py-2 text-sm font-semibold text-[#374151] shadow-sm"
    >
      Clear History
    </button>
  </div>
</div>
    </section>
  );
}

function CheckInPage({ history, onStartNewCheckIn }) {
  const recentHistory = sortHistoryNewestFirst(history);
  const latest = recentHistory[0];
  const completedDate = latest ? new Date(latest.created_at || latest.dateCompleted || latest.timestamp) : null;
  const nextCheckInDate = completedDate ? addDays(completedDate, 30) : null;
  const daysSinceLastCheckIn = completedDate ? daysBetween(completedDate, new Date()) : 0;
  const returnMessage =
    daysSinceLastCheckIn >= 30
      ? "It may be time for another check-in. Retake the assessment to see what has changed."
      : "Use this time to practice your next step and notice what changes.";

  return (
    <main className="page-shell">
      <section className="glass-panel rounded-md p-6 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="eyebrow mb-4">Check-In</p>
            <h1 className="serif text-4xl font-semibold text-[#1F2937] sm:text-5xl">
              {latest ? "Your next check-in" : "Start your first check-in"}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#374151]">
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
            <div className="text-sm font-semibold text-[#1F2937]">Last check-in</div>
            <div className="mt-2 text-base text-[#374151]">{formatDisplayDate(completedDate)}</div>
          </div>
          <div className="soft-panel rounded-md p-4">
            <div className="text-sm font-semibold text-[#1F2937]">Last score</div>
            <div className="mt-1 text-3xl font-semibold tabular-nums text-[#4A6FA5]">{formatScore(latest.total)}</div>
          </div>
          <div className="soft-panel rounded-md p-4">
            <div className="text-sm font-semibold text-[#1F2937]">Next suggested</div>
            <div className="mt-2 text-base text-[#374151]">{formatDisplayDate(nextCheckInDate)}</div>
          </div>
          <div className="soft-panel rounded-md p-4">
            <div className="text-sm font-semibold text-[#1F2937]">Days since</div>
            <div className="mt-1 text-3xl font-semibold tabular-nums text-[#4A6FA5]">{daysSinceLastCheckIn}</div>
          </div>
        </section>
      )}

      <section className="glass-panel mt-6 rounded-md p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="serif text-2xl font-semibold text-[#1F2937]">Check-in history</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">Suggested rhythm: once per month.</p>
          </div>
        </div>

        {recentHistory.length ? (
          <div className="mt-5 grid gap-3">
            {recentHistory.map((entry, index) => (
              <article key={entry.id || `${entry.dateCompleted}-${index}`} className="soft-panel rounded-md p-4 transition hover:-translate-y-0.5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="font-semibold text-[#1F2937]">{formatDisplayDate(new Date(entry.dateCompleted || entry.timestamp))}</div>
                    <div className="mt-1 text-sm text-[#6B7280]">Lowest area: {domainMeta[entry.lowestCategory]?.label || "Not recorded"}</div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-center text-sm sm:min-w-[360px]">
                    <div><div className="font-semibold text-[#4A6FA5]">{formatScore(entry.total)}</div><div className="text-xs text-[#6B7280]">Total</div></div>
                    <div><div className="font-semibold text-[#4A6FA5]">{formatScore(entry.spirit)}</div><div className="text-xs text-[#6B7280]">Spirit</div></div>
                    <div><div className="font-semibold text-[#4A6FA5]">{formatScore(entry.soul)}</div><div className="text-xs text-[#6B7280]">Soul</div></div>
                    <div><div className="font-semibold text-[#4A6FA5]">{formatScore(entry.body)}</div><div className="text-xs text-[#6B7280]">Body</div></div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="soft-panel mt-5 rounded-md p-5 text-sm leading-6 text-[#374151]">
            No check-ins yet. Complete the assessment to create your first entry.
          </div>
        )}
      </section>
    </main>
  );
}

function ProgressPage({ user }) {
  const [entries, setEntries] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let active = true;

    async function fetchRecentResults() {
      if (!supabase || !user?.id) {
        if (active) {
          setEntries([]);
          setStatus("ready");
        }
        return;
      }

      setStatus("loading");
      const { data, error } = await supabase
        .from("results")
        .select("id,user_id,alignment_score,spirit_score,soul_score,body_score,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      if (!active) return;

      if (error) {
        console.error("Unable to fetch recent progress results.", error);
        setEntries([]);
        setStatus("error");
        return;
      }

      setEntries((data || []).map(normalizeResultRow));
      setStatus("ready");
    }

    fetchRecentResults();

    return () => {
      active = false;
    };
  }, [user?.id]);

  const current = entries[0];
  const previous = entries[1];
  const scoreDifference = current && previous ? current.total - previous.total : null;

  return (
    <main className="page-shell">
      <section className="glass-panel rounded-md p-6 sm:p-8">
        <p className="eyebrow mb-4">Progress</p>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h1 className="serif text-4xl font-semibold text-[#1F2937] sm:text-5xl">Your recent check-ins</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-[#6B7280]">
              A simple view of your last three completed assessments.
            </p>
          </div>
          {scoreDifference !== null && (
            <div className="soft-panel rounded-md p-4 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Since previous</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-[#4A6FA5]">{formatChange(scoreDifference)}</p>
            </div>
          )}
        </div>
      </section>

      <section className="glass-panel mt-6 rounded-md p-5 sm:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="serif text-2xl font-semibold text-[#1F2937]">Last 3 assessments</h2>
            <p className="mt-2 text-sm leading-6 text-[#6B7280]">No charts yet. Just the essentials.</p>
          </div>
          {scoreDifference !== null && (
            <p className="text-sm font-medium text-[#374151]">
              Most recent vs previous: <span className="font-semibold text-[#4A6FA5]">{formatChange(scoreDifference)}</span>
            </p>
          )}
        </div>

        {status === "loading" && (
          <div className="soft-panel mt-5 rounded-md p-5 text-sm leading-6 text-[#6B7280]">
            Loading your progress...
          </div>
        )}

        {status === "error" && (
          <div className="soft-panel mt-5 rounded-md p-5 text-sm leading-6 text-[#6B7280]">
            Progress could not be loaded yet.
          </div>
        )}

        {status === "ready" && !entries.length && (
          <div className="soft-panel mt-5 rounded-md p-5 text-sm leading-6 text-[#374151]">
            No completed assessments yet. Finish an assessment to start tracking progress.
          </div>
        )}

        {status === "ready" && entries.length > 0 && (
          <div className="mt-5 grid gap-3">
            {entries.map((entry, index) => (
              <article key={entry.id || `${entry.created_at}-${index}`} className="soft-panel rounded-md p-4">
                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-semibold text-[#1F2937]">
                      {formatDisplayDate(new Date(entry.created_at || entry.dateCompleted || entry.timestamp))}
                    </p>
                    <p className="mt-1 text-sm text-[#6B7280]">
                      Overall score: <span className="font-semibold tabular-nums text-[#4A6FA5]">{formatScore(entry.total)}</span>
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center text-sm md:min-w-[300px]">
                    <div>
                      <div className="font-semibold tabular-nums text-[#1F2937]">{formatScore(entry.spirit)}</div>
                      <div className="text-xs text-[#6B7280]">Spirit</div>
                    </div>
                    <div>
                      <div className="font-semibold tabular-nums text-[#1F2937]">{formatScore(entry.soul)}</div>
                      <div className="text-xs text-[#6B7280]">Soul</div>
                    </div>
                    <div>
                      <div className="font-semibold tabular-nums text-[#1F2937]">{formatScore(entry.body)}</div>
                      <div className="text-xs text-[#6B7280]">Body</div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {status === "ready" && entries.length === 1 && (
          <p className="mt-4 text-sm leading-6 text-[#6B7280]">
            Complete another assessment to compare your most recent score with the previous one.
          </p>
        )}
      </section>
    </main>
  );
}

function AlignmentJournalSection() {
  return (
    <section className="glass-panel mt-6 rounded-md p-5 sm:p-6">
      <div className="max-w-2xl">
        <p className="eyebrow mb-3">Reflection</p>
        <h2 className="serif text-2xl font-semibold text-[#1F2937]">Begin Your Alignment Work</h2>
        <p className="mt-3 text-base leading-7 text-[#374151]">
          "What action have you been avoiding that you know is right?"
        </p>
      </div>
      <div className="mt-5 grid gap-4">
        <textarea
          rows={5}
          className="w-full rounded-md border border-[#E5E7EB] bg-white/80 px-4 py-3 text-sm leading-6 text-[#1F2937] shadow-sm outline-none transition focus:border-[#4A6FA5] focus:ring-2 focus:ring-[#CBD5E1]"
          placeholder="Write your reflection here..."
        />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <button
            type="button"
            className="gold-button rounded-md px-5 py-3 text-sm font-semibold text-white"
          >
            Save Reflection
          </button>
        </div>
      </div>
    </section>
  );
}

function ResultsPage({ answers, setPage, assessmentComplete, history, onClearHistory, onStartNewCheckIn, saveStatus, user }) {
  const scores = assessmentComplete ? scoreAnswers(answers) : null;
  const visualScores = scores;
  const subcategoryResults = assessmentComplete ? scoreSubcategories(answers) : null;
  const alignmentLevel = scores && alignmentLevelFor(scores.total);
  const alignmentSentence = scores && alignmentSentenceFor(scores.total);
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
    spirit: "Set aside five quiet minutes to pray and return your attention to God.",
    soul: "Pause today and name one thought or emotion that needs to be brought into truth.",
    body: "Choose one small action today and follow through on it.",
  };
  const nextStep = lowestCategory && nextSteps[lowestCategory];
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
          <h1 className="serif text-3xl font-semibold text-[#1F2937] sm:text-4xl">Results are not ready yet</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#374151]">
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
          <h1 className="serif text-3xl font-semibold text-[#1F2937] sm:text-4xl">Your alignment reflection</h1>
        </div>
        <p className="max-w-xl text-sm leading-6 text-[#6B7280]">A calm view of what your completed assessment reflects.</p>
      </div>

      {saveStatus && (
        <div className="mb-6 rounded-md border border-[#E5E7EB] bg-white/65 px-4 py-3 text-sm font-semibold text-[#374151]">
          {saveStatus === "saved"
            ? "Results saved for this check-in."
            : "Your results are connected to your account."}
        </div>
      )}

      <section className="glass-panel rounded-md p-5 sm:p-6">
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4A6FA5]">Alignment Score</div>
            <div className="mt-2 flex items-end gap-3">
              <span className="text-6xl font-semibold tabular-nums text-[#1F2937]">{formatScore(scores.total)}</span>
              <span className="pb-2 text-xl font-medium text-[#6B7280]">/ 10</span>
            </div>
            <p className="mt-3 text-base font-medium leading-7 text-[#374151]">{alignmentSentence}</p>
            <div className="mt-4 grid max-w-2xl gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-md border border-[#E5E7EB] bg-white/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Level</p>
                <p className="mt-1 font-semibold text-[#1F2937]">{alignmentLevel}</p>
              </div>
              <div className="rounded-md border border-[#E5E7EB] bg-white/60 p-3">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">Meaning</p>
                <p className="mt-1 font-semibold text-[#374151]">These results reflect your current alignment.</p>
              </div>
            </div>
          </div>
          <div className="soft-panel rounded-md px-6 py-5 text-left md:min-w-[220px]">
            <div className="text-sm font-semibold uppercase tracking-[0.16em] text-[#4A6FA5]">Resistance</div>
            <div className="mt-2 text-4xl font-semibold tabular-nums text-[#1F2937]">{formatScore(scores.resistance)}</div>
            <div className="mt-2 text-sm font-semibold text-[#6B7280]">{resistanceLevel}</div>
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
            <h2 className="serif text-2xl font-semibold text-[#1F2937]">Key Insight</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="soft-panel rounded-md border-l-4 border-l-[#CBD5E1] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Strongest area</p>
                <p className="mt-2 text-xl font-semibold text-[#1F2937]">{subcategoryResults.highest.name}</p>
              </div>
              <div className="soft-panel rounded-md border-l-4 border-l-[#4A6FA5] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Weakest area</p>
                <p className="mt-2 text-xl font-semibold text-[#1F2937]">{subcategoryResults.lowest.name}</p>
              </div>
            </div>
          </section>

          <section className="glass-panel rounded-md p-5 sm:p-6">
            <h2 className="serif text-2xl font-semibold text-[#1F2937]">Next Step</h2>
            <div className="mt-4 grid gap-3">
              <div className="soft-panel rounded-md p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Focus</p>
                <p className="mt-2 text-xl font-semibold text-[#1F2937]">{domainMeta[lowestCategory].label}</p>
              </div>
              <div className="rounded-md border border-[#E5E7EB] bg-white/65 p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Action</p>
                <p className="mt-2 text-lg font-semibold leading-7 text-[#1F2937]">{nextStep}</p>
              </div>
            </div>
          </section>
        </div>

        <section className="glass-panel flex flex-col items-center rounded-md p-5 sm:p-6">
          <div className="mb-3 text-center">
            <p className="eyebrow">Structure</p>
            <h2 className="serif mt-2 text-2xl font-semibold text-[#1F2937]">Your Structure</h2>
          </div>
          <EtytomicVisual scores={visualScores} compact />
        </section>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <SubcategoryResults results={subcategoryResults} />
        <section className="glass-panel rounded-md p-5 sm:p-6">
          <h2 className="serif text-2xl font-semibold text-[#1F2937]">Details</h2>
          <div className="mt-4 grid gap-3 text-sm leading-6 text-[#374151]">
            <div className="soft-panel rounded-md p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Focus</p>
              <p className="mt-2">{focusArea?.[1]}</p>
            </div>
            <div className="soft-panel rounded-md p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Summary</p>
              <div className="mt-2 grid gap-2">
                {sentenceLines(summaryInsight).map((line) => (
                  <p key={line} className="rounded-md bg-white/45 px-3 py-2">{line}</p>
                ))}
              </div>
            </div>
            <div className="soft-panel rounded-md p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6B7280]">Growth</p>
              <div className="mt-2 grid gap-2">
                {(growthPath.explanationLines || sentenceLines(growthPath.explanation)).map((line) => (
                  <p key={line} className="rounded-md bg-white/45 px-3 py-2">{line}</p>
                ))}
              </div>
            </div>
            {scores.spirit >= 7 && (
              <p className="rounded-md border border-[#E5E7EB] bg-white/55 px-4 py-3 text-xs leading-5 text-[#6B7280]">
                A strong spirit reflects Christ. Even in imperfect circumstances, His light becomes visible through you.
              </p>
            )}
          </div>
        </section>
      </section>

      <AlignmentJournalSection />

      <details className="glass-panel mt-6 rounded-md p-5 sm:p-6">
        <summary className="cursor-pointer serif text-xl font-semibold text-[#1F2937]">Progress over time</summary>
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
          className="rounded-md border border-[#E5E7EB] bg-white/70 px-5 py-3 text-sm font-semibold text-[#374151] shadow-sm"
        >
          Check In Later
        </button>
      </section>
    </main>
  );
}

function AuthenticatedStartPage({ setPage }) {
  return (
    <main className="page-shell">
      <section className="glass-panel rounded-md p-8 text-center sm:p-12">
        <p className="eyebrow mb-4">Welcome</p>
        <h1 className="serif text-4xl font-semibold text-[#1F2937] sm:text-5xl">
          Begin your alignment check-in.
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-[#374151]">
          Take the alignment assessment to begin.
        </p>
        <button
          onClick={() => setPage("assessment")}
          className="gold-button mt-8 rounded-md px-6 py-3 text-sm font-semibold text-white"
        >
          Start Assessment
        </button>
      </section>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [page, setPage] = useState("start");
  const [answers, setAnswers] = useState({});
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [history, setHistory] = useState(loadAssessmentHistory);
  const [assessmentRunId, setAssessmentRunId] = useState(0);
  const [saveStatus, setSaveStatus] = useState(null);

  async function fetchSupabaseResults(userId) {
    if (!supabase || !userId) return;

    const { data, error } = await supabase
      .from("results")
      .select("id,user_id,alignment_score,spirit_score,soul_score,body_score,created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Unable to fetch Supabase results.", error);
      return;
    }

    setHistory((data || []).map(normalizeResultRow));
  }

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return undefined;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      const sessionUser = data.session?.user || null;
      setUser(sessionUser);
      if (sessionUser) {
        setPage("start");
        fetchSupabaseResults(sessionUser.id);
      }
      setAuthLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user && event === "SIGNED_IN") {
        setPage("start");
        fetchSupabaseResults(session.user.id);
      }
      if (!session?.user) {
        setHistory([]);
      }
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  async function saveCompletedAssessment() {
    setSaveStatus(null);
    const scores = scoreAnswers(answers);
    const subcategoryResults = scoreSubcategories(answers);
    const entry = createHistoryEntry(scores, subcategoryResults);

    if (!supabase || !user?.id) {
      setHistory((current) => {
const updated = sortHistoryNewestFirst([normalizeResultRow(entry), ...current]);
persistAssessmentHistory(updated);
return updated;
      });
      setSaveStatus("failed");
      return;
    }

    const { data, error } = await supabase.from("results").insert({
      user_id: user.id,
      alignment_score: scores.total,
      spirit_score: scores.spirit,
      soul_score: scores.soul,
      body_score: scores.body,
    }).select("id,user_id,alignment_score,spirit_score,soul_score,body_score,created_at").single();

    if (error) {
      console.error("Supabase results insert failed.", error);
      setHistory((current) => sortHistoryNewestFirst([normalizeResultRow(entry), ...current]));
      setSaveStatus("failed");
      return;
    }

    if (data) {
      setHistory((current) => sortHistoryNewestFirst([normalizeResultRow(data), ...current]));
      setSaveStatus("saved");
    } else {
      fetchSupabaseResults(user.id);
      setSaveStatus("saved");
    }
  }

  async function clearHistory() {
    if (!window.confirm("Clear saved assessment history? Your current answers will stay on this page.")) return;
    if (supabase && user?.id) {
      const { error } = await supabase.from("results").delete().eq("user_id", user.id);
      if (error) {
        console.error("Unable to clear Supabase results.", error);
        return;
      }
    }
    window.localStorage.removeItem(historyStorageKey);
    setHistory([]);
  }

  function startNewCheckIn() {
    setAnswers({});
    setAssessmentComplete(false);
    setSaveStatus(null);
    setAssessmentRunId((current) => current + 1);
    setPage("assessment");
  }

  function handleAuthSuccess(nextUser) {
    setUser(nextUser);
    setPage("start");
  }

  async function handleLogout() {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSaveStatus(null);
    setPage("welcome");
  }

  if (authLoading) {
    return (
      <>
        <main className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
          <section className="glass-panel rounded-md p-8 text-center">
            <h1 className="serif text-3xl font-semibold text-[#1F2937]">Etytomic Alignment</h1>
            <p className="mt-4 text-base leading-7 text-[#374151]">Preparing your account session...</p>
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
{page === "start" && <AuthenticatedStartPage setPage={setPage} />}
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
    saveStatus={saveStatus}
    user={user}
  />
)}
{page === "progress" && <ProgressPage user={user} />}
{page === "checkin" && <CheckInPage history={history} onStartNewCheckIn={startNewCheckIn} />}
{["terms", "privacy", "disclaimer"].includes(page) && <LegalPage type={page} />}
<Footer setPage={setPage} />
    </>
  );
}



export default App;
