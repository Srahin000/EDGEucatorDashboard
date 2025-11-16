'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getDailySummaries } from '@/data/mockData';
import { Sparkles, TrendingUp } from 'lucide-react';

export const EmergingInterestsCard: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const summaries = getDailySummaries(selectedChild.id, dateRange);
  const latestSummary = summaries[0];

  if (!latestSummary) {
    return (
      <div className="bg-pastel-green rounded-xl p-6 shadow-lg border-2 border-green-200/50 hover:shadow-xl transition-all duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Emerging Interests
        </h2>
        <p className="text-gray-500">No data available.</p>
      </div>
    );
  }

  const emergingTopics = latestSummary.emergingTopics || [];
  const topTopics = latestSummary.topTopics || [];

  return (
    <div className="bg-pastel-green rounded-xl p-6 shadow-lg border-2 border-green-200/50 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-accent-green/10 rounded-lg">
          <TrendingUp className="w-5 h-5 text-accent-green" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Emerging Interests
          </h2>
          <p className="text-sm text-gray-600">
            Topics that appear suddenly or consistently - great for parent planning!
          </p>
        </div>
      </div>
      
      {emergingTopics.length > 0 ? (
        <div className="space-y-3">
          {emergingTopics.map((topic, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors">
              <div className="p-1.5 bg-accent-green/20 rounded-md">
                <Sparkles className="w-4 h-4 text-accent-green" />
              </div>
              <span className="font-semibold text-gray-900 capitalize flex-1">{topic}</span>
              <span className="px-2 py-1 bg-accent-green text-white text-xs font-bold rounded-full">New</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {topTopics.slice(0, 5).map((topic, idx) => (
            <div key={idx} className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
              <span className="font-semibold text-gray-900 capitalize flex-1">{topic}</span>
              <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-full">Consistent</span>
            </div>
          ))}
        </div>
      )}
      
      {emergingTopics.length === 0 && topTopics.length === 0 && (
        <p className="text-gray-500 text-sm bg-gray-50 p-4 rounded-lg">No emerging interests detected yet.</p>
      )}
    </div>
  );
};

