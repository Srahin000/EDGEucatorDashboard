'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getDailySummaries } from '@/data/mockData';
import { formatDate } from '@/lib/dateUtils';

export const DailySummaryCard: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const summaries = getDailySummaries(selectedChild.id, dateRange);
  const latestSummary = summaries[0];

  if (!latestSummary) {
    return (
      <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-primary-blue mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today at a Glance</h2>
        <p className="text-gray-500">No conversations found for the selected period.</p>
      </div>
    );
  }

  return (
    <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-primary-blue mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Today at a Glance</h2>
      <div className="space-y-3">
        <p className="text-sm text-gray-500 mb-2">
          {formatDate(latestSummary.date)}
        </p>
        <p className="text-gray-700 leading-relaxed">
          {latestSummary.summaryText || 'No summary available.'}
        </p>
        {latestSummary.topTopics.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {latestSummary.topTopics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: '#0D2818',
                  color: '#FFFFFF',
                }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

