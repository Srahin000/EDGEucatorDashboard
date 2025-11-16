'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChildContext } from '@/contexts/ChildContext';
import { getTopicsForChild } from '@/data/mockData';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export const InterestTrendsChart: React.FC = () => {
  const { selectedChild } = useChildContext();

  if (!selectedChild) return null;

  const topics = getTopicsForChild(selectedChild.id);
  
  // Get top 5 topics with trends
  const topTopics = topics
    .sort((a, b) => b.frequency - a.frequency)
    .slice(0, 5);

  // Create simple trend visualization
  const trendData = topTopics.map(topic => ({
    name: topic.topicName,
    frequency: topic.frequency,
    trend: topic.trend,
  }));

  return (
    <div className="bg-pastel-yellow rounded-xl p-6 shadow-lg border-2 border-yellow-200/50 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Interest Trends (Past Week)
      </h2>
      <div className="space-y-3">
        {trendData.map((item, idx) => {
          let TrendIcon = Minus;
          let trendColor = '#6B7280';
          
          if (item.trend === 'up') {
            TrendIcon = ArrowUp;
            trendColor = '#10B981';
          } else if (item.trend === 'down') {
            TrendIcon = ArrowDown;
            trendColor = '#EF4444';
          }

          return (
            <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
              <span className="text-gray-900 font-semibold capitalize">{item.name}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-medium">{item.frequency} mentions</span>
                <div className="p-1.5 rounded-md" style={{ backgroundColor: trendColor + '20' }}>
                  <TrendIcon className="w-4 h-4" style={{ color: trendColor }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {trendData.length === 0 && (
        <p className="text-gray-500 text-sm">No topic data available.</p>
      )}
    </div>
  );
};

