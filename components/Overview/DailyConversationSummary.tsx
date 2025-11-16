'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getDailySummaries, getConversationsForChild } from '@/data/mockData';
import { formatDate } from '@/lib/dateUtils';

export const DailyConversationSummary: React.FC = () => {
  const { selectedChild, dateRange } = useChildContext();

  if (!selectedChild) return null;

  const summaries = getDailySummaries(selectedChild.id, dateRange);
  const latestSummary = summaries[0];
  const conversations = getConversationsForChild(selectedChild.id, dateRange);

  if (!latestSummary || conversations.length === 0) {
    return (
      <div className="bg-pastel-blue rounded-xl p-6 shadow-lg border-2 border-blue-200/50 hover:shadow-xl transition-all duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Daily Conversation Summary
        </h2>
        <p className="text-gray-500">No conversations today.</p>
      </div>
    );
  }

  // Extract top 3 topics for today
  const todayTopics = latestSummary.topTopics.slice(0, 3);

  return (
    <div className="bg-pastel-blue rounded-xl p-6 shadow-lg border-2 border-blue-200/50 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-primary-blue/10 rounded-lg">
          <svg className="w-6 h-6 text-primary-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Daily Conversation Summary
          </h2>
          <p className="text-sm text-gray-500">
            {formatDate(new Date(latestSummary.date))}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-700 font-medium mb-2">
            Today they talked about:
          </p>
          <div className="flex flex-wrap gap-2">
            {todayTopics.length > 0 ? todayTopics.map((topic, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-primary-blue/10 text-primary-blue rounded-full text-sm font-medium"
              >
                {topic}
              </span>
            )) : (
              <span className="text-gray-600 text-sm">various topics</span>
            )}
          </div>
        </div>
        {latestSummary.highlights.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Highlights:</p>
            <ul className="list-disc list-inside space-y-1 text-gray-600 text-sm ml-2">
              {latestSummary.highlights.slice(0, 3).map((highlight, idx) => (
                <li key={idx}>{highlight}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

