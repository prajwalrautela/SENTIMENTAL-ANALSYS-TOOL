export interface EmotionScores {
  joy: number;         // 0 - 100
  anticipation: number;// 0 - 100
  trust: number;       // 0 - 100
  surprise: number;    // 0 - 100
  sadness: number;     // 0 - 100
  anger: number;       // 0 - 100
  disgust: number;     // 0 - 100
  fear: number;        // 0 - 100
}

export interface AspectSentiment {
  aspect: string;       // e.g. "Acting & Cast", "Direction", "Visuals", "Screenplay", "Sound & Score", "Pacing"
  score: number;        // -1.0 to 1.0
  sentiment: "Positive" | "Mixed" | "Negative" | "Not Mentioned";
  excerpt: string;
}

export interface SentencePolarity {
  sentence: string;
  polarity: number;     // -1.0 to 1.0
  label: string;        // "Positive" | "Neutral" | "Negative"
}

export interface KeywordWeight {
  word: string;
  weight: number;       // 0.1 to 1.0
}

export interface SentimentResult {
  polarityScore: number;       // -1.0 to 1.0
  polarityLabel: string;       // "Strongly Positive", "Positive", "Slightly Positive", "Neutral", "Slightly Negative", "Negative", "Strongly Negative"
  confidence: number;          // 0 to 100
  subjectivityScore: number;   // 0.0 (objective) to 1.0 (deeply subjective)
  summaryVerdict: string;      // Concise expert consensus
  emotions: EmotionScores;
  aspects: AspectSentiment[];
  sentences: SentencePolarity[];
  positiveKeywords: KeywordWeight[];
  negativeKeywords: KeywordWeight[];
  sarcasmDetected: boolean;
  recommendedAudience: string;
  analyzedAt: string;
  engineUsed: "Gemini 3.8 Flash (AI Model)" | "Neural Lexicon NLP Engine (Local)";
}

export interface MovieReviewPreset {
  id: string;
  title: string;
  year: number;
  genre: string;
  ratingScore: string;
  reviewerType: "Top Critic" | "Audience Fan" | "Indie Film Journal" | "Disappointed Viewer";
  reviewerName: string;
  expectedPolarity: "Strongly Positive" | "Positive" | "Mixed / Cult" | "Negative" | "Strongly Negative";
  reviewText: string;
}

export interface BatchItem {
  id: string;
  title: string;
  text: string;
  category?: string;
  result?: SentimentResult;
}

export interface BatchAnalysisSummary {
  averagePolarity: number;
  consensusVerdict: string;
  positivePercentage: number;
  neutralPercentage: number;
  negativePercentage: number;
  totalReviews: number;
}
