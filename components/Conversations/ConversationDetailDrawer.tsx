'use client';

import React from 'react';
import { Conversation } from '@/types';
import { formatDateTime } from '@/lib/dateUtils';
import { getEmotionColor, getEmotionBgColor, getEmotionIcon } from '@/lib/emotionUtils';
import { getTopicColor, getTopicCategory } from '@/lib/topicUtils';
import { X } from 'lucide-react';

interface ConversationDetailDrawerProps {
  conversation: Conversation | null;
  onClose: () => void;
}

export const ConversationDetailDrawer: React.FC<ConversationDetailDrawerProps> = ({
  conversation,
  onClose,
}) => {
  if (!conversation) return null;

  const EmotionIcon = getEmotionIcon(conversation.dominantEmotion);
  const emotionColor = getEmotionColor(conversation.dominantEmotion);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-lightgreen rounded-lg shadow-card-hover max-w-3xl w-full max-h-[90vh] overflow-y-auto border-l-4 border-primary-blue">
        <div className="sticky top-0 bg-lightgreen border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: getEmotionBgColor(conversation.dominantEmotion) }}
            >
              <EmotionIcon className="w-6 h-6" style={{ color: emotionColor }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Conversation Details</h2>
              <p className="text-sm text-gray-500">{formatDateTime(conversation.timestamp)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Summary</h3>
            <p className="text-gray-700 leading-relaxed">{conversation.summary}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Dominant Emotion</h3>
            <span
              className="inline-block px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: getEmotionBgColor(conversation.dominantEmotion),
                color: emotionColor,
              }}
            >
              {conversation.dominantEmotion}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Topics Discussed</h3>
            <div className="flex flex-wrap gap-2">
              {conversation.topics.map((topic, index) => {
                const category = getTopicCategory(topic);
                const topicColor = getTopicColor(category);
                return (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium"
                    style={{
                      backgroundColor: `${topicColor}15`,
                      color: topicColor,
                    }}
                  >
                    {topic}
                  </span>
                );
              })}
            </div>
          </div>

          {conversation.highlightPhrases.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Key Highlights</h3>
              <div className="space-y-2">
                {conversation.highlightPhrases.map((phrase, index) => (
                  <div
                    key={index}
                    className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded"
                  >
                    <p className="text-gray-700 italic">"{phrase}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

