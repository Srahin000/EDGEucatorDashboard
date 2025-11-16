'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useChildContext } from '@/contexts/ChildContext';
import { getConversationsForChild } from '@/data/mockData';

export const SubjectMentionsChart: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const conversations = getConversationsForChild(selectedChild.id, dateRange);

  // Count subject mentions
  const subjectCounts = {
    Math: 0,
    Reading: 0,
    Science: 0,
    Creativity: 0,
  };

  conversations.forEach(conv => {
    conv.topics.forEach(topic => {
      const lower = topic.toLowerCase();
      if (lower.includes('math') || lower.includes('number') || lower.includes('count') || lower.includes('calculate')) {
        subjectCounts.Math++;
      }
      if (lower.includes('read') || lower.includes('book') || lower.includes('story') || lower.includes('literature')) {
        subjectCounts.Reading++;
      }
      if (lower.includes('science') || lower.includes('experiment') || lower.includes('nature') || lower.includes('biology') || lower.includes('chemistry')) {
        subjectCounts.Science++;
      }
      if (lower.includes('art') || lower.includes('draw') || lower.includes('create') || lower.includes('music') || lower.includes('paint') || lower.includes('design')) {
        subjectCounts.Creativity++;
      }
    });
  });

  const data = Object.entries(subjectCounts).map(([name, value]) => ({
    name,
    mentions: value,
  }));

  return (
    <div className="bg-pastel-green rounded-xl p-6 shadow-lg border-2 border-green-200/50 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Subject Mentions
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          />
          <Bar dataKey="mentions" fill="#2563EB" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

