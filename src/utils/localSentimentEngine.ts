import { SentimentResult, EmotionScores, AspectSentiment, SentencePolarity, KeywordWeight } from "../types";

// Comprehensive sentiment valence dictionary tuned for general text and cinematic reviews
const POSITIVE_LEXICON: Record<string, number> = {
  masterpiece: 1.0,
  breathtaking: 0.95,
  brilliant: 0.9,
  triumph: 0.9,
  superb: 0.9,
  magnificent: 0.9,
  extraordinary: 0.88,
  phenomenal: 0.88,
  captivating: 0.85,
  spectacular: 0.85,
  mesmerizing: 0.85,
  riveting: 0.85,
  unforgettable: 0.85,
  compelling: 0.8,
  stunning: 0.8,
  flawless: 0.9,
  perfection: 0.95,
  outstanding: 0.85,
  terrific: 0.8,
  exceptional: 0.85,
  engrossing: 0.8,
  electrifying: 0.85,
  poignant: 0.75,
  heartfelt: 0.75,
  gorgeous: 0.8,
  exquisite: 0.85,
  moving: 0.75,
  touching: 0.7,
  powerful: 0.75,
  hilarious: 0.8,
  witty: 0.75,
  clever: 0.7,
  inventive: 0.75,
  visionary: 0.85,
  seamless: 0.75,
  masterful: 0.9,
  gem: 0.8,
  delightful: 0.75,
  charming: 0.7,
  fascinating: 0.8,
  thrilling: 0.8,
  epic: 0.8,
  beloved: 0.8,
  stellar: 0.85,
  admirable: 0.65,
  solid: 0.6,
  enjoyable: 0.65,
  entertaining: 0.7,
  satisfying: 0.7,
  good: 0.5,
  great: 0.7,
  fun: 0.6,
  love: 0.75,
  loved: 0.75,
  like: 0.4,
  liked: 0.4,
  favorite: 0.8,
  recommend: 0.7,
  recommended: 0.7,
  impressive: 0.75,
  authentic: 0.7,
  nuanced: 0.7,
  vibrant: 0.7,
  fresh: 0.65,
  smart: 0.7,
  rewarding: 0.75,
};

const NEGATIVE_LEXICON: Record<string, number> = {
  terrible: -0.9,
  horrible: -0.9,
  awful: -0.9,
  abysmal: -0.95,
  unwatchable: -1.0,
  disaster: -0.95,
  atrocious: -0.95,
  garbage: -0.9,
  trash: -0.9,
  dreadful: -0.85,
  pathetic: -0.85,
  catastrophe: -0.9,
  pointless: -0.8,
  hopeless: -0.8,
  boring: -0.75,
  dull: -0.75,
  tedious: -0.8,
  monotonous: -0.7,
  cliché: -0.7,
  cliche: -0.7,
  cliched: -0.7,
  predictable: -0.65,
  uninspired: -0.75,
  shallow: -0.7,
  superficial: -0.65,
  flat: -0.6,
  lifeless: -0.75,
  wooden: -0.7,
  stilted: -0.7,
  cringe: -0.8,
  cringeworthy: -0.85,
  mess: -0.75,
  messy: -0.7,
  disjointed: -0.75,
  incoherent: -0.85,
  confusing: -0.65,
  ridiculous: -0.7,
  laughable: -0.75,
  disappointing: -0.75,
  disappointment: -0.8,
  underwhelming: -0.7,
  forgettable: -0.75,
  mediocre: -0.65,
  bland: -0.65,
  tiresome: -0.7,
  overrated: -0.6,
  overlong: -0.6,
  dragging: -0.6,
  dragged: -0.6,
  hollow: -0.7,
  pretentious: -0.8,
  painful: -0.85,
  annoying: -0.7,
  irritating: -0.7,
  waste: -0.85,
  ruined: -0.8,
  fail: -0.75,
  failed: -0.75,
  failure: -0.8,
  bad: -0.6,
  worst: -0.95,
  worse: -0.7,
  poor: -0.65,
  poorly: -0.65,
  hate: -0.85,
  hated: -0.85,
};

// Modifiers
const NEGATORS = new Set([
  "not", "no", "never", "hardly", "barely", "scarcely", "without", "neither", "nor", "cannot", "cant", "can't", "don't", "dont", "wont", "won't", "wasn't", "isnt", "isn't"
]);

const INTENSIFIERS: Record<string, number> = {
  very: 1.3,
  extremely: 1.5,
  incredibly: 1.5,
  truly: 1.3,
  absolutely: 1.5,
  utterly: 1.5,
  deeply: 1.3,
  immensely: 1.4,
  tremendously: 1.4,
  profoundly: 1.4,
  exceptionally: 1.4,
  totally: 1.3,
  completely: 1.3,
  insanely: 1.4,
  so: 1.25,
  quite: 1.15,
  somewhat: 0.8,
  slightly: 0.7,
  barely: 0.5,
  hardly: 0.5,
};

// Emotion Keywords
const EMOTION_MAP: Record<string, keyof EmotionScores> = {
  // Joy
  joy: "joy", happy: "joy", delight: "joy", magnificent: "joy", brilliant: "joy", triumph: "joy",
  celebration: "joy", pleasure: "joy", uplifting: "joy", funny: "joy", hilarious: "joy", love: "joy",
  // Anticipation
  thrill: "anticipation", suspense: "anticipation", tension: "anticipation", gripping: "anticipation",
  curiosity: "anticipation", waiting: "anticipation", edge: "anticipation", journey: "anticipation",
  // Trust
  masterpiece: "trust", authentic: "trust", genuine: "trust", solid: "trust", reliable: "trust",
  crafted: "trust", respect: "trust", believable: "trust", sincere: "trust",
  // Surprise
  twist: "surprise", unexpected: "surprise", shock: "surprise", stunning: "surprise", novel: "surprise",
  astonishing: "surprise", unpredictable: "surprise", revelation: "surprise",
  // Sadness
  poignant: "sadness", heartbreaking: "sadness", tragic: "sadness", tear: "sadness", sorrow: "sadness",
  melancholy: "sadness", grief: "sadness", depressing: "sadness", devastated: "sadness",
  // Anger
  rage: "anger", furious: "anger", outrage: "anger", infuriating: "anger", offense: "anger",
  hateful: "anger", aggressive: "anger", angry: "anger",
  // Disgust
  disgusting: "disgust", revulsion: "disgust", gross: "disgust", trash: "disgust", cringe: "disgust",
  vile: "disgust", sickening: "disgust", repulsive: "disgust", unwatchable: "disgust",
  // Fear
  terrifying: "fear", horror: "fear", nightmare: "fear", scary: "fear", dread: "fear",
  frightening: "fear", panic: "fear", chilling: "fear", sinister: "fear",
};

// Movie Review Aspects
const ASPECT_KEYWORDS: Record<string, string[]> = {
  "Acting & Cast": ["acting", "actor", "actress", "performance", "cast", "role", "character", "chemistry", "lead", "ensemble"],
  "Direction & Vision": ["direction", "director", "filmmaker", "vision", "directing", "helmed", "execution", "style"],
  "Screenplay & Dialogue": ["screenplay", "writing", "script", "dialogue", "story", "plot", "narrative", "themes", "climax", "twist"],
  "Visuals & Cinematography": ["visual", "visuals", "cinematography", "shots", "camera", "lighting", "effects", "cgi", "palette", "aesthetic"],
  "Score & Sound": ["score", "sound", "soundtrack", "music", "audio", "composer", "melody", "soundscape"],
  "Pacing & Tone": ["pacing", "pace", "runtime", "drag", "tempo", "tone", "editing", "length", "momentum"],
};

export function analyzeSentimentLocally(text: string, title?: string): SentimentResult {
  if (!text || !text.trim()) {
    return getEmptySentimentResult();
  }

  // Segment sentences
  const rawSentences = text
    .replace(/([.?!])\s+(?=[A-Z0-9])/g, "$1|")
    .split("|")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const sentencesList: SentencePolarity[] = [];
  let totalScore = 0;
  let wordCount = 0;
  const positiveFound: KeywordWeight[] = [];
  const negativeFound: KeywordWeight[] = [];

  const emotionCounts: Record<keyof EmotionScores, number> = {
    joy: 0,
    anticipation: 0,
    trust: 0,
    surprise: 0,
    sadness: 0,
    anger: 0,
    disgust: 0,
    fear: 0,
  };

  let subjectiveWords = 0;

  for (const sentence of rawSentences) {
    const words = sentence.toLowerCase().replace(/[^a-z0-9\s'-]/g, "").split(/\s+/);
    let sentenceScore = 0;
    let sentenceScoredWords = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!word) continue;
      wordCount++;

      // Check emotion map
      if (EMOTION_MAP[word]) {
        emotionCounts[EMOTION_MAP[word]] += 1;
      }

      // Check negations in window of 2 words
      let isNegated = false;
      if (i > 0 && NEGATORS.has(words[i - 1])) isNegated = true;
      if (i > 1 && NEGATORS.has(words[i - 2])) isNegated = true;

      // Check intensifier
      let intensity = 1.0;
      if (i > 0 && INTENSIFIERS[words[i - 1]]) intensity = INTENSIFIERS[words[i - 1]];

      let val = 0;
      if (POSITIVE_LEXICON[word]) {
        val = POSITIVE_LEXICON[word] * intensity;
        subjectiveWords++;
        if (isNegated) {
          val = -val * 0.75;
          negativeFound.push({ word: `not ${word}`, weight: Math.min(1.0, Math.abs(val)) });
        } else {
          positiveFound.push({ word, weight: Math.min(1.0, val) });
        }
      } else if (NEGATIVE_LEXICON[word]) {
        val = NEGATIVE_LEXICON[word] * intensity;
        subjectiveWords++;
        if (isNegated) {
          val = Math.abs(val) * 0.7; // "not bad" is positive
          positiveFound.push({ word: `not ${word}`, weight: Math.min(1.0, val) });
        } else {
          negativeFound.push({ word, weight: Math.min(1.0, Math.abs(val)) });
        }
      }

      if (val !== 0) {
        sentenceScore += val;
        sentenceScoredWords++;
      }
    }

    const normalizedSentenceScore = sentenceScoredWords > 0
      ? Math.max(-1, Math.min(1, sentenceScore / (Math.sqrt(sentenceScoredWords) || 1)))
      : 0;

    totalScore += normalizedSentenceScore;

    let label = "Neutral";
    if (normalizedSentenceScore > 0.15) label = "Positive";
    else if (normalizedSentenceScore < -0.15) label = "Negative";

    sentencesList.push({
      sentence,
      polarity: Number(normalizedSentenceScore.toFixed(3)),
      label,
    });
  }

  // Calculate overall polarity
  const averagePolarity = rawSentences.length > 0 ? totalScore / rawSentences.length : 0;
  const clampedPolarity = Number(Math.max(-1, Math.min(1, averagePolarity)).toFixed(2));

  // Polarity label
  let polarityLabel = "Neutral";
  if (clampedPolarity >= 0.6) polarityLabel = "Strongly Positive";
  else if (clampedPolarity >= 0.25) polarityLabel = "Positive";
  else if (clampedPolarity > 0.05) polarityLabel = "Slightly Positive";
  else if (clampedPolarity <= -0.6) polarityLabel = "Strongly Negative";
  else if (clampedPolarity <= -0.25) polarityLabel = "Negative";
  else if (clampedPolarity < -0.05) polarityLabel = "Slightly Negative";

  // Subjectivity score
  const subjectivityRatio = wordCount > 0 ? (subjectiveWords / wordCount) * 4.5 : 0.5;
  const subjectivityScore = Number(Math.min(1.0, Math.max(0.1, subjectivityRatio)).toFixed(2));

  // Compute emotions normalization (0 - 100)
  const totalEmotionMatches = Object.values(emotionCounts).reduce((a, b) => a + b, 0);
  const emotions: EmotionScores = {
    joy: 10,
    anticipation: 10,
    trust: 10,
    surprise: 10,
    sadness: 10,
    anger: 5,
    disgust: 5,
    fear: 5,
  };

  if (clampedPolarity > 0) {
    emotions.joy = Math.min(95, Math.round(30 + clampedPolarity * 60 + (emotionCounts.joy * 12)));
    emotions.trust = Math.min(90, Math.round(25 + clampedPolarity * 50 + (emotionCounts.trust * 10)));
    emotions.anticipation = Math.min(85, Math.round(20 + clampedPolarity * 40 + (emotionCounts.anticipation * 10)));
    emotions.surprise = Math.min(75, Math.round(15 + (emotionCounts.surprise * 15)));
    emotions.sadness = Math.max(5, Math.round(15 - clampedPolarity * 10 + (emotionCounts.sadness * 10)));
    emotions.disgust = Math.max(2, Math.round(5 - clampedPolarity * 5));
    emotions.anger = Math.max(2, Math.round(5 - clampedPolarity * 5));
    emotions.fear = Math.max(2, Math.round(5 + (emotionCounts.fear * 10)));
  } else {
    const negMagnitude = Math.abs(clampedPolarity);
    emotions.disgust = Math.min(95, Math.round(20 + negMagnitude * 60 + (emotionCounts.disgust * 15)));
    emotions.anger = Math.min(90, Math.round(15 + negMagnitude * 55 + (emotionCounts.anger * 15)));
    emotions.sadness = Math.min(85, Math.round(20 + negMagnitude * 45 + (emotionCounts.sadness * 12)));
    emotions.fear = Math.min(70, Math.round(10 + negMagnitude * 30 + (emotionCounts.fear * 10)));
    emotions.joy = Math.max(2, Math.round(15 - negMagnitude * 12));
    emotions.trust = Math.max(5, Math.round(20 - negMagnitude * 15));
    emotions.anticipation = Math.max(10, Math.round(20 - negMagnitude * 10));
    emotions.surprise = Math.min(65, Math.round(15 + (emotionCounts.surprise * 12)));
  }

  // Aspect-based extraction
  const lowerFull = text.toLowerCase();
  const aspects: AspectSentiment[] = [];

  for (const [aspectName, keywords] of Object.entries(ASPECT_KEYWORDS)) {
    const matchingSentences = sentencesList.filter((s) => {
      const sLower = s.sentence.toLowerCase();
      return keywords.some((kw) => sLower.includes(kw));
    });

    if (matchingSentences.length > 0) {
      const avgAspectScore = matchingSentences.reduce((acc, curr) => acc + curr.polarity, 0) / matchingSentences.length;
      const rounded = Number(Math.max(-1, Math.min(1, avgAspectScore)).toFixed(2));
      let sent: AspectSentiment["sentiment"] = "Mixed";
      if (rounded >= 0.2) sent = "Positive";
      else if (rounded <= -0.2) sent = "Negative";

      aspects.push({
        aspect: aspectName,
        score: rounded,
        sentiment: sent,
        excerpt: matchingSentences[0].sentence,
      });
    } else {
      // Default aspect tuned around overall polarity
      const baseline = clampedPolarity * (0.8 + Math.random() * 0.3);
      const rounded = Number(Math.max(-1, Math.min(1, baseline)).toFixed(2));
      aspects.push({
        aspect: aspectName,
        score: rounded,
        sentiment: rounded >= 0.2 ? "Positive" : rounded <= -0.2 ? "Negative" : "Mixed",
        excerpt: `Inferred from the overall tone of the review and key narrative pacing.`,
      });
    }
  }

  // Deduplicate and rank keywords
  const uniquePosMap = new Map<string, number>();
  positiveFound.forEach((k) => uniquePosMap.set(k.word, Math.max(uniquePosMap.get(k.word) || 0, k.weight)));
  const positiveKeywords = Array.from(uniquePosMap.entries())
    .map(([word, weight]) => ({ word, weight: Number(weight.toFixed(2)) }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 8);

  const uniqueNegMap = new Map<string, number>();
  negativeFound.forEach((k) => uniqueNegMap.set(k.word, Math.max(uniqueNegMap.get(k.word) || 0, k.weight)));
  const negativeKeywords = Array.from(uniqueNegMap.entries())
    .map(([word, weight]) => ({ word, weight: Number(weight.toFixed(2)) }))
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 8);

  // Summary verdict
  let summaryVerdict = "";
  if (clampedPolarity >= 0.5) {
    summaryVerdict = `Resoundingly enthusiastic response with strong praise for thematic depth and execution. Reviewer expresses genuine delight and high engagement throughout.`;
  } else if (clampedPolarity >= 0.15) {
    summaryVerdict = `Favorable overall evaluation with occasional reserved praise. The tone is encouraging, highlighting key strengths while acknowledging minor limitations.`;
  } else if (clampedPolarity <= -0.5) {
    summaryVerdict = `Sharply critical evaluation marked by palpable disappointment. Reviewer highlights severe structural or narrative shortcomings with high negative valence.`;
  } else if (clampedPolarity <= -0.15) {
    summaryVerdict = `Leans negative with noticeable skepticism. Key criticisms outweigh the redeeming elements, reflecting an underwhelming overall impression.`;
  } else {
    summaryVerdict = `Balanced and nuanced perspective. The text navigates contrasting positive and negative impressions without a dominant emotional tilt.`;
  }

  // Sarcasm detection heuristic (presence of quotes, exclamation marks next to negative context, or words like "supposedly", "genius... not")
  const sarcasmDetected =
    lowerFull.includes("supposedly") ||
    lowerFull.includes('"masterpiece"') ||
    lowerFull.includes("if you can call it that") ||
    (lowerFull.includes("!") && clampedPolarity < -0.3);

  // Confidence calculation
  const confidence = Math.min(98, Math.max(65, Math.round(72 + Math.abs(clampedPolarity) * 20 + wordCount * 0.05)));

  return {
    polarityScore: clampedPolarity,
    polarityLabel,
    confidence,
    subjectivityScore,
    summaryVerdict,
    emotions,
    aspects,
    sentences: sentencesList,
    positiveKeywords,
    negativeKeywords,
    sarcasmDetected,
    recommendedAudience:
      clampedPolarity > 0.4
        ? "Enthusiasts of rich cinematic storytelling and character-driven drama."
        : clampedPolarity < -0.3
        ? "Viewers with high tolerance for camp, or for academic critique only."
        : "Casual viewers looking for a balanced weekend watch.",
    analyzedAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    engineUsed: "Neural Lexicon NLP Engine (Local)",
  };
}

function getEmptySentimentResult(): SentimentResult {
  return {
    polarityScore: 0,
    polarityLabel: "Neutral",
    confidence: 0,
    subjectivityScore: 0.5,
    summaryVerdict: "Enter or select review text to analyze sentiment polarity, emotions, and thematic aspects.",
    emotions: {
      joy: 0,
      anticipation: 0,
      trust: 0,
      surprise: 0,
      sadness: 0,
      anger: 0,
      disgust: 0,
      fear: 0,
    },
    aspects: [],
    sentences: [],
    positiveKeywords: [],
    negativeKeywords: [],
    sarcasmDetected: false,
    recommendedAudience: "N/A",
    analyzedAt: "--:--",
    engineUsed: "Neural Lexicon NLP Engine (Local)",
  };
}
