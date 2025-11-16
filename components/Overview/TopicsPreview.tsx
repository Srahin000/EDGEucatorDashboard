'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getTopicsForChild } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getTopicColor, getTopicCategory } from '@/lib/topicUtils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export const TopicsPreview: React.FC = () => {
  const { selectedChild } = useChildContext();

  if (!selectedChild) return null;

  const topics = getTopicsForChild(selectedChild.id)
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);

  const chartData = topics.map(topic => ({
    name: topic.topicName,
    frequency: topic.frequency,
    color: getTopicColor(getTopicCategory(topic.topicName)),
  }));

  if (topics.length === 0) {
    return (
      <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-green">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Topics</h2>
        <p className="text-gray-500">No topic data available.</p>
      </div>
    );
  }

  return (
    <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-green">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Topics</h2>
      <div className="space-y-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" stroke="#6b7280" fontSize={12} />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#6b7280"
              fontSize={12}
              width={100}
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
        
        <div className="space-y-2">
          {topics.map((topic, index) => {
            const TrendIcon = topic.trend === 'up' ? ArrowUp : topic.trend === 'down' ? ArrowDown : Minus;
            const trendColor = topic.trend === 'up' ? '#10B981' : topic.trend === 'down' ? '#EF4444' : '#6B7280';
            
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">
                    {index + 1}. {topic.topicName}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({topic.frequency} mentions)
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

