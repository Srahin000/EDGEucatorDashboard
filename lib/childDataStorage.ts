// Client-side storage for child-specific data
// This creates a schema/storage for each child's conversations, emotions, topics, etc.

import { 
  Child, 
  Conversation, 
  TopicInsight, 
  DailySummary, 
  EmotionPoint, 
  Recommendation,
  TopicTrajectory,
  GrowthMetrics,
  UsageStats,
  ParentSettings
} from '@/types';

export interface ChildDataSchema {
  childId: string;
  conversations: Conversation[];
  topics: TopicInsight[];
  dailySummaries: DailySummary[];
  emotionPoints: EmotionPoint[];
  recommendations: Recommendation[];
  topicTrajectories: TopicTrajectory[];
  growthMetrics: GrowthMetrics[];
  usageStats: UsageStats[];
  parentSettings?: ParentSettings;
  lastUpdated: string;
}

export interface AllChildrenData {
  children: Record<string, ChildDataSchema>; // childId -> ChildDataSchema
  lastUpdated: string;
}

const STORAGE_KEY = 'childDataSchemas';

/**
 * Initialize an empty data schema for a new child
 */
export function initializeChildData(childId: string, defaultSettings?: Partial<ParentSettings>): ChildDataSchema {
  return {
    childId,
    conversations: [],
    topics: [],
    dailySummaries: [],
    emotionPoints: [],
    recommendations: [],
    topicTrajectories: [],
    growthMetrics: [],
    usageStats: [],
    parentSettings: defaultSettings || {
      childId,
      dailyTimeLimitMinutes: 60,
      curfewStart: '21:00',
      curfewEnd: '07:00',
      storeDetailedSummaries: true,
      retentionDays: 365,
    },
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get all children data schemas from localStorage
 */
export function getAllChildrenData(): AllChildrenData {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading children data:', error);
  }
  
  return {
    children: {},
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Get data schema for a specific child
 */
export function getChildData(childId: string): ChildDataSchema {
  const allData = getAllChildrenData();
  
  if (!allData.children[childId]) {
    // Initialize if doesn't exist
    allData.children[childId] = initializeChildData(childId);
    saveAllChildrenData(allData);
  }
  
  return allData.children[childId];
}

/**
 * Save all children data schemas to localStorage
 */
export function saveAllChildrenData(data: AllChildrenData): void {
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving children data:', error);
  }
}

/**
 * Update data for a specific child
 */
export function updateChildData(childId: string, updates: Partial<ChildDataSchema>): void {
  const allData = getAllChildrenData();
  
  if (!allData.children[childId]) {
    allData.children[childId] = initializeChildData(childId);
  }
  
  allData.children[childId] = {
    ...allData.children[childId],
    ...updates,
    lastUpdated: new Date().toISOString(),
  };
  
  saveAllChildrenData(allData);
}

/**
 * Add a conversation to a child's data
 */
export function addConversation(childId: string, conversation: Conversation): void {
  const childData = getChildData(childId);
  childData.conversations.push(conversation);
  updateChildData(childId, { conversations: childData.conversations });
}

/**
 * Add a topic insight to a child's data
 */
export function addTopicInsight(childId: string, topic: TopicInsight): void {
  const childData = getChildData(childId);
  
  // Update existing topic or add new one
  const existingIndex = childData.topics.findIndex(t => t.topicName === topic.topicName);
  if (existingIndex >= 0) {
    childData.topics[existingIndex] = topic;
  } else {
    childData.topics.push(topic);
  }
  
  updateChildData(childId, { topics: childData.topics });
}

/**
 * Add a daily summary to a child's data
 */
export function addDailySummary(childId: string, summary: DailySummary): void {
  const childData = getChildData(childId);
  childData.dailySummaries.push(summary);
  updateChildData(childId, { dailySummaries: childData.dailySummaries });
}

/**
 * Add an emotion point to a child's data
 */
export function addEmotionPoint(childId: string, emotion: EmotionPoint): void {
  const childData = getChildData(childId);
  childData.emotionPoints.push(emotion);
  updateChildData(childId, { emotionPoints: childData.emotionPoints });
}

/**
 * Add a recommendation to a child's data
 */
export function addRecommendation(childId: string, recommendation: Recommendation): void {
  const childData = getChildData(childId);
  childData.recommendations.push(recommendation);
  updateChildData(childId, { recommendations: childData.recommendations });
}

/**
 * Add a topic trajectory to a child's data
 */
export function addTopicTrajectory(childId: string, trajectory: TopicTrajectory): void {
  const childData = getChildData(childId);
  
  // Update existing trajectory or add new one
  const existingIndex = childData.topicTrajectories.findIndex(t => t.topic === trajectory.topic);
  if (existingIndex >= 0) {
    childData.topicTrajectories[existingIndex] = trajectory;
  } else {
    childData.topicTrajectories.push(trajectory);
  }
  
  updateChildData(childId, { topicTrajectories: childData.topicTrajectories });
}

/**
 * Add growth metrics to a child's data
 */
export function addGrowthMetrics(childId: string, metrics: GrowthMetrics): void {
  const childData = getChildData(childId);
  
  // Update existing metrics for the month or add new one
  const existingIndex = childData.growthMetrics.findIndex(m => m.month === metrics.month);
  if (existingIndex >= 0) {
    childData.growthMetrics[existingIndex] = metrics;
  } else {
    childData.growthMetrics.push(metrics);
  }
  
  updateChildData(childId, { growthMetrics: childData.growthMetrics });
}

/**
 * Add usage stats to a child's data
 */
export function addUsageStats(childId: string, stats: UsageStats): void {
  const childData = getChildData(childId);
  
  // Update existing stats for the date or add new one
  const existingIndex = childData.usageStats.findIndex(s => s.date === stats.date);
  if (existingIndex >= 0) {
    childData.usageStats[existingIndex] = stats;
  } else {
    childData.usageStats.push(stats);
  }
  
  updateChildData(childId, { usageStats: childData.usageStats });
}

/**
 * Update parent settings for a child
 */
export function updateParentSettings(childId: string, settings: Partial<ParentSettings>): void {
  const childData = getChildData(childId);
  childData.parentSettings = {
    ...childData.parentSettings!,
    ...settings,
    childId, // Ensure childId is always set
  };
  updateChildData(childId, { parentSettings: childData.parentSettings });
}

/**
 * Delete all data for a child (when child is removed)
 */
export function deleteChildData(childId: string): void {
  const allData = getAllChildrenData();
  delete allData.children[childId];
  saveAllChildrenData(allData);
}

/**
 * Initialize data schemas for multiple children (used during signup)
 */
export function initializeChildrenData(childIds: string[]): void {
  const allData = getAllChildrenData();
  
  childIds.forEach(childId => {
    if (!allData.children[childId]) {
      allData.children[childId] = initializeChildData(childId);
    }
  });
  
  saveAllChildrenData(allData);
}

