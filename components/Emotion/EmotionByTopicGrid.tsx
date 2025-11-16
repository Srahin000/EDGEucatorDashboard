'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getTopicsForChild, getConversationsForChild } from '@/data/mockData';
import { getTopicColor, getTopicCategory, getTopicIcon } from '@/lib/topicUtils';
import { getEmotionColor, getEmotionBgColor } from '@/lib/emotionUtils';

export const EmotionByTopicGrid: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const topics = getTopicsForChild(selectedChild.id);
  const conversations = getConversationsForChild(selectedChild.id, dateRange);

  // For each topic, find associated emotions
  const topicEmotionMap: Record<string, { emotions: string[]; dominant: string }> = {};

  topics.forEach(topic => {
    const topicConversations = conversations.filter(conv => 
      conv.topics.includes(topic.topicName)
    );
    
    if (topicConversations.length > 0) {
      const emotionCounts: Record<string, number> = {};
      topicConversations.forEach(conv => {
        emotionCounts[conv.dominantEmotion] = (emotionCounts[conv.dominantEmotion] || 0) + 1;
      });
      
      const dominantEmotion = Object.entries(emotionCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Neutral';
      
      const allEmotions = Object.keys(emotionCounts);
      
      topicEmotionMap[topic.topicName] = {
        emotions: allEmotions,
        dominant: dominantEmotion,
      };
    }
  });

  if (topics.length === 0) {
    return (
      <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-purple">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Emotions by Topic</h2>
        <p className="text-gray-500">No topic data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-purple">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Emotions by Topic</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {topics.slice(0, 9).map((topic, index) => {
          const category = getTopicCategory(topic.topicName);
          const TopicIcon = getTopicIcon(category);
          const topicColor = getTopicColor(category);
          const emotionData = topicEmotionMap[topic.topicName];
          
          if (!emotionData) return null;

          return (
            <div
              key={index}
              className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${topicColor}15` }}
                >
                  <TopicIcon className="w-5 h-5" style={{ color: topicColor }} />
                </div>
                <h3 className="font-semibold text-gray-900">{topic.topicName}</h3>
              </div>
              
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Dominant Emotion:</p>
                  <span
                    className="inline-block px-2 py-1 rounded text-xs font-medium"
                    style={{
                      backgroundColor: getEmotionBgColor(emotionData.dominant as any),
                      color: getEmotionColor(emotionData.dominant as any),
                    }}
                  >
                    {emotionData.dominant}
                  </span>
                </div>
                
                {emotionData.emotions.length > 1 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Also Associated:</p>
                    <div className="flex flex-wrap gap-1">
                      {emotionData.emotions
                        .filter(e => e !== emotionData.dominant)
                        .slice(0, 2)
                        .map((emotion, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2 py-0.5 rounded text-xs"
                            style={{
                              backgroundColor: getEmotionBgColor(emotion as any),
                              color: getEmotionColor(emotion as any),
                            }}
                          >
                            {emotion}
                          </span>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

