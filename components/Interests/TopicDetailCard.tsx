'use client';

import React, { useState } from 'react';
import { TopicInsight } from '@/types';
import { getTopicColor, getTopicCategory, getTopicIcon } from '@/lib/topicUtils';
import { getEmotionColor, getEmotionBgColor } from '@/lib/emotionUtils';
import { X } from 'lucide-react';

interface TopicDetailCardProps {
  topic: TopicInsight | null;
  onClose: () => void;
}

export const TopicDetailCard: React.FC<TopicDetailCardProps> = ({ topic, onClose }) => {
  if (!topic) return null;

  const category = getTopicCategory(topic.topicName);
  const TopicIcon = getTopicIcon(category);
  const topicColor = getTopicColor(category);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-lightgreen rounded-lg shadow-card-hover max-w-2xl w-full max-h-[90vh] overflow-y-auto border-l-4 border-accent-orange">
        <div className="sticky top-0 bg-lightgreen border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${topicColor}15` }}
            >
              <TopicIcon className="w-6 h-6" style={{ color: topicColor }} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{topic.topicName}</h2>
              <p className="text-sm text-gray-500">{category}</p>
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
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Frequency</h3>
            <p className="text-lg text-gray-900">
              Mentioned <span className="font-bold">{topic.frequency}</span> time{topic.frequency !== 1 ? 's' : ''} in conversations
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Associated Emotions</h3>
            <div className="flex flex-wrap gap-2">
              {topic.associatedEmotions.map((emotion, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: getEmotionBgColor(emotion),
                    color: getEmotionColor(emotion),
                  }}
                >
                  {emotion}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Trend</h3>
            <p className="text-gray-900 capitalize">
              This topic is trending <span className="font-semibold">{topic.trend}</span> in recent conversations.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 italic">
              "Often talks about {topic.topicName.toLowerCase()} when describing favorite activities and interests."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

