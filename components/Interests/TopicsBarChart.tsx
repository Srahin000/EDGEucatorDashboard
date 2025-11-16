'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getTopicsForChild } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getTopicColor, getTopicCategory } from '@/lib/topicUtils';

export const TopicsBarChart: React.FC = () => {
  const { selectedChild } = useChildContext();

  if (!selectedChild) return null;

  const topics = getTopicsForChild(selectedChild.id)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 10);

  const chartData = topics.map(topic => ({
    name: topic.topicName,
    frequency: topic.frequency,
    color: getTopicColor(getTopicCategory(topic.topicName)),
  }));

  if (chartData.length === 0) {
    return (
      <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-orange mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Topic Frequency</h2>
        <p className="text-gray-500">No topic data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-orange mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Topic Frequency</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis type="number" stroke="#6b7280" fontSize={12} />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke="#6b7280"
            fontSize={12}
            width={120}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Bar dataKey="frequency" radius={[0, 8, 8, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

