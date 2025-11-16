'use client';

import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useChildContext } from '@/contexts/ChildContext';
import { getEmotionsForChild } from '@/data/mockData';
import { formatDateShort } from '@/lib/dateUtils';
import { getEmotionColor } from '@/lib/emotionUtils';
import { Emotion } from '@/types';

export const EmotionTimeline: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const emotionPoints = getEmotionsForChild(selectedChild.id, dateRange);

  // Group by date and count emotions per day
  const dailyEmotions: Record<string, { date: string; [key: string]: string | number }> = {};
  
  emotionPoints.forEach(point => {
    const dateKey = formatDateShort(point.timestamp);
    if (!dailyEmotions[dateKey]) {
      dailyEmotions[dateKey] = { date: dateKey };
    }
    const emotion = point.dominantEmotion;
    dailyEmotions[dateKey][emotion] = (dailyEmotions[dateKey][emotion] as number || 0) + 1;
  });

  const chartData = Object.values(dailyEmotions).slice(-30); // Last 30 days

  // Get unique emotions
  const uniqueEmotions = Array.from(
    new Set(emotionPoints.map(p => p.dominantEmotion))
  ) as Emotion[];

  if (chartData.length === 0) {
    return (
      <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-purple mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Emotion Timeline</h2>
        <p className="text-gray-500">No emotion data available for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-purple mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Emotion Timeline</h2>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={chartData}>
          <defs>
            {uniqueEmotions.slice(0, 5).map(emotion => (
              <linearGradient key={emotion} id={`color${emotion}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={getEmotionColor(emotion)} stopOpacity={0.8}/>
                <stop offset="95%" stopColor={getEmotionColor(emotion)} stopOpacity={0.1}/>
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="date" 
            stroke="#6b7280"
            fontSize={12}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            stroke="#6b7280"
            fontSize={12}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
          />
          <Legend />
          {uniqueEmotions.slice(0, 5).map(emotion => (
            <Area
              key={emotion}
              type="monotone"
              dataKey={emotion}
              stroke={getEmotionColor(emotion)}
              fill={`url(#color${emotion})`}
              strokeWidth={2}
              name={emotion}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

