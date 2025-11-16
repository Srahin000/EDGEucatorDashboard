'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getTopicsForChild } from '@/data/mockData';
import { getTopicColor, getTopicCategory, getTopicIcon } from '@/lib/topicUtils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { TopicInsight } from '@/types';

interface TopTopicsListProps {
  onTopicClick?: (topic: TopicInsight) => void;
}

export const TopTopicsList: React.FC<TopTopicsListProps> = ({ onTopicClick }) => {
  const { selectedChild } = useChildContext();

  if (!selectedChild) return null;

  const topics = getTopicsForChild(selectedChild.id)
    .sort((a, b) => b.frequency - a.frequency);

  if (topics.length === 0) {
    return (
      <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-orange">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Topics</h2>
        <p className="text-gray-500">No topic data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-orange mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">All Topics</h2>
      <div className="space-y-3">
        {topics.map((topic, index) => {
          const category = getTopicCategory(topic.topicName);
          const TopicIcon = getTopicIcon(category);
          const topicColor = getTopicColor(category);
          const TrendIcon = topic.trend === 'up' ? ArrowUp : topic.trend === 'down' ? ArrowDown : Minus;
          const trendColor = topic.trend === 'up' ? '#10B981' : topic.trend === 'down' ? '#EF4444' : '#6B7280';

          return (
            <div
              key={index}
              onClick={() => onTopicClick?.(topic)}
              className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-200 ${
                onTopicClick ? 'cursor-pointer hover:shadow-sm' : ''
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: `${topicColor}15` }}
                >
                  <TopicIcon className="w-5 h-5" style={{ color: topicColor }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{topic.topicName}</h3>
                    <span className="text-xs px-2 py-0.5 bg-gray-200 text-gray-700 rounded-md">
                      {category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Mentioned {topic.frequency} time{topic.frequency !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TrendIcon className="w-5 h-5" style={{ color: trendColor }} />
                <span className="text-sm font-medium" style={{ color: trendColor }}>
                  {topic.trend}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

