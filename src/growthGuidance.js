export const beatitudeGuidanceProfiles = {
  "Poor in spirit": {
    scriptureReference: "Matthew 5:3",
    scripture: "Blessed are the poor in spirit, for theirs is the kingdom of heaven.",
    meaning:
      "This begins with dependence. It is the posture of admitting need instead of trying to force strength or prove control.",
    whyThisTheme:
      "When connection to God is weak, the rest of the structure can still look active while losing its source of order.",
    beginnerHint:
      "Start by asking where you are carrying something without God. The goal is not to perform better, but to return to the center.",
    reflectionTone: "dependent and honest",
    growthDirection:
      "Return to God before trying to force clarity. Begin with prayer, stillness, and a willingness to receive direction.",
    action: "Set aside five quiet minutes to pray and name what you are carrying.",
    promptCategory: "Prayer/reflection",
  },
  "Those who mourn": {
    scriptureReference: "Matthew 5:4",
    scripture: "Blessed are those who mourn, for they shall be comforted.",
    meaning:
      "This is honest sorrow over what is broken, hidden, or misaligned. It makes room for comfort because it stops pretending.",
    whyThisTheme:
      "When emotional steadiness is strained, growth often begins by naming what is actually happening before reacting to it.",
    beginnerHint:
      "Ask what you have been rushing past, minimizing, or carrying alone. Bring it into prayer without dressing it up.",
    reflectionTone: "honest and gentle",
    growthDirection:
      "Let what is unsettled come into the light. Honest grief can become a doorway to steadiness and comfort.",
    action: "Name one burden honestly before God instead of pushing it away.",
    promptCategory: "What am I noticing?",
  },
  Meekness: {
    scriptureReference: "Matthew 5:5",
    scripture: "Blessed are the meek, for they shall inherit the earth.",
    meaning:
      "Meekness is strength under God. It is not passivity. It is choosing surrender over control, reaction, or self-protection.",
    whyThisTheme:
      "When surrender, humility, or self-control is the growth edge, the issue is often not effort, but who is governing the response.",
    beginnerHint:
      "Watch the moment you want to control the outcome. That moment is often where surrender begins.",
    reflectionTone: "surrendered and steady",
    growthDirection:
      "Practice strength under God rather than control through reaction. Let steadiness lead the response.",
    action: "Pause before reacting and choose a surrendered response.",
    promptCategory: "Prayer/reflection",
  },
  "Hunger and thirst for righteousness": {
    scriptureReference: "Matthew 5:6",
    scripture: "Blessed are those who hunger and thirst for righteousness, for they shall be filled.",
    meaning:
      "This is desire pointed toward what is right. It moves beyond wanting relief and begins wanting alignment with God.",
    whyThisTheme:
      "When discipline, physical stewardship, conviction, or right action needs growth, desire must become obedient movement.",
    beginnerHint:
      "Ask what right action is already clear. Growth usually begins with the next faithful step, not the whole future plan.",
    reflectionTone: "clear and action-oriented",
    growthDirection:
      "Let the next right action become simple and visible. Alignment strengthens when conviction becomes obedience.",
    action: "Choose one right action today and complete it without delay.",
    promptCategory: "Small action for growth",
  },
  Merciful: {
    scriptureReference: "Matthew 5:7",
    scripture: "Blessed are the merciful, for they shall receive mercy.",
    meaning:
      "Mercy keeps truth from becoming harsh and keeps compassion from becoming avoidance. It is love moving with clarity.",
    whyThisTheme:
      "When relational resistance is present, mercy helps reduce resentment, comparison, and unnecessary division.",
    beginnerHint:
      "Ask where you are withholding patience, forgiveness, or generosity while still staying truthful.",
    reflectionTone: "patient and generous",
    growthDirection:
      "Let mercy shape the next response. Alignment deepens when truth and compassion move together.",
    action: "Choose patience in one interaction today.",
    promptCategory: "Where is resistance showing up?",
  },
  "Pure in heart": {
    scriptureReference: "Matthew 5:8",
    scripture: "Blessed are the pure in heart, for they shall see God.",
    meaning:
      "Purity of heart is undivided attention. It asks what is shaping thought, desire, identity, and motive beneath the surface.",
    whyThisTheme:
      "When thought life or identity is the growth edge, clarity comes from bringing the inner life back into truth.",
    beginnerHint:
      "Ask what has been dividing your attention or shaping your identity more than God’s truth.",
    reflectionTone: "clear and inwardly honest",
    growthDirection:
      "Notice what is dividing attention or clouding truth. Growth begins with inward honesty before outward change.",
    action: "Name one distraction or divided motive and bring it back to truth.",
    promptCategory: "What am I noticing?",
  },
  Peacemakers: {
    scriptureReference: "Matthew 5:9",
    scripture: "Blessed are the peacemakers, for they shall be called sons of God.",
    meaning:
      "Peacemaking is not avoiding tension. It is moving toward wholeness with truth, humility, and courage.",
    whyThisTheme:
      "When relationships are the growth area, alignment is practiced through the way you respond to tension and people.",
    beginnerHint:
      "Ask where peace requires a faithful response, a truthful conversation, forgiveness, or wise distance.",
    reflectionTone: "steady and reconciling",
    growthDirection:
      "Move toward peace without avoiding truth. Reduce unnecessary tension through calm, faithful action.",
    action: "Take one calm step toward peace in a relationship or responsibility.",
    promptCategory: "Beatitude reflection",
  },
  "Perseverance under resistance": {
    scriptureReference: "Matthew 5:10-12",
    scripture:
      "Blessed are those who are persecuted for righteousness' sake, for theirs is the kingdom of heaven.",
    meaning:
      "This theme names endurance when doing what is right costs something. It teaches faithful continuation under pressure.",
    whyThisTheme:
      "When resistance is high, growth is not about shame. It is about returning to the light and taking the next faithful step.",
    beginnerHint:
      "Ask where resistance has been loudest and what faithful step is still available today.",
    reflectionTone: "grounded and resilient",
    growthDirection:
      "Begin again without shame. Resistance is not identity. It shows where faithful attention is needed.",
    action: "Take one faithful step in the area that feels most resisted.",
    promptCategory: "Today’s next step",
  },
};

export const subcategoryBeatitudeMap = {
  "Connection to God": "Poor in spirit",
  Conviction: "Perseverance under resistance",
  "Desire for Righteousness": "Hunger and thirst for righteousness",
  Surrender: "Meekness",
  "Thought Life": "Pure in heart",
  "Emotional Stability": "Those who mourn",
  "Identity and Humility": "Meekness",
  Relationships: "Peacemakers",
  "Physical Health": "Hunger and thirst for righteousness",
  Discipline: "Hunger and thirst for righteousness",
  "Self-Control": "Meekness",
};

const categoryFallbackThemes = {
  spirit: "Poor in spirit",
  soul: "Pure in heart",
  body: "Hunger and thirst for righteousness",
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

export function getBeatitudeThemeForSubcategory(subcategoryName, categoryName) {
  return subcategoryBeatitudeMap[subcategoryName] || categoryFallbackThemes[categoryName] || "Poor in spirit";
}

export function generateDynamicGrowthGuidance({
  results,
  subResults,
  beatitudeTheme,
  history = [],
} = {}) {
  const total = clampScore(results?.total ?? results?.overallScore);
  const resistance = clampScore(results?.resistance ?? 10 - total);
  const imbalance = getLargestImbalance(results || {});
  const weakest = results?.lowestCategory || subResults?.lowest?.category || imbalance.lowest || "body";
  const strongest = subResults?.highest?.category || imbalance.highest || "spirit";
  const lowestSubcategory = subResults?.lowest?.name || labels[weakest];
  const mappedThemeTitle = getBeatitudeThemeForSubcategory(lowestSubcategory, weakest);
  const themeTitle = mappedThemeTitle || beatitudeTheme?.title || "Poor in spirit";
  const theme = beatitudeGuidanceProfiles[themeTitle] || beatitudeGuidanceProfiles["Poor in spirit"];
  const previous = history?.[1] || null;
  const trend = getTrend(results || {}, previous);

  let alignmentSummary =
    total >= 7
      ? "Your alignment is showing meaningful strength, with room to keep the center steady."
      : total >= 4
        ? "Your results show both alignment and resistance. Growth will come through steady attention, not pressure."
        : "Your current alignment is limited, but this is a starting point for return, clarity, and growth.";

  if (weakest === "spirit" && resistance >= 5) {
    alignmentSummary =
      "Resistance is most connected to the center right now. Begin with stillness, prayer, Scripture, and surrender before trying to correct everything outwardly.";
  } else if (strongest === "body" && weakest !== "body") {
    alignmentSummary =
      "Your outward action may be stronger than your inner alignment. Growth will come from returning performance, emotion, and thought back toward the center.";
  } else if (weakest === "soul") {
    alignmentSummary =
      "Your inner life is asking for steadiness. Growth will come through renewed thinking, honest identity, and emotional clarity.";
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
    beatitudeThemeTitle: themeTitle,
    beatitudeScriptureReference: theme.scriptureReference,
    beatitudeScripture: theme.scripture,
    beatitudeMeaning: theme.meaning,
    beatitudeWhy: theme.whyThisTheme,
    beatitudeBeginnerHint: theme.beginnerHint,
    beatitudePractice: theme.action,
  };
}
