// Main entry point for ingesting LLM-processed conversation data
// This is what you call from your LLM pipeline after processing audio/transcript

import { Conversation } from '@/types';
import { processConversation, validateConversation, updateTopicTrajectory, calculateGrowthMetrics } from './conversationProcessor';

/**
 * Main function to ingest a conversation processed by the LLM
 * Call this after your LLM has extracted structured data from audio/transcript
 * 
 * @param conversationData - The structured conversation data from LLM
 * @returns true if successful, throws error if validation fails
 */
export function ingestLLMConversation(conversationData: Partial<Conversation>): boolean {
  // Validate the data
  if (!validateConversation(conversationData)) {
    throw new Error('Invalid conversation data: missing required fields');
  }

  const conversation = conversationData as Conversation;

  // Process and store the conversation
  processConversation(conversation);

  // Update topic trajectories for each topic mentioned
  const date = new Date(conversation.startedAt).toISOString().split('T')[0];
  conversation.topics.forEach(topic => {
    updateTopicTrajectory(conversation.childId, topic, date);
  });

  // Recalculate growth metrics for the current month
  const month = new Date(conversation.startedAt).toISOString().slice(0, 7); // YYYY-MM
  calculateGrowthMetrics(conversation.childId, month);

  return true;
}

/**
 * Batch ingest multiple conversations
 * Useful when processing multiple conversations at once
 */
export function ingestLLMConversations(conversations: Partial<Conversation>[]): {
  success: number;
  failed: number;
  errors: string[];
} {
  let success = 0;
  let failed = 0;
  const errors: string[] = [];

  conversations.forEach((conv, index) => {
    try {
      if (ingestLLMConversation(conv)) {
        success++;
      }
    } catch (error: any) {
      failed++;
      errors.push(`Conversation ${index}: ${error.message}`);
    }
  });

  return { success, failed, errors };
}

/**
 * Example: How to use this from your LLM pipeline
 * 
 * After processing audio → transcript → LLM extraction:
 * 
 * const conversationData = {
 *   id: generateId(),
 *   childId: 'child-123',
 *   startedAt: new Date().toISOString(),
 *   endedAt: new Date(Date.now() + 300000).toISOString(),
 *   durationSeconds: 300,
 *   summary: 'Child discussed space exploration and asked about rockets...',
 *   keyPhrases: ['rockets are cool', 'want to learn more'],
 *   topics: ['space', 'rockets', 'science'],
 *   dominantEmotion: 'Excited',
 *   sentimentScore: 85,
 *   emotionTimeline: [
 *     { secondOffset: 0, emotion: 'Neutral' },
 *     { secondOffset: 60, emotion: 'Excited' },
 *   ],
 *   conversationInsight: {
 *     engagementLevel: 'high',
 *     questionCount: 5,
 *     questionTypes: ['why', 'how'],
 *     avgUtteranceLength: 12,
 *     vocabularyComplexity: 75,
 *   },
 *   learningInsight: {
 *     struggleAreas: [],
 *     breakthroughMoments: ['understood rocket propulsion'],
 *     skillsMentioned: ['reading', 'science'],
 *     learningMethods: ['visual', 'hands-on'],
 *   },
 *   socialInsight: {
 *     friendsMentioned: [],
 *     empathyIndicators: [],
 *     socialConcerns: [],
 *   },
 *   wellbeingInsight: {
 *     stressTriggers: [],
 *     copingStrategies: ['asking questions'],
 *     resilienceSignals: ['tried to understand'],
 *     warningSignals: [],
 *   },
 *   flags: {
 *     breakthrough: true,
 *     needsAttention: false,
 *   },
 * };
 * 
 * ingestLLMConversation(conversationData);
 */


