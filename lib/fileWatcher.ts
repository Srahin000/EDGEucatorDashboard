// File watcher that reads conversations directly from disk
// Watches hacknyu/conversations/ directory and processes new conversations

import { Conversation, Emotion } from '@/types';
import { ingestLLMConversation } from './llmDataIngestion';

export interface VoiceAssistantMetadata {
  conversation_id: number;
  timestamp: string;
  date: string;
  time: string;
  user_query: string;
  harry_response: string;
  audio_file: string;
  transcript_file: string;
  sample_rate: number;
  audio_duration_seconds: number;
  stt_type: string;
  tts_type: string;
  wake_word_type: string;
}

/**
 * Convert voice assistant metadata to dashboard Conversation format
 * This is a basic conversion - you can enhance with LLM extraction later
 */
export function convertMetadataToConversation(
  metadata: VoiceAssistantMetadata,
  childId: string
): Partial<Conversation> {
  const startTime = new Date(metadata.timestamp);
  const endTime = new Date(startTime.getTime() + metadata.audio_duration_seconds * 1000);

  // Basic emotion detection from sentiment (you can enhance with LLM)
  const dominantEmotion = detectEmotionFromText(metadata.user_query + ' ' + metadata.harry_response);
  
  // Basic topic extraction (you can enhance with LLM)
  const topics = extractTopicsFromText(metadata.user_query + ' ' + metadata.harry_response);

  // Create conversation object
  const conversation: Partial<Conversation> = {
    id: `conv-${metadata.conversation_id}-${metadata.date}-${metadata.time}`,
    childId,
    startedAt: startTime.toISOString(),
    endedAt: endTime.toISOString(),
    durationSeconds: Math.round(metadata.audio_duration_seconds),
    summary: `${metadata.user_query} ${metadata.harry_response}`.substring(0, 200) + '...',
    keyPhrases: extractKeyPhrases(metadata.user_query, metadata.harry_response),
    topics,
    dominantEmotion,
    sentimentScore: calculateBasicSentiment(metadata.user_query, metadata.harry_response),
    emotionTimeline: [
      { secondOffset: 0, emotion: dominantEmotion },
    ],
    conversationInsight: {
      engagementLevel: 'medium', // Can be enhanced with LLM
      questionCount: (metadata.user_query.match(/\?/g) || []).length,
      questionTypes: extractQuestionTypes(metadata.user_query),
      avgUtteranceLength: metadata.user_query.split(' ').length,
      vocabularyComplexity: 50, // Can be enhanced with LLM
    },
    learningInsight: {
      struggleAreas: [],
      breakthroughMoments: [],
      skillsMentioned: extractSkills(metadata.user_query + ' ' + metadata.harry_response),
      learningMethods: [],
    },
    socialInsight: {
      friendsMentioned: [],
      empathyIndicators: [],
      socialConcerns: [],
    },
    wellbeingInsight: {
      stressTriggers: [],
      copingStrategies: [],
      resilienceSignals: [],
      warningSignals: [],
    },
    flags: {
      breakthrough: false,
      needsAttention: false,
    },
  };

  return conversation;
}

/**
 * Basic emotion detection (enhance with LLM later)
 */
function detectEmotionFromText(text: string): Emotion {
  const lower = text.toLowerCase();
  
  if (lower.includes('excited') || lower.includes('awesome') || lower.includes('cool')) {
    return 'Excited';
  }
  if (lower.includes('happy') || lower.includes('great') || lower.includes('love')) {
    return 'Happy';
  }
  if (lower.includes('worried') || lower.includes('nervous') || lower.includes('anxious')) {
    return 'Anxious';
  }
  if (lower.includes('frustrated') || lower.includes('hard') || lower.includes('difficult')) {
    return 'Frustrated';
  }
  if (lower.includes('curious') || lower.includes('wonder') || lower.includes('why') || lower.includes('how')) {
    return 'Curious';
  }
  
  return 'Neutral';
}

/**
 * Basic topic extraction (enhance with LLM later)
 */
function extractTopicsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const topics: string[] = [];

  // Simple keyword matching
  const topicKeywords: Record<string, string[]> = {
    'space': ['space', 'rocket', 'planet', 'star', 'mars', 'astronaut'],
    'math': ['math', 'number', 'count', 'add', 'subtract', 'multiply'],
    'science': ['science', 'experiment', 'chemistry', 'physics', 'biology'],
    'reading': ['book', 'read', 'story', 'chapter'],
    'art': ['draw', 'paint', 'art', 'color', 'picture'],
    'sports': ['sport', 'soccer', 'football', 'play', 'game'],
    'friends': ['friend', 'play', 'together', 'classmate'],
    'school': ['school', 'class', 'teacher', 'homework', 'test'],
    'coding': ['code', 'program', 'computer', 'robot'],
    'music': ['music', 'song', 'sing', 'piano'],
  };

  for (const [topic, keywords] of Object.entries(topicKeywords)) {
    if (keywords.some(keyword => lower.includes(keyword))) {
      topics.push(topic);
    }
  }

  return [...new Set(topics)]; // Remove duplicates
}

/**
 * Extract key phrases (enhance with LLM later)
 */
function extractKeyPhrases(userQuery: string, harryResponse: string): string[] {
  // Simple extraction - take first few words of each
  const phrases: string[] = [];
  
  const queryWords = userQuery.split(' ').slice(0, 5).join(' ');
  if (queryWords.length > 0) phrases.push(queryWords);
  
  const responseWords = harryResponse.split(' ').slice(0, 8).join(' ');
  if (responseWords.length > 0) phrases.push(responseWords);
  
  return phrases;
}

/**
 * Calculate basic sentiment score (enhance with LLM later)
 */
function calculateBasicSentiment(userQuery: string, harryResponse: string): number {
  const text = (userQuery + ' ' + harryResponse).toLowerCase();
  
  const positiveWords = ['happy', 'excited', 'great', 'awesome', 'love', 'cool', 'fun'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'worried', 'scared', 'hard', 'difficult'];
  
  let score = 50; // Neutral baseline
  
  positiveWords.forEach(word => {
    if (text.includes(word)) score += 10;
  });
  
  negativeWords.forEach(word => {
    if (text.includes(word)) score -= 10;
  });
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Extract question types
 */
function extractQuestionTypes(text: string): string[] {
  const types: string[] = [];
  const lower = text.toLowerCase();
  
  if (lower.includes('why')) types.push('why');
  if (lower.includes('how')) types.push('how');
  if (lower.includes('what if') || lower.includes('what-if')) types.push('what-if');
  if (lower.includes('what')) types.push('what');
  if (lower.includes('when')) types.push('when');
  if (lower.includes('where')) types.push('where');
  
  return types;
}

/**
 * Extract skills mentioned
 */
function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  const skills: string[] = [];
  
  if (lower.includes('read') || lower.includes('reading')) skills.push('reading');
  if (lower.includes('code') || lower.includes('coding') || lower.includes('program')) skills.push('coding');
  if (lower.includes('draw') || lower.includes('drawing') || lower.includes('art')) skills.push('drawing');
  if (lower.includes('math') || lower.includes('counting') || lower.includes('number')) skills.push('math');
  if (lower.includes('write') || lower.includes('writing')) skills.push('writing');
  
  return [...new Set(skills)];
}

/**
 * Scan conversations directory and process all conversations
 */
export async function scanConversationsDirectory(
  conversationsPath: string,
  childId: string
): Promise<{ processed: number; failed: number }> {
  let processed = 0;
  let failed = 0;

  try {
    // This will be called from the browser, so we need to use fetch API
    // For local file access, we'll need a different approach
    // See the alternative implementation below
    console.log('Scanning conversations directory:', conversationsPath);
    
    // Note: Browser security prevents direct file system access
    // We'll need to use a different approach (see alternative below)
    
  } catch (error) {
    console.error('Error scanning conversations directory:', error);
  }

  return { processed, failed };
}

