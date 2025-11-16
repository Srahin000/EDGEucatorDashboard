'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getDailySummaries } from '@/data/mockData';
import { getEmotionColor, getEmotionIcon } from '@/lib/emotionUtils';
import { Emotion } from '@/types';

export const TopEmotionsCard: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const summaries = getDailySummaries(selectedChild.id, dateRange);
  const latestSummary = summaries[0];

  if (!latestSummary) {
    return (
      <div className="bg-pastel-purple rounded-xl p-6 shadow-lg border-2 border-purple-200/50 hover:shadow-xl transition-all duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Top Emotions of the Day
        </h2>
        <p className="text-gray-500">No emotion data available.</p>
      </div>
    );
  }

  // Get emotion distribution sorted by frequency
  const emotionEntries = Object.entries(latestSummary.emotionDistribution)
    .filter(([_, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const dominantEmotion = latestSummary.dominantEmotion;
  const DominantIcon = getEmotionIcon(dominantEmotion);
  const dominantColor = getEmotionColor(dominantEmotion);

  return (
    <div className="bg-pastel-purple rounded-xl p-6 shadow-lg border-2 border-purple-200/50 hover:shadow-xl transition-all duration-200">
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        Top Emotions of the Day
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div 
            className="p-4 rounded-xl shadow-md"
            style={{ backgroundColor: dominantColor + '20' }}
          >
            <DominantIcon className="w-8 h-8" style={{ color: dominantColor }} />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">
              Mostly <span style={{ color: dominantColor }}>{dominantEmotion.toLowerCase()}</span>
            </p>
            {emotionEntries.length > 1 && (
              <p className="text-sm text-gray-600 mt-1">
                Some {emotionEntries[1]?.[0].toLowerCase()} around {emotionEntries[1]?.[0].toLowerCase()}
              </p>
            )}
          </div>
        </div>
        {latestSummary.stressLevel !== 'low' && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Stress level:</span> <span className="font-medium text-yellow-700">{latestSummary.stressLevel}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

