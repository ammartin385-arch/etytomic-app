export const beatitudeGuidanceProfiles = {
  "Poor in spirit": {
    reflectionTone: "dependent and honest",
    growthDirection: "Return to God before trying to force clarity. Begin with prayer, stillness, and a willingness to receive direction.",
    action: "Set aside five quiet minutes to pray and name what you are carrying.",
    promptCategory: "Prayer/reflection",
  },
  "Hunger and thirst for righteousness": {
    reflectionTone: "clear and action-oriented",
    growthDirection: "Let the next right action become simple and visible. Alignment strengthens when conviction becomes obedience, and John 8:12 frames this as following Christ into the light of life.",
    action: "Choose one right action today and complete it without delay.",
    promptCategory: "Small action for growth",
  },
  Peacemakers: {
    reflectionTone: "steady and reconciling",
    growthDirection: "Move toward peace without avoiding truth. Reduce unnecessary tension through calm, faithful action.",
    action: "Take one calm step toward peace in a relationship or responsibility.",
    promptCategory: "Beatitude reflection",
  },
  "Pure in heart": {
    reflectionTone: "clear and inwardly honest",
    growthDirection: "Notice what is dividing attention or clouding truth. John 1:1-5 grounds clarity in Christ as the Word, life, and light; growth begins with inward honesty before outward change.",
    action: "Name one distraction or divided motive and bring it back to truth.",
    promptCategory: "What am I noticing?",
  },
  Merciful: {
    reflectionTone: "patient and generous",
    growthDirection: "Let mercy shape the next response. Alignment deepens when truth and compassion move together.",
    action: "Choose patience in one interaction today.",
    promptCategory: "Where is resistance showing up?",
  },
  Meekness: {
    reflectionTone: "surrendered and steady",
    growthDirection: "Practice strength under God rather than control through reaction. Let steadiness lead the response.",
    action: "Pause before reacting and choose a surrendered response.",
    promptCategory: "Prayer/reflection",
  },
  "Perseverance under resistance": {
    reflectionTone: "grounded and resilient",
    growthDirection: "Begin again without shame. Resistance is not identity; it shows where faithful attention is needed.",
    action: "Take one faithful step in the area that feels most resisted.",
    promptCategory: "Today’s next step",
  },
};

const labels = {
  spirit: "Spirit",
  soul: "Soul",
  body: "Body",
};

const nextSteps = {
  spirit: "Set aside five quiet minutes to pray, read Scripture, or return your attention to God.",
  soul: "Pause today and name one thought or emotion that needs to be brought back to truth.",
  body: "Choose one small action today and follow through on it.",
};

function clampScore(value) {
  return Math.max(0, Math.min(10, Number(value) || 0));
}

function getTrend(current, previous) {
  if (!previous) return "new";
  const change = clampScore(current.total) - clampScore(previous.total ?? previous.overallScore ?? previous.alignment_score);
  if (change > 0.15) return "improving";
  if (change < -0.15) return "declining";
  return "steady";
}

function getLargestImbalance(results) {
  const values = [
    ["spirit", clampScore(results?.spirit)],
    ["soul", clampScore(results?.soul)],
    ["body", clampScore(results?.body)],
  ];
  const highest = values.reduce((best, item) => (item[1] > best[1] ? item : best), values[0]);
  const lowest = values.reduce((best, item) => (item[1] < best[1] ? item : best), values[0]);
  return {
    highest: highest[0],
    lowest: lowest[0],
    spread: highest[1] - lowest[1],
  };
}

export function generateDynamicGrowthGuidance({
  results,
  subResults,
  beatitudeTheme,
  history = [],
} = {}) {
  const total = clampScore(results?.total ?? results?.overallScore);
  const resistance = clampScore(results?.resistance ?? 10 - total);
  const weakest = results?.lowestCategory || subResults?.lowest?.category || getLargestImbalance(results || {}).lowest || "body";
  const strongest = subResults?.highest?.category || getLargestImbalance(results || {}).highest || "spirit";
  const lowestSubcategory = subResults?.lowest?.name || labels[weakest];
  const themeTitle = beatitudeTheme?.title || "Poor in spirit";
  const theme = beatitudeGuidanceProfiles[themeTitle] || beatitudeGuidanceProfiles["Poor in spirit"];
  const previous = history?.[1] || null;
  const trend = getTrend(results || {}, previous);
  const imbalance = getLargestImbalance(results || {});

  let alignmentSummary =
    total >= 7
      ? "Your alignment is showing meaningful strength, with room to keep the center steady."
      : total >= 4
        ? "Your results show both alignment and resistance. Growth will come through steady attention, not pressure."
        : "Your current alignment is limited, but this is a starting point for return, clarity, and growth.";

  if (weakest === "spirit" && resistance >= 5) {
    alignmentSummary = "Resistance is most connected to the center right now. Begin with stillness, prayer, Scripture, and surrender before trying to correct everything outwardly.";
  } else if (strongest === "body" && weakest !== "body") {
    alignmentSummary = "Your outward action may be stronger than your inner alignment. Growth will come from returning performance, emotion, and thought back toward the center.";
  } else if (weakest === "soul") {
    alignmentSummary = "Your inner life is asking for steadiness. Growth will come through renewed thinking, honest identity, and emotional clarity.";
  }

  if (trend === "improving") {
    alignmentSummary += " Your recent movement is encouraging; keep practicing what is bringing you back into alignment.";
  } else if (trend === "declining") {
    alignmentSummary += " This does not define you; it shows where attention needs to return without shame.";
  } else if (trend === "steady") {
    alignmentSummary += " A steady pattern can still hold hidden growth, but it may need a more intentional next step.";
  }

  const growthFocus =
    imbalance.spread >= 2
      ? `${labels[weakest]} is carrying the greatest resistance compared with ${labels[strongest]}. Focus there first.`
      : `${labels[weakest]} is the clearest focus area for this check-in.`;

  const resistanceInsight =
    resistance >= 6
      ? "Resistance is high enough to notice clearly. Treat it as a signal to return attention to the center, not as a verdict."
      : resistance >= 3
        ? "Resistance is present, but workable. Small faithful steps will matter more than intensity."
        : "Resistance is low. Protect the practices that are keeping alignment clear.";

  return {
    alignmentSummary,
    growthFocus,
    resistanceInsight,
    suggestedNextStep: theme.action || nextSteps[weakest],
    reflectionTone: trend === "declining" ? "grounding and corrective without shame" : theme.reflectionTone,
    recommendedPromptCategory: theme.promptCategory,
    growthDirection: theme.growthDirection,
    weakestArea: labels[weakest],
    strongestArea: labels[strongest],
    lowestSubcategory,
    largestImbalance: imbalance,
    trend,
  };
}
