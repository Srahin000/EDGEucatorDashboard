'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getConversationsForChild } from '@/data/mockData';
import { ConfidenceSignal } from '@/types';

export const ConfidenceSignalsCard: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const conversations = getConversationsForChild(selectedChild.id, dateRange);

  // Analyze confidence signals from conversations
  const confidenceSignals: ConfidenceSignal[] = [
    {
      subject: 'math',
      level: 'medium',
      evidence: [],
    },
    {
      subject: 'reading',
      level: 'high',
      evidence: [],
    },
    {
      subject: 'science',
      level: 'medium',
      evidence: [],
    },
    {
      subject: 'creativity',
      level: 'high',
      evidence: [],
    },
    {
      subject: 'school',
      level: 'medium',
      evidence: [],
    },
    {
      subject: 'projects',
      level: 'high',
      evidence: [],
    },
    {
      subject: 'friends',
      level: 'high',
      evidence: [],
    },
  ];

  // Analyze conversations for confidence indicators
  conversations.forEach(conv => {
    // Check for confidence indicators in topics and key phrases
    const text = [...conv.topics, ...conv.keyPhrases, conv.summary].join(' ').toLowerCase();
    
    confidenceSignals.forEach(signal => {
      const subjectKeywords: Record<string, string[]> = {
        math: ['math', 'number', 'count', 'calculate', 'problem'],
        reading: ['read', 'book', 'story', 'chapter'],
        science: ['science', 'experiment', 'discover'],
        creativity: ['art', 'draw', 'create', 'design', 'music'],
        school: ['school', 'class', 'teacher', 'homework'],
        projects: ['project', 'build', 'make', 'create'],
        friends: ['friend', 'play', 'together', 'share'],
      };

      const keywords = subjectKeywords[signal.subject] || [];
      const mentions = keywords.filter(kw => text.includes(kw)).length;
      
      if (mentions > 0) {
        // Positive indicators
        const positiveWords = ['love', 'enjoy', 'fun', 'excited', 'proud', 'good', 'great', 'awesome'];
        const negativeWords = ['hard', 'difficult', 'hate', 'boring', 'worried', 'scared', 'confused'];
        
        const positiveCount = positiveWords.filter(w => text.includes(w)).length;
        const negativeCount = negativeWords.filter(w => text.includes(w)).length;
        
        if (positiveCount > negativeCount) {
          signal.level = 'high';
          signal.evidence.push(`Positive mentions about ${signal.subject}`);
        } else if (negativeCount > positiveCount) {
          signal.level = 'low';
          signal.evidence.push(`Concerns mentioned about ${signal.subject}`);
        }
      }
    });
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'high': return '#10B981';
      case 'medium': return '#FBBF24';
      case 'low': return '#EF4444';
      default: return '#6B7280';
    }
  };

  return (
    <div className="bg-pastel-lavender rounded-xl p-6 shadow-lg border-2 border-purple-200/50 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Confidence Signals
      </h2>
      <div className="space-y-3">
        {confidenceSignals.map((signal, idx) => (
          <div key={idx} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
            <div>
              <p className="font-semibold text-gray-900 capitalize">{signal.subject}</p>
              {signal.evidence.length > 0 && (
                <p className="text-xs text-gray-600 mt-1">{signal.evidence[0]}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span 
                className="px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: getLevelColor(signal.level) }}
              >
                {signal.level}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

