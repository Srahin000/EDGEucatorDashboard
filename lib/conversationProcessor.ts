// Utility functions for processing LLM-inferred conversation data
// These functions help aggregate and process conversation data from the LLM pipeline

import { Conversation, DailySummary, Emotion, TopicTrajectory, GrowthMetrics } from '@/types';
import { getChildData, updateChildData, addConversation } from './childDataStorage';

/**
 * Process and store a conversation from the LLM pipeline
 * This is called after the LLM has extracted structured data from audio/transcript
 */
export function processConversation(conversation: Conversation): void {
  // Validate required fields
  if (!conversation.id || !conversation.childId) {
    throw new Error('Conversation must have id and childId');
  }

  // Store the conversation
  addConversation(conversation.childId, conversation);

  // Update usage stats
  updateUsageStatsFromConversation(conversation);

  // Check if we need to regenerate daily summary
  const date = new Date(conversation.startedAt).toISOString().split('T')[0];
  regenerateDailySummary(conversation.childId, date);
}

/**
 * Update usage stats based on a conversation
 */
function updateUsageStatsFromConversation(conversation: Conversation): void {
  const { addUsageStats } = require('./childDataStorage');
  const date = new Date(conversation.startedAt).toISOString().split('T')[0];
  const minutes = Math.ceil(conversation.durationSeconds / 60);

  const childData = getChildData(conversation.childId);
  const existingStats = childData.usageStats.find(s => s.date === date);

  if (existingStats) {
    existingStats.minutesUsed += minutes;
    existingStats.sessionsCount += 1;
    addUsageStats(conversation.childId, existingStats);
  } else {
    addUsageStats(conversation.childId, {
      childId: conversation.childId,
      date,
      minutesUsed: minutes,
      sessionsCount: 1,
    });
  }
}

/**
 * Regenerate daily summary from all conversations for a specific date
 * This aggregates all conversation data into a daily summary
 */
export function regenerateDailySummary(childId: string, date: string): DailySummary {
  const childData = getChildData(childId);
  
  // Filter conversations for this date
  const dayConversations = childData.conversations.filter(conv => {
    const convDate = new Date(conv.startedAt).toISOString().split('T')[0];
    return convDate === date;
  });

  if (dayConversations.length === 0) {
    // Return empty summary if no conversations
    return createEmptyDailySummary(childId, date);
  }

  // Calculate aggregates
  const totalConversations = dayConversations.length;
  const totalMinutes = dayConversations.reduce((sum, conv) => 
    sum + Math.ceil(conv.durationSeconds / 60), 0
  );
  
  const avgSentiment = dayConversations.reduce((sum, conv) => 
    sum + conv.sentimentScore, 0
  ) / totalConversations;

  // Emotion distribution
  const emotionCounts: Record<Emotion, number> = {} as Record<Emotion, number>;
  dayConversations.forEach(conv => {
    emotionCounts[conv.dominantEmotion] = (emotionCounts[conv.dominantEmotion] || 0) + 1;
  });

  const emotionDistribution: Record<Emotion, number> = {} as Record<Emotion, number>;
  Object.entries(emotionCounts).forEach(([emotion, count]) => {
    emotionDistribution[emotion as Emotion] = count / totalConversations;
  });

  // Dominant emotion (most frequent)
  const dominantEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] as Emotion || 'Neutral';

  // Top topics
  const topicCounts: Record<string, number> = {};
  dayConversations.forEach(conv => {
    conv.topics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  });
  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic]) => topic);

  // Extract highlights (from conversations with flags or high engagement)
  const highlights: string[] = [];
  dayConversations.forEach(conv => {
    if (conv.flags.breakthrough) {
      highlights.push(`Breakthrough moment: ${conv.summary.substring(0, 100)}...`);
    }
    if (conv.conversationInsight.engagementLevel === 'high') {
      highlights.push(`High engagement: ${conv.summary.substring(0, 80)}...`);
    }
  });

  // Extract notable events (from key phrases mentioning events)
  const notableEvents: string[] = [];
  dayConversations.forEach(conv => {
    conv.keyPhrases.forEach(phrase => {
      const lower = phrase.toLowerCase();
      if (lower.includes('test') || lower.includes('quiz') || lower.includes('exam') ||
          lower.includes('recital') || lower.includes('game') || lower.includes('event')) {
        notableEvents.push(phrase);
      }
    });
  });

  // Calculate stress, resilience, and curiosity levels
  const stressLevel = calculateStressLevel(dayConversations);
  const resilienceLevel = calculateResilienceLevel(dayConversations);
  const curiosityLevel = calculateCuriosityLevel(dayConversations);

  // Get emerging/declining topics (compare with previous week)
  const { emergingTopics, decliningTopics } = calculateTopicTrends(childId, date, topTopics);

  const summary: DailySummary = {
    childId,
    date,
    totalConversations,
    totalMinutes,
    avgSentiment,
    dominantEmotion,
    emotionDistribution,
    topTopics,
    emergingTopics,
    decliningTopics,
    highlights: highlights.slice(0, 4),
    notableEvents: [...new Set(notableEvents)].slice(0, 5),
    stressLevel,
    resilienceLevel,
    curiosityLevel,
  };

  // Update or add to daily summaries
  const childDataUpdated = getChildData(childId);
  const existingIndex = childDataUpdated.dailySummaries.findIndex(s => s.date === date);
  
  if (existingIndex >= 0) {
    childDataUpdated.dailySummaries[existingIndex] = summary;
  } else {
    childDataUpdated.dailySummaries.push(summary);
  }
  
  updateChildData(childId, { dailySummaries: childDataUpdated.dailySummaries });

  return summary;
}

/**
 * Create an empty daily summary for a date with no conversations
 */
function createEmptyDailySummary(childId: string, date: string): DailySummary {
  return {
    childId,
    date,
    totalConversations: 0,
    totalMinutes: 0,
    avgSentiment: 50,
    dominantEmotion: 'Neutral',
    emotionDistribution: {} as Record<Emotion, number>,
    topTopics: [],
    emergingTopics: [],
    decliningTopics: [],
    highlights: [],
    notableEvents: [],
    stressLevel: 'low',
    resilienceLevel: 'medium',
    curiosityLevel: 'medium',
  };
}

/**
 * Calculate stress level from conversations
 */
function calculateStressLevel(conversations: Conversation[]): 'low' | 'medium' | 'high' {
  let stressIndicators = 0;
  
  conversations.forEach(conv => {
    stressIndicators += conv.wellbeingInsight.stressTriggers.length;
    stressIndicators += conv.wellbeingInsight.warningSignals.length;
    if (conv.dominantEmotion === 'Anxious' || conv.dominantEmotion === 'Stressed') {
      stressIndicators += 2;
    }
  });

  if (stressIndicators === 0) return 'low';
  if (stressIndicators <= 3) return 'medium';
  return 'high';
}

/**
 * Calculate resilience level from conversations
 */
function calculateResilienceLevel(conversations: Conversation[]): 'low' | 'medium' | 'high' {
  let resilienceSignals = 0;
  
  conversations.forEach(conv => {
    resilienceSignals += conv.wellbeingInsight.resilienceSignals.length;
    resilienceSignals += conv.learningInsight.breakthroughMoments.length;
    if (conv.flags.breakthrough) {
      resilienceSignals += 2;
    }
  });

  if (resilienceSignals === 0) return 'low';
  if (resilienceSignals <= 3) return 'medium';
  return 'high';
}

/**
 * Calculate curiosity level from conversations
 */
function calculateCuriosityLevel(conversations: Conversation[]): 'low' | 'medium' | 'high' {
  let totalQuestions = 0;
  let complexQuestions = 0;
  
  conversations.forEach(conv => {
    totalQuestions += conv.conversationInsight.questionCount;
    complexQuestions += conv.conversationInsight.questionTypes.filter(
      type => type === 'why' || type === 'how' || type === 'what-if'
    ).length;
  });

  const avgQuestions = totalQuestions / conversations.length;
  const complexRatio = totalQuestions > 0 ? complexQuestions / totalQuestions : 0;

  if (avgQuestions < 2 || complexRatio < 0.2) return 'low';
  if (avgQuestions < 5 || complexRatio < 0.4) return 'medium';
  return 'high';
}

/**
 * Calculate topic trends (emerging vs declining)
 */
function calculateTopicTrends(
  childId: string, 
  currentDate: string, 
  currentTopics: string[]
): { emergingTopics: string[]; decliningTopics: string[] } {
  const childData = getChildData(childId);
  
  // Get date 7 days ago
  const dateObj = new Date(currentDate);
  dateObj.setDate(dateObj.getDate() - 7);
  const weekAgoDate = dateObj.toISOString().split('T')[0];

  // Get topics from a week ago
  const weekAgoSummary = childData.dailySummaries.find(s => s.date === weekAgoDate);
  const previousTopics = weekAgoSummary?.topTopics || [];

  // Topics that are new (emerging)
  const emergingTopics = currentTopics.filter(topic => !previousTopics.includes(topic));

  // Topics that were in previous week but not now (declining)
  const decliningTopics = previousTopics.filter(topic => !currentTopics.includes(topic));

  return { emergingTopics, decliningTopics };
}

/**
 * Update topic trajectory based on new conversation data
 */
export function updateTopicTrajectory(childId: string, topic: string, date: string): void {
  const childData = getChildData(childId);
  
  // Get conversations for this date that mention the topic
  const dayConversations = childData.conversations.filter(conv => {
    const convDate = new Date(conv.startedAt).toISOString().split('T')[0];
    return convDate === date && conv.topics.includes(topic);
  });

  if (dayConversations.length === 0) return;

  const mentions = dayConversations.length;
  const avgSentiment = dayConversations.reduce((sum, conv) => 
    sum + conv.sentimentScore, 0
  ) / dayConversations.length;

  // Find or create trajectory
  let trajectory = childData.topicTrajectories.find(t => t.topic === topic);
  
  if (!trajectory) {
    trajectory = {
      childId,
      topic,
      history: [],
      currentTrend: 'emerging',
    };
  }

  // Add or update history entry for this date
  const historyIndex = trajectory.history.findIndex(h => h.date === date);
  if (historyIndex >= 0) {
    trajectory.history[historyIndex] = { date, mentions, avgSentiment };
  } else {
    trajectory.history.push({ date, mentions, avgSentiment });
  }

  // Sort history by date
  trajectory.history.sort((a, b) => a.date.localeCompare(b.date));

  // Calculate trend (compare last 7 days vs previous 7 days)
  if (trajectory.history.length >= 14) {
    const recent = trajectory.history.slice(-7);
    const previous = trajectory.history.slice(-14, -7);
    
    const recentAvg = recent.reduce((sum, h) => sum + h.mentions, 0) / 7;
    const previousAvg = previous.reduce((sum, h) => sum + h.mentions, 0) / 7;

    if (recentAvg > previousAvg * 1.2) {
      trajectory.currentTrend = 'emerging';
    } else if (recentAvg < previousAvg * 0.8) {
      trajectory.currentTrend = 'declining';
    } else {
      trajectory.currentTrend = 'stable';
    }
  }

  const { addTopicTrajectory } = require('./childDataStorage');
  addTopicTrajectory(childId, trajectory);
}

/**
 * Calculate and update growth metrics for a month
 */
export function calculateGrowthMetrics(childId: string, month: string): GrowthMetrics {
  const childData = getChildData(childId);
  
  // Get all conversations for this month
  const monthConversations = childData.conversations.filter(conv => {
    const convMonth = new Date(conv.startedAt).toISOString().slice(0, 7); // YYYY-MM
    return convMonth === month;
  });

  if (monthConversations.length === 0) {
    return {
      childId,
      month,
      curiosityScore: 50,
      communicationScore: 50,
      resilienceScore: 50,
      socialConnectionScore: 50,
    };
  }

  // Curiosity score (based on question patterns)
  const totalQuestions = monthConversations.reduce((sum, conv) => 
    sum + conv.conversationInsight.questionCount, 0
  );
  const complexQuestions = monthConversations.reduce((sum, conv) => 
    sum + conv.conversationInsight.questionTypes.filter(
      type => type === 'why' || type === 'how' || type === 'what-if'
    ).length, 0
  );
  const curiosityScore = Math.min(100, Math.round(
    (totalQuestions / monthConversations.length) * 10 + 
    (complexQuestions / totalQuestions) * 50
  ));

  // Communication score (based on engagement and vocabulary)
  const avgEngagement = monthConversations.reduce((sum, conv) => {
    const level = conv.conversationInsight.engagementLevel;
    const score = level === 'high' ? 3 : level === 'medium' ? 2 : 1;
    return sum + score;
  }, 0) / monthConversations.length;
  
  const avgVocabulary = monthConversations.reduce((sum, conv) => 
    sum + conv.conversationInsight.vocabularyComplexity, 0
  ) / monthConversations.length;
  
  const communicationScore = Math.min(100, Math.round(
    (avgEngagement / 3) * 50 + (avgVocabulary / 100) * 50
  ));

  // Resilience score (based on resilience signals and breakthroughs)
  const resilienceSignals = monthConversations.reduce((sum, conv) => 
    sum + conv.wellbeingInsight.resilienceSignals.length +
    conv.learningInsight.breakthroughMoments.length +
    (conv.flags.breakthrough ? 2 : 0), 0
  );
  const resilienceScore = Math.min(100, Math.round(
    (resilienceSignals / monthConversations.length) * 20 + 50
  ));

  // Social connection score (based on social insights)
  const socialIndicators = monthConversations.reduce((sum, conv) => 
    sum + conv.socialInsight.friendsMentioned.length +
    conv.socialInsight.empathyIndicators.length -
    conv.socialInsight.socialConcerns.length, 0
  );
  const socialConnectionScore = Math.min(100, Math.max(0, Math.round(
    (socialIndicators / monthConversations.length) * 15 + 50
  )));

  const metrics: GrowthMetrics = {
    childId,
    month,
    curiosityScore,
    communicationScore,
    resilienceScore,
    socialConnectionScore,
  };

  const { addGrowthMetrics } = require('./childDataStorage');
  addGrowthMetrics(childId, metrics);

  return metrics;
}

/**
 * Validate conversation data from LLM
 * Ensures all required fields are present and valid
 */
export function validateConversation(conversation: Partial<Conversation>): conversation is Conversation {
  if (!conversation.id || !conversation.childId) return false;
  if (!conversation.startedAt || !conversation.endedAt) return false;
  if (typeof conversation.durationSeconds !== 'number') return false;
  if (!conversation.summary || !conversation.topics) return false;
  if (!conversation.dominantEmotion || !conversation.sentimentScore) return false;
  if (!conversation.conversationInsight || !conversation.learningInsight) return false;
  if (!conversation.socialInsight || !conversation.wellbeingInsight) return false;
  if (!conversation.flags) return false;
  
  return true;
}


