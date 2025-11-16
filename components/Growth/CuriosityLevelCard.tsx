'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getDailySummaries } from '@/data/mockData';
import { Sparkles } from 'lucide-react';

export const CuriosityLevelCard: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const summaries = getDailySummaries(selectedChild.id, dateRange);
  const latestSummary = summaries[0];

  if (!latestSummary) {
    return (
      <div className="bg-pastel-yellow rounded-xl p-6 shadow-lg border-2 border-yellow-200/50 hover:shadow-xl transition-all duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Curiosity Level
        </h2>
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  const curiosityLevel = latestSummary.curiosityLevel;
  
  const getLevelInfo = (level: string) => {
    switch (level) {
      case 'high':
        return {
          color: '#10B981',
          label: 'High Curiosity',
          description: 'Asking lots of questions and exploring new topics',
        };
      case 'medium':
        return {
          color: '#FBBF24',
          label: 'Moderate Curiosity',
          description: 'Showing interest in various topics',
        };
      case 'low':
        return {
          color: '#EF4444',
          label: 'Low Curiosity',
          description: 'Few questions asked recently',
        };
      default:
        return {
          color: '#6B7280',
          label: 'Unknown',
          description: 'No data available',
        };
    }
  };

  const levelInfo = getLevelInfo(curiosityLevel);

  return (
    <div className="bg-pastel-yellow rounded-xl p-6 shadow-lg border-2 border-yellow-200/50 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <div className="p-2 rounded-lg" style={{ backgroundColor: levelInfo.color + '20' }}>
          <Sparkles className="w-5 h-5" style={{ color: levelInfo.color }} />
        </div>
        Curiosity Level
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div 
            className="px-6 py-3 rounded-xl font-bold text-white shadow-md"
            style={{ backgroundColor: levelInfo.color }}
          >
            {levelInfo.label}
          </div>
        </div>
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{levelInfo.description}</p>
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
            <div 
              className="h-3 rounded-full transition-all shadow-md"
              style={{ 
                width: curiosityLevel === 'high' ? '80%' : curiosityLevel === 'medium' ? '50%' : '30%',
                backgroundColor: levelInfo.color,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

