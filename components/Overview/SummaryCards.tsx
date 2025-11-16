'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getConversationsForChild, getTopicsForChild } from '@/data/mockData';
import { MessageSquare, Smile, Heart, Sparkles } from 'lucide-react';
import { getEmotionColor, getEmotionIcon } from '@/lib/emotionUtils';

export const SummaryCards: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const conversations = getConversationsForChild(selectedChild.id, dateRange);
  const topics = getTopicsForChild(selectedChild.id);
  
  const totalConversations = conversations.length;
  
  // Get most common emotion
  const emotionCounts: Record<string, number> = {};
  conversations.forEach(conv => {
    emotionCounts[conv.dominantEmotion] = (emotionCounts[conv.dominantEmotion] || 0) + 1;
  });
  const topEmotion = Object.entries(emotionCounts)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'Neutral';
  const EmotionIcon = getEmotionIcon(topEmotion as any);
  const emotionColor = getEmotionColor(topEmotion as any);
  
  // Get top topic
  const topTopic = topics.sort((a, b) => b.frequency - a.frequency)[0];
  
  // Get new/emerging interest (topic with upward trend)
  const emergingInterest = topics
    .filter(t => t.trend === 'up')
    .sort((a, b) => b.frequency - a.frequency)[0];

  const cards = [
    {
      title: 'Total Conversations',
      value: totalConversations.toString(),
      icon: MessageSquare,
      bgColor: '#2563EB', // Blue
      textColor: '#FFFFFF',
    },
    {
      title: 'Average Emotion',
      value: topEmotion,
      icon: EmotionIcon,
      bgColor: emotionColor || '#8B5CF6', // Purple default
      textColor: '#FFFFFF',
    },
    {
      title: 'Top Interest',
      value: topTopic?.topicName || 'N/A',
      icon: Heart,
      bgColor: '#FBBF24', // Yellow
      textColor: '#FFFFFF',
    },
    {
      title: 'New Interest',
      value: emergingInterest?.topicName || 'None',
      icon: Sparkles,
      bgColor: '#10B981', // Green
      textColor: '#FFFFFF',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 border-2"
            style={{ 
              backgroundColor: card.bgColor,
              color: card.textColor,
              borderColor: card.bgColor + '40',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold opacity-90">{card.title}</p>
              <div className="p-2.5 rounded-lg bg-white bg-opacity-25 shadow-md">
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-4xl font-bold">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
};

