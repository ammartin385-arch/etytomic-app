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

const biblicalGuidanceLibrary = [
  {
    title: "Godly Sorrow and Light",
    categories: ["spirit", "soul"],
    tags: ["high_resistance", "declining", "strained", "return_to_center", "connection_to_god"],
    beatitudeThemes: ["Poor in spirit", "Those who mourn", "Perseverance under resistance"],
    scriptureReferences: ["2 Corinthians 7:10", "Psalm 139:23-24", "Psalm 119:130", "John 8:12"],
    safeSummary:
      "God's light does not expose to crush; it exposes so repentance can move toward life.",
    resistancePattern:
      "Remorse keeps circling the past, while godly sorrow turns toward God and a faithful next step.",
    reflectionQuestion: "Where do I need light that leads to repentance rather than regret?",
    practiceStep:
      "Name one thing honestly before God and ask what repentance would look like today.",
  },
  {
    title: "Faith Becoming Obedience",
    categories: ["body", "spirit"],
    tags: ["conviction_into_practice", "body_low", "active_but_uncentered", "conviction"],
    beatitudeThemes: ["Hunger and thirst for righteousness", "Pure in heart"],
    scriptureReferences: ["Hebrews 11:1", "Romans 4:20-22", "James 2:17", "Galatians 5:6"],
    safeSummary:
      "Faith is not mere intention; living faith begins to move through love and obedience.",
    resistancePattern:
      "Conviction can stay abstract when the next right action is delayed.",
    reflectionQuestion: "What clear right action has faith already made visible?",
    practiceStep:
      "Take one concrete step of obedience before adding a larger plan.",
  },
  {
    title: "Self-Control Under the Spirit",
    categories: ["body"],
    tags: ["high_resistance", "discipline", "self_control", "body_low"],
    beatitudeThemes: ["Meekness", "Hunger and thirst for righteousness"],
    scriptureReferences: ["Galatians 5:16-24", "Romans 8:13", "1 Timothy 4:7-8"],
    safeSummary:
      "Self-control is not self-salvation; it is Spirit-empowered resistance to what weakens love and obedience.",
    resistancePattern:
      "What succeeds repeatedly grows stronger; what is brought into the light can be weakened.",
    reflectionQuestion: "What desire or habit keeps asking for permission?",
    practiceStep:
      "Say no once today and choose the Spirit-led alternative.",
  },
  {
    title: "Truth Renewing the Mind",
    categories: ["soul"],
    tags: ["soul_low", "truth_becoming_steady", "identity", "thought_life", "emotional_stability"],
    beatitudeThemes: ["Pure in heart", "Meekness"],
    scriptureReferences: ["Romans 12:2", "2 Corinthians 10:5", "Psalm 73:21-26"],
    safeSummary:
      "The inner life needs truth to become steady, not just thoughts to become quieter.",
    resistancePattern:
      "A repeated thought, emotion, or identity story may be trying to lead before truth does.",
    reflectionQuestion: "What thought or emotion needs to be answered with truth?",
    practiceStep:
      "Write one truth from Scripture and let it govern one response today.",
  },
  {
    title: "Mercy and Forgiveness",
    categories: ["soul"],
    tags: ["relationships", "bitterness", "high_resistance", "peace"],
    beatitudeThemes: ["Merciful", "Peacemakers"],
    scriptureReferences: ["Matthew 5:7", "Matthew 6:14-15", "Ephesians 4:31-32", "1 Corinthians 13:4-7"],
    safeSummary:
      "Forgiveness is not denial or the removal of accountability; it is refusing to let bitterness govern the soul.",
    resistancePattern:
      "Unforgiveness can keep pain turned inward and make mercy feel impossible.",
    reflectionQuestion: "Where do I need mercy without pretending the wound did not matter?",
    practiceStep:
      "Pray one honest sentence of release and ask God for the next faithful step.",
  },
  {
    title: "Contentment and Desire",
    categories: ["soul", "body"],
    tags: ["coveting", "dissatisfaction", "balanced_forming", "identity"],
    beatitudeThemes: ["Pure in heart", "Meekness"],
    scriptureReferences: ["Philippians 4:11-13", "Exodus 20:17", "Psalm 73:25-26", "Luke 12:15"],
    safeSummary:
      "Contentment is learned by bringing desire under God's sufficiency, not by pretending desire is absent.",
    resistancePattern:
      "Comparison and craving can keep the heart fixed on what is missing instead of what is given.",
    reflectionQuestion:
      "Where am I despising what God has given because I am focused on what I lack?",
    practiceStep: "Name one gift with gratitude and one desire to surrender.",
  },
  {
    title: "Lament and Endurance",
    categories: ["soul", "spirit"],
    tags: ["declining", "suffering", "strained", "grief", "discouragement"],
    beatitudeThemes: ["Those who mourn", "Perseverance under resistance"],
    scriptureReferences: ["Psalm 13", "Psalm 11", "Lamentations 3:21-24", "1 Thessalonians 4:13"],
    safeSummary:
      "Biblical lament gives sorrow words before God while still reaching for hope.",
    resistancePattern:
      "Pain can turn into isolation, bitterness, or giving up when it has no prayerful place to go.",
    reflectionQuestion:
      "What do I need to say honestly to God instead of carrying silently?",
    practiceStep:
      "Pray one honest lament and name one truth you can still lean on.",
  },
  {
    title: "Peace Under Pressure",
    categories: ["soul"],
    tags: ["relationships", "tension", "peace", "high_resistance"],
    beatitudeThemes: ["Peacemakers", "Merciful", "Meekness"],
    scriptureReferences: ["John 14:27", "John 20:19-21", "Ephesians 6:10-18"],
    safeSummary:
      "Peace is not avoidance; it is receiving Christ's peace and responding from it under pressure.",
    resistancePattern:
      "Tension may invite reaction, withdrawal, or control instead of truthful peace.",
    reflectionQuestion:
      "Where is peace asking for a truthful and faithful response?",
    practiceStep:
      "Pause before one response and choose peace without avoiding truth.",
  },
  {
    title: "Work, Service, and Gifts",
    categories: ["body"],
    tags: ["body_low", "follow_through", "discipline", "service"],
    beatitudeThemes: ["Hunger and thirst for righteousness"],
    scriptureReferences: ["Genesis 2:15", "Colossians 3:23", "1 Thessalonians 4:11-12", "1 Peter 4:10"],
    safeSummary:
      "Work and service can become worship when they are offered to God with love and integrity.",
    resistancePattern:
      "Avoided work, unused gifts, or poor follow-through can keep conviction from becoming contribution.",
    reflectionQuestion:
      "What contribution is God asking me to make faithfully with what I have?",
    practiceStep:
      "Complete one useful task today with care, as service to the Lord.",
  },
  {
    title: "Discernment Through the Word",
    categories: ["spirit", "soul"],
    tags: ["confusion", "truth", "spirit_low", "soul_low", "connection_to_god"],
    beatitudeThemes: ["Pure in heart", "Poor in spirit"],
    scriptureReferences: ["1 Thessalonians 5:19-22", "2 Peter 1:20-21", "Romans 10:17", "Luke 8:18"],
    safeSummary:
      "Growth requires testing voices by Scripture and learning to receive God's Word with faith.",
    resistancePattern:
      "The wrong voices can make confusion feel spiritual while pulling attention away from Christ.",
    reflectionQuestion:
      "What voice or input needs to be tested by God's Word?",
    practiceStep:
      "Read one Scripture slowly and ask what should be received, resisted, or obeyed.",
  },
  {
    title: "Love as the Fruit",
    categories: ["soul", "body"],
    tags: ["relationships", "service", "active_but_uncentered", "balanced_forming"],
    beatitudeThemes: ["Merciful", "Peacemakers", "Meekness"],
    scriptureReferences: ["1 Corinthians 13:1-7", "Galatians 5:22-23", "John 13:34-35"],
    safeSummary:
      "The deepest fruit of alignment is love formed by Christ, not impressive activity without love.",
    resistancePattern:
      "Service, worship, or discipline can lose alignment when love is absent or self-protection leads.",
    reflectionQuestion:
      "Where does love need to become more patient, humble, or generous?",
    practiceStep:
      "Choose one person and practice love in a concrete, costly, ordinary way.",
  },
  {
    title: "Hope in Resurrection",
    categories: ["spirit", "soul"],
    tags: ["suffering", "discouragement", "declining", "perseverance"],
    beatitudeThemes: ["Those who mourn", "Perseverance under resistance"],
    scriptureReferences: ["1 Peter 1:3-7", "1 Thessalonians 4:13-18", "Revelation 7:9-17", "1 Corinthians 15"],
    safeSummary:
      "Christian hope does not deny grief; it places grief inside Christ's resurrection promise.",
    resistancePattern:
      "Discouragement can shrink vision until present pain feels like the whole story.",
    reflectionQuestion:
      "Where do I need hope that is deeper than my current circumstances?",
    practiceStep:
      "Name one future promise of Christ and one faithful response for today.",
  },
];

const categoryKeys = ["spirit", "soul", "body"];
const genericSubcategoryNames = new Set(["Spirit", "Soul", "Body"]);

function clampScore(value) {
  return Math.max(0, Math.min(10, Number(value) || 0));
}

function normalizeCategoryName(categoryName) {
  const value = String(categoryName || "").toLowerCase();
  return categoryKeys.includes(value) ? value : null;
}

function hasSpecificSubcategory(subcategoryName) {
  return Boolean(subcategoryName && !genericSubcategoryNames.has(String(subcategoryName)));
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

function getScoreBand(value) {
  const score = clampScore(value);
  if (score >= 7) return "strong";
  if (score >= 4) return "forming";
  return "strained";
}

function getComplexScorePattern({ total, resistance, imbalance, weakest, strongest, trend }) {
  const weakestLabel = labels[weakest] || "your growth area";
  const strongestLabel = labels[strongest] || "your strongest area";
  const totalBand = getScoreBand(total);
  const resistanceBand = resistance >= 6 ? "high" : resistance >= 3 ? "moderate" : "low";
  const balanced = imbalance.spread < 1.2;
  const sharpImbalance = imbalance.spread >= 2.5;

  if (trend === "declining") {
    return {
      title: "Return to Center",
      alignmentSummary:
        "Your recent movement suggests something is pulling alignment away from the center. This is not a verdict; it is a clear place to return with honesty and without shame.",
      growthFocus: `${weakestLabel} needs attention first because it is carrying the clearest loss of steadiness.`,
      resistanceInsight:
        "Resistance is showing up as drift. Notice what has become harder to practice, easier to avoid, or quicker to justify.",
      suggestedNextStep: nextSteps[weakest],
      growthDirection:
        "Do not try to repair everything at once. Return to the center, name what changed, and take one faithful step in the weakest area.",
      whyPathDetail:
        "The path is shaped by recent decline, so the guidance emphasizes return, clarity, and one concrete response rather than intensity.",
    };
  }

  if (totalBand === "strained" && resistanceBand === "high") {
    return {
      title: "Rebuild from the Center",
      alignmentSummary:
        "Your scores show low alignment with strong resistance. Growth should begin gently and centrally, not with pressure to fix every area at once.",
      growthFocus: `${weakestLabel} is the first place to rebuild because it is carrying the strongest resistance signal.`,
      resistanceInsight:
        "Resistance is loud enough that it may feel like identity. Treat it instead as a signal showing where light and support are needed.",
      suggestedNextStep: nextSteps[weakest],
      growthDirection:
        "Begin with one small act of return. Let faithfulness become visible before trying to measure major change.",
      whyPathDetail:
        "The path is selected around high resistance and low alignment, so the next step stays small, concrete, and restorative.",
    };
  }

  if (strongest === "body" && weakest !== "body") {
    return {
      title: "Active but Uncentered",
      alignmentSummary:
        "Your outward life may be functioning better than the inner or spiritual center. Growth begins by letting action flow from truth instead of performance.",
      growthFocus: `${weakestLabel} needs to be brought back under the center so outward action is not carrying more than it should.`,
      resistanceInsight:
        "Resistance may hide inside productivity, responsibility, or visible follow-through while the deeper life needs attention.",
      suggestedNextStep:
        weakest === "spirit"
          ? "Pause before one responsibility today and bring it to God before acting."
          : "Name one thought or emotion underneath your activity and bring it back to truth.",
      growthDirection:
        "Let the inner source be strengthened before adding more output. Alignment deepens when action follows from the center.",
      whyPathDetail:
        "The path is shaped by strong outward action paired with an inner or spiritual growth area.",
    };
  }

  if (strongest === "spirit" && weakest === "body" && sharpImbalance) {
    return {
      title: "Conviction into Practice",
      alignmentSummary:
        "Your spiritual center shows strength, but the body score suggests conviction may not yet be becoming steady action.",
      growthFocus:
        "Body is the growth area because the next season is about making what is true visible through one repeated practice.",
      resistanceInsight:
        "Resistance may appear as delay, inconsistency, fatigue, or knowing the next right thing without embodying it.",
      suggestedNextStep: "Choose one small embodied practice today and complete it before adding another goal.",
      growthDirection:
        "Let conviction become visible through one faithful rhythm. Small obedience will carry more weight than a large plan.",
      whyPathDetail:
        "The path is selected because Spirit is comparatively strong while Body is carrying the clearest gap.",
    };
  }

  if (weakest === "soul") {
    return {
      title: "Truth Becoming Steady",
      alignmentSummary:
        "Your inner life is carrying the clearest growth signal. The work is not only to think differently, but to let truth become steady in identity, emotion, and response.",
      growthFocus:
        "Soul is the focus because thoughts, emotions, or identity may be influencing the rest of the structure.",
      resistanceInsight:
        "Resistance may show up as rumination, emotional reactivity, comparison, confusion, or a story about yourself that is not fully true.",
      suggestedNextStep: nextSteps.soul,
      growthDirection:
        "Bring one repeated thought or emotional pattern into God's light, then answer it with truth.",
      whyPathDetail:
        "The path is selected because the inner life is carrying the clearest signal for growth.",
    };
  }

  if (balanced && totalBand === "strong" && resistanceBand === "low") {
    return {
      title: "Guard the Rhythm",
      alignmentSummary:
        "Your scores show a relatively steady structure. The next work is protection and attentiveness, not urgency.",
      growthFocus:
        "No single area is sharply out of alignment, so focus on guarding the practices that keep the center clear.",
      resistanceInsight:
        "Resistance is low. Watch for subtle drift rather than obvious breakdown.",
      suggestedNextStep:
        "Choose one practice that is helping you stay centered and protect it this week.",
      growthDirection:
        "Keep returning to the habits that make alignment sustainable. Growth here is faithfulness over time.",
      whyPathDetail:
        "The path is selected to protect alignment rather than respond to an urgent imbalance.",
    };
  }

  if (balanced && totalBand !== "strong") {
    return {
      title: "Whole Structure Attention",
      alignmentSummary:
        "Your scores are close together, which means growth may need a whole-structure rhythm rather than a single dramatic correction.",
      growthFocus:
        "Start with the weakest area, but keep the practice simple enough to support Spirit, Soul, and Body together.",
      resistanceInsight:
        "Resistance may be broad instead of concentrated. Look for the repeated pattern that affects more than one area.",
      suggestedNextStep: nextSteps[weakest],
      growthDirection:
        "Choose one small practice that helps the whole structure return toward the center.",
      whyPathDetail:
        "The path is selected because the scores are close together, so guidance emphasizes a simple rhythm across the whole structure.",
    };
  }

  if (trend === "improving") {
    return {
      title: "Strengthen What Is Working",
      alignmentSummary:
        "Your recent movement is encouraging. Growth now means strengthening what is already helping you return toward alignment.",
      growthFocus: `${weakestLabel} is still the focus, but ${strongestLabel} may help support the next faithful step.`,
      resistanceInsight:
        "Resistance is not gone, but it is becoming easier to name and answer with practice.",
      suggestedNextStep: nextSteps[weakest],
      growthDirection:
        "Repeat the practice that is bearing fruit, then connect it to one concrete step in the growth area.",
      whyPathDetail:
        "The path is selected to continue recent movement while still addressing the weakest area.",
    };
  }

  return {
    title: "Focused Growth",
    alignmentSummary:
      totalBand === "strong"
        ? "Your alignment shows real strength, with one area asking for focused attention."
        : "Your results show both alignment and resistance. Growth will come through steady attention, not pressure.",
    growthFocus: sharpImbalance
      ? `${weakestLabel} is carrying the greatest resistance compared with ${strongestLabel}. Focus there first.`
      : `${weakestLabel} is the clearest focus area for this check-in.`,
    resistanceInsight:
      resistanceBand === "high"
        ? "Resistance is high enough to notice clearly. Treat it as a signal to return attention to the center, not as a verdict."
        : resistanceBand === "moderate"
          ? "Resistance is present, but workable. Small faithful steps will matter more than intensity."
          : "Resistance is low. Protect the practices that are keeping alignment clear.",
    suggestedNextStep: nextSteps[weakest],
    growthDirection:
      "Let the next faithful response be specific enough to practice today and small enough to repeat.",
    whyPathDetail:
      "The path is selected from the clearest growth area, resistance level, score spread, and recent movement.",
  };
}

function getBiblicalGuidanceTags({
  total,
  resistance,
  imbalance,
  weakest,
  trend,
  lowestSubcategory,
  scorePatternTitle,
}) {
  const tags = new Set([weakest, `${weakest}_low`]);
  const subcategory = String(lowestSubcategory || "").toLowerCase();
  const pattern = String(scorePatternTitle || "").toLowerCase();

  if (getScoreBand(total) === "strained") tags.add("strained");
  if (resistance >= 6) tags.add("high_resistance");
  else if (resistance >= 3) tags.add("moderate_resistance");
  else tags.add("low_resistance");
  if (trend && trend !== "new") tags.add(trend);
  if ((imbalance?.spread || 0) < 1.2) tags.add("balanced_forming");
  if (subcategory.includes("relationship")) tags.add("relationships");
  if (subcategory.includes("discipline")) tags.add("discipline");
  if (subcategory.includes("self-control")) tags.add("self_control");
  if (subcategory.includes("thought")) tags.add("thought_life");
  if (subcategory.includes("identity")) tags.add("identity");
  if (subcategory.includes("emotional")) tags.add("emotional_stability");
  if (subcategory.includes("connection")) tags.add("connection_to_god");
  if (subcategory.includes("conviction")) tags.add("conviction");
  if (pattern.includes("uncentered")) tags.add("active_but_uncentered");
  if (pattern.includes("conviction")) tags.add("conviction_into_practice");
  if (pattern.includes("truth")) tags.add("truth_becoming_steady");
  if (pattern.includes("whole")) tags.add("balanced_forming");
  if (pattern.includes("return")) tags.add("return_to_center");
  if (pattern.includes("rebuild")) tags.add("strained");

  return [...tags];
}

function selectBiblicalGuidanceEntries(context) {
  const tags = getBiblicalGuidanceTags(context);
  const scored = biblicalGuidanceLibrary
    .map((entry, index) => {
      let score = 0;
      if (entry.categories?.includes(context.weakest)) score += 4;
      if (entry.categories?.includes(context.strongest)) score += 1;
      if (entry.beatitudeThemes?.includes(context.themeTitle)) score += 3;
      for (const tag of entry.tags || []) {
        if (tags.includes(tag)) score += 2;
      }
      return { entry, score, index };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index);

  return scored.slice(0, 3).map(({ entry }) => entry);
}

export function getBeatitudeThemeForSubcategory(subcategoryName, categoryName) {
  return subcategoryBeatitudeMap[subcategoryName] || categoryFallbackThemes[categoryName] || "Poor in spirit";
}

export function selectBeatitudeTheme({ results, subResults } = {}) {
  const imbalance = getLargestImbalance(results || {});
  const weakestCategory =
    normalizeCategoryName(results?.lowestCategory) ||
    normalizeCategoryName(subResults?.lowest?.category) ||
    imbalance.lowest ||
    "body";
  const subcategoryName = subResults?.lowest?.name;
  const subcategoryCategory = normalizeCategoryName(subResults?.lowest?.category) || weakestCategory;

  if (hasSpecificSubcategory(subcategoryName) && subcategoryCategory === weakestCategory) {
    return {
      title: getBeatitudeThemeForSubcategory(subcategoryName, subcategoryCategory),
      focusCategory: subcategoryCategory,
      focusSubcategory: subcategoryName,
      selectionReason: "subcategory",
      connectionText: `This Beatitude is connected to your ${labels[subcategoryCategory]} subcategory: ${subcategoryName}.`,
    };
  }

  return {
    title: categoryFallbackThemes[weakestCategory] || "Poor in spirit",
    focusCategory: weakestCategory,
    focusSubcategory: labels[weakestCategory],
    selectionReason: "category",
    connectionText: `This Beatitude is connected to your lowest area: ${labels[weakestCategory]}.`,
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
  const imbalance = getLargestImbalance(results || {});
  const weakest =
    normalizeCategoryName(results?.lowestCategory) ||
    normalizeCategoryName(subResults?.lowest?.category) ||
    imbalance.lowest ||
    "body";
  const strongest =
    normalizeCategoryName(subResults?.highest?.category) ||
    imbalance.highest ||
    "spirit";
  const themeSelection = selectBeatitudeTheme({ results, subResults });
  const lowestSubcategory = themeSelection.focusSubcategory || subResults?.lowest?.name || labels[weakest];
  const themeTitle = themeSelection.title || beatitudeTheme?.title || "Poor in spirit";
  const theme = beatitudeGuidanceProfiles[themeTitle] || beatitudeGuidanceProfiles["Poor in spirit"];
  const previous = history?.[1] || null;
  const trend = getTrend(results || {}, previous);
  const scorePattern = getComplexScorePattern({ total, resistance, imbalance, weakest, strongest, trend });
  const biblicalGuidance = selectBiblicalGuidanceEntries({
    total,
    resistance,
    imbalance,
    weakest,
    strongest,
    trend,
    themeTitle,
    lowestSubcategory,
    scorePatternTitle: scorePattern.title,
  });
  const primaryBiblicalGuidance = biblicalGuidance[0] || null;

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

  alignmentSummary = scorePattern.alignmentSummary || alignmentSummary;

  const growthFocus =
    scorePattern.growthFocus ||
    (imbalance.spread >= 2
      ? `${labels[weakest]} is carrying the greatest resistance compared with ${labels[strongest]}. Focus there first.`
      : `${labels[weakest]} is the clearest focus area for this check-in.`);

  const resistanceInsight =
    scorePattern.resistanceInsight ||
    (resistance >= 6
      ? "Resistance is high enough to notice clearly. Treat it as a signal to return attention to the center, not as a verdict."
      : resistance >= 3
        ? "Resistance is present, but workable. Small faithful steps will matter more than intensity."
        : "Resistance is low. Protect the practices that are keeping alignment clear.");

  return {
    alignmentSummary,
    growthFocus,
    resistanceInsight,
    suggestedNextStep: scorePattern.suggestedNextStep || theme.action || nextSteps[weakest],
    reflectionTone: trend === "declining" ? "grounding and corrective without shame" : theme.reflectionTone,
    recommendedPromptCategory: theme.promptCategory,
    growthDirection: scorePattern.growthDirection || theme.growthDirection,
    weakestArea: labels[weakest],
    strongestArea: labels[strongest],
    lowestSubcategory,
    largestImbalance: imbalance,
    trend,
    scorePatternTitle: scorePattern.title,
    scorePatternWhy: scorePattern.whyPathDetail,
    biblicalGuidance,
    primaryBiblicalGuidance,
    biblicalScriptureReferences: primaryBiblicalGuidance?.scriptureReferences || [],
    biblicalReflectionQuestion: primaryBiblicalGuidance?.reflectionQuestion,
    biblicalPracticeStep: primaryBiblicalGuidance?.practiceStep,
    beatitudeThemeTitle: themeTitle,
    beatitudeFocusCategory: labels[themeSelection.focusCategory] || labels[weakest],
    beatitudeFocusSubcategory: themeSelection.focusSubcategory,
    beatitudeSelectionReason: themeSelection.selectionReason,
    beatitudeConnection: themeSelection.connectionText,
    beatitudeScriptureReference: theme.scriptureReference,
    beatitudeScripture: theme.scripture,
    beatitudeMeaning: theme.meaning,
    beatitudeWhy: theme.whyThisTheme,
    beatitudeBeginnerHint: theme.beginnerHint,
    beatitudePractice: theme.action,
  };
}
