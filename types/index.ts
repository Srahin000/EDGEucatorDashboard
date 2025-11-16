export type DateRange = 'today' | 'week' | 'month' | 'custom';

export type Emotion = 
  | 'Joyful' 
  | 'Calm' 
  | 'Neutral' 
  | 'Frustrated' 
  | 'Anxious' 
  | 'Excited' 
  | 'Curious' 
  | 'Worried' 
  | 'Happy' 
  | 'Stressed';

export type TopicCategory = 
  | 'STEM' 
  | 'Art' 
  | 'Sports' 
  | 'School' 
  | 'Friends' 
  | 'Games' 
  | 'Family' 
  | 'Hobbies' 
  | 'Other';

export type Trend = 'up' | 'down' | 'stable';

export type RecommendationCategory = 
  | 'afterschool' 
  | 'club' 
  | 'learning' 
  | 'activity';

export interface Child {
  id: string;
  name: string;
  age: number;
  avatarColor: string;
  pronouns?: string;
  interestsSeed?: string[]; // parent-entered interests
}

export interface Conversation {
  id: string;
  childId: string;
  startedAt: string;  // ISO
  endedAt: string;
  durationSeconds: number;
  
  // content & topics
  summary: string;            // 2–3 sentence neutral summary
  keyPhrases: string[];       // short, de-identified phrases
  topics: string[];           // ['space', 'math', 'friends', 'dance']
  
  // emotions
  dominantEmotion: Emotion;   // 'Joyful' | 'Calm' | 'Neutral' | ...
  sentimentScore: number;     // 0–100
  emotionTimeline: {
    secondOffset: number;
    emotion: Emotion;
  }[];
  
  // engagement & communication
  conversationInsight: {
    engagementLevel: 'low' | 'medium' | 'high';
    questionCount: number;
    questionTypes: string[];  // ['why', 'how', 'what-if']
    avgUtteranceLength: number; // words
    vocabularyComplexity: number; // e.g. 0–1 or 0–100
  };
  
  // learning/development
  learningInsight: {
    struggleAreas: string[];     // ['fractions', 'spelling test']
    breakthroughMoments: string[]; // brief descriptions
    skillsMentioned: string[];   // ['reading', 'coding', 'drawing']
    learningMethods: string[];   // ['hands-on', 'visual', 'stories']
  };
  
  // social & wellbeing
  socialInsight: {
    friendsMentioned: string[];       // first names / nicknames only
    empathyIndicators: string[];      // ['comforted friend', 'noticed feelings']
    socialConcerns: string[];         // ['argued with friend', 'felt left out']
  };
  
  wellbeingInsight: {
    stressTriggers: string[];        // ['math quiz', 'presentation']
    copingStrategies: string[];      // ['drawing', 'talking', 'going outside']
    resilienceSignals: string[];     // ['tried again', 'reframed mistake']
    warningSignals: string[];        // ['sudden withdrawal', 'negative self-talk']
  };
  
  // flags for the dashboard
  flags: {
    breakthrough?: boolean;
    needsAttention?: boolean; // "worth checking in on this"
  };
}

export interface TopicInsight {
  topicName: string;
  frequency: number;
  trend: Trend;
  associatedEmotions: Emotion[];
  category?: TopicCategory;
}

export interface DailySummary {
  childId: string;
  date: string; // 'YYYY-MM-DD'
  totalConversations: number;
  totalMinutes: number;
  avgSentiment: number;
  dominantEmotion: Emotion;
  emotionDistribution: Record<Emotion, number>; // percentages 0–1
  topTopics: string[];
  emergingTopics: string[];  // new vs. previous weeks
  decliningTopics: string[];
  highlights: string[];      // 2–4 short "story" bullets
  notableEvents: string[];   // ['math test tomorrow', 'dance recital today']
  
  // soft-risk and growth signals
  stressLevel: 'low' | 'medium' | 'high';
  resilienceLevel: 'low' | 'medium' | 'high';
  curiosityLevel: 'low' | 'medium' | 'high';
}

export interface EmotionPoint {
  timestamp: Date;
  dominantEmotion: Emotion;
  emotionScore: number; // 0-100 scale
}

export interface Recommendation {
  id: string;
  childId: string;
  generatedAt: string;
  title: string;          // 'Join a beginner robotics club'
  description: string;
  category: 'afterschool' | 'club' | 'learning' | 'activity';
  relatedTopics: string[]; // ['robots', 'coding', 'engineering']
  reason: string;         // 'Based on excitement about space & building things'
  status: 'new' | 'saved' | 'dismissed' | 'completed';
}

export interface TopicTrajectory {
  childId: string;
  topic: string; // 'space', 'soccer', 'drawing'
  history: {
    date: string;
    mentions: number;
    avgSentiment: number;
  }[];
  currentTrend: 'emerging' | 'stable' | 'declining';
}

export interface GrowthMetrics {
  childId: string;
  month: string; // '2025-11'
  curiosityScore: number;    // based on question patterns
  communicationScore: number;
  resilienceScore: number;
  socialConnectionScore: number;
}

export interface UsageStats {
  childId: string;
  date: string;
  minutesUsed: number;
  sessionsCount: number;
}

export interface ParentSettings {
  childId: string;
  dailyTimeLimitMinutes: number;
  curfewStart: string; // '21:00'
  curfewEnd: string;   // '07:00'
  storeDetailedSummaries: boolean;  // vs. trends-only
  retentionDays: number;            // auto-delete after N days
}

// Parent Goals & AI Companion Settings
export type AcademicGoal = 
  | 'encourage_math_confidence'
  | 'encourage_reading'
  | 'encourage_science_curiosity'
  | 'encourage_creativity';

export type PersonalGrowthGoal = 
  | 'build_confidence'
  | 'support_emotional_regulation'
  | 'encourage_curiosity'
  | 'support_social_skills';

export type InterestTheme = 
  | 'space'
  | 'animals'
  | 'art'
  | 'robots'
  | 'magic'
  | 'sports'
  | 'music'
  | 'nature';

export interface ParentGoals {
  childId: string;
  academicGoal: AcademicGoal | null;
  personalGrowthGoal: PersonalGrowthGoal | null;
  interestThemes: InterestTheme[];
  interestExplorationEnabled: boolean;
  lastUpdated: string;
}

export interface ConfidenceSignal {
  subject: 'math' | 'reading' | 'science' | 'creativity' | 'school' | 'projects' | 'friends';
  level: 'low' | 'medium' | 'high';
  evidence: string[]; // Brief phrases from conversations
}

export interface BedtimeStory {
  id: string;
  childId: string;
  generatedAt: string;
  title: string;
  content: string;
  themes: string[];
  goals: string[];
  readAloud: boolean;
}

export interface ConversationGuidance {
  id: string;
  suggestion: string;
  category: 'confidence' | 'curiosity' | 'emotional' | 'social';
  relatedGoal?: AcademicGoal | PersonalGrowthGoal;
}

