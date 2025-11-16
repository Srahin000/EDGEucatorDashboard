'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getConversationsForChild } from '@/data/mockData';
import { formatDateTime } from '@/lib/dateUtils';
import { getEmotionColor, getEmotionBgColor, getEmotionIcon } from '@/lib/emotionUtils';
import { getTopicColor, getTopicCategory } from '@/lib/topicUtils';
import { Conversation } from '@/types';

interface ConversationListProps {
  onConversationClick: (conversation: Conversation) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({ onConversationClick }) => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const conversations = getConversationsForChild(selectedChild.id, dateRange);

  if (conversations.length === 0) {
    return (
      <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-primary-blue">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h2>
        <p className="text-gray-500">No conversations found for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {conversations.map((conversation) => {
        const EmotionIcon = getEmotionIcon(conversation.dominantEmotion);
        const emotionColor = getEmotionColor(conversation.dominantEmotion);

        return (
          <div
            key={conversation.id}
            onClick={() => onConversationClick(conversation)}
            className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-primary-blue hover:shadow-card-hover cursor-pointer transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: getEmotionBgColor(conversation.dominantEmotion) }}
                >
                  <EmotionIcon className="w-5 h-5" style={{ color: emotionColor }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatDateTime(conversation.timestamp)}
                  </p>
                  <span
                    className="inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium"
                    style={{
                      backgroundColor: getEmotionBgColor(conversation.dominantEmotion),
                      color: emotionColor,
                    }}
                  >
                    {conversation.dominantEmotion}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2">{conversation.summary}</p>

            {conversation.topics.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {conversation.topics.slice(0, 5).map((topic, index) => {
                  const category = getTopicCategory(topic);
                  const topicColor = getTopicColor(category);
                  return (
                    <span
                      key={index}
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${topicColor}15`,
                        color: topicColor,
                      }}
                    >
                      {topic}
                    </span>
                  );
                })}
                {conversation.topics.length > 5 && (
                  <span className="px-2 py-1 rounded text-xs text-gray-500">
                    +{conversation.topics.length - 5} more
                  </span>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

