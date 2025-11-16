'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChildContext } from '@/contexts/ChildContext';
import { getDailySummaries, getConversationsForChild } from '@/data/mockData';
import { formatDateShort, formatDate } from '@/lib/dateUtils';
import { Emotion } from '@/types';

export const EmotionPatternsCard: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const summaries = getDailySummaries(selectedChild.id, dateRange);
  const conversations = getConversationsForChild(selectedChild.id, dateRange);

  // Create emotion timeline data
  const emotionData = summaries.slice(0, 7).reverse().map(summary => {
    const date = new Date(summary.date);
    return {
      date: formatDateShort(date),
      excitement: summary.emotionDistribution['Excited'] || 0,
      stress: summary.emotionDistribution['Stressed'] || summary.emotionDistribution['Anxious'] || 0,
      joy: summary.emotionDistribution['Joyful'] || summary.emotionDistribution['Happy'] || 0,
    };
  });

  // Find stress clusters (mentions of tests, grades, etc.)
  const stressClusters: string[] = [];
  conversations.forEach(conv => {
    const text = [...conv.topics, ...conv.keyPhrases, conv.summary].join(' ').toLowerCase();
    if (text.includes('test') || text.includes('quiz') || text.includes('exam') || text.includes('grade')) {
      stressClusters.push(`Stress around ${conv.topics[0] || 'school'}`);
    }
  });

  // Find excitement peaks
  const excitementPeaks: string[] = [];
  summaries.forEach(summary => {
    if ((summary.emotionDistribution['Excited'] || 0) > 0.5) {
      const date = new Date(summary.date);
      excitementPeaks.push(`High excitement on ${formatDate(date)}`);
    }
  });

  return (
    <div className="bg-pastel-pink rounded-xl p-6 shadow-lg border-2 border-pink-200/50 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Emotion Patterns Over Time
      </h2>
      
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={emotionData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="excitement" stroke="#10B981" strokeWidth={2} name="Excitement" />
            <Line type="monotone" dataKey="joy" stroke="#FBBF24" strokeWidth={2} name="Joy" />
            <Line type="monotone" dataKey="stress" stroke="#EF4444" strokeWidth={2} name="Stress" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {excitementPeaks.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Excitement Peaks</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {excitementPeaks.slice(0, 3).map((peak, idx) => (
                <li key={idx}>{peak}</li>
              ))}
            </ul>
          </div>
        )}
        
        {stressClusters.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Stress Clusters</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
              {stressClusters.slice(0, 3).map((cluster, idx) => (
                <li key={idx}>{cluster}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

