'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useChildContext } from '@/contexts/ChildContext';
import { getConversationsForChild } from '@/data/mockData';
import { getEmotionColor } from '@/lib/emotionUtils';

export const EmotionBreakdown: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const conversations = getConversationsForChild(selectedChild.id, dateRange);

  // Count emotions
  const emotionCounts: Record<string, number> = {};
  conversations.forEach(conv => {
    emotionCounts[conv.dominantEmotion] = (emotionCounts[conv.dominantEmotion] || 0) + 1;
  });

  const chartData = Object.entries(emotionCounts).map(([name, value]) => ({
    name,
    value,
    color: getEmotionColor(name as any),
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-purple mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Emotion Distribution</h2>
        <p className="text-gray-500">No emotion data available for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-purple mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Emotion Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

