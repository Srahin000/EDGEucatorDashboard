import { Conversation, EmotionPoint, DailySummary, DateRange } from '@/types';
import { getDateRange } from './dateUtils';

export const filterConversationsByDateRange = (
  conversations: Conversation[],
  range: DateRange
): Conversation[] => {
  if (range === 'custom') {
    return conversations; // Custom would need actual date selection
  }
  
  const { start } = getDateRange(range);
  return conversations.filter(conv => conv.timestamp >= start);
};

export const filterEmotionPointsByDateRange = (
  points: EmotionPoint[],
  range: DateRange
): EmotionPoint[] => {
  if (range === 'custom') {
    return points;
  }
  
  const { start } = getDateRange(range);
  return points.filter(point => point.timestamp >= start);
};

export const filterDailySummariesByDateRange = (
  summaries: DailySummary[],
  range: DateRange
): DailySummary[] => {
  if (range === 'custom') {
    return summaries;
  }
  
  const { start } = getDateRange(range);
  return summaries.filter(summary => summary.date >= start);
};

export const groupConversationsByDate = (
  conversations: Conversation[]
): Record<string, Conversation[]> => {
  const grouped: Record<string, Conversation[]> = {};
  
  conversations.forEach(conv => {
    const dateKey = conv.timestamp.toDateString();
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(conv);
  });
  
  return grouped;
};

export const getTopTopics = (
  conversations: Conversation[],
  limit: number = 5
): Array<{ topic: string; count: number }> => {
  const topicCounts: Record<string, number> = {};
  
  conversations.forEach(conv => {
    conv.topics.forEach(topic => {
      topicCounts[topic] = (topicCounts[topic] || 0) + 1;
    });
  });
  
  return Object.entries(topicCounts)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
};

export const getEmotionDistribution = (
  conversations: Conversation[]
): Record<string, number> => {
  const distribution: Record<string, number> = {};
  
  conversations.forEach(conv => {
    const emotion = conv.dominantEmotion;
    distribution[emotion] = (distribution[emotion] || 0) + 1;
  });
  
  return distribution;
};

