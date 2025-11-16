'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { DailyConversationSummary } from '../Overview/DailyConversationSummary';
import { TopEmotionsCard } from '../Overview/TopEmotionsCard';
import { InterestTrendsChart } from '../Overview/InterestTrendsChart';
import { SubjectMentionsChart } from '../Overview/SubjectMentionsChart';
import { ChalkText } from '../Layout/ChalkText';

export const OverviewSection: React.FC = () => {
  const { selectedChild, isLoading } = useChildContext();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            <ChalkText color="green" speed={30}>Insights Overview</ChalkText>
          </h1>
        </div>
        <div className="bg-lightgreen rounded-lg p-6 shadow-card">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!selectedChild) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            <ChalkText color="green" speed={30}>Insights Overview</ChalkText>
          </h1>
          <p className="text-gray-600 font-handwriting">
            What's going on in your child's inner world?
          </p>
        </div>
        <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-primary-blue">
          <p className="text-gray-600">Please select a child from the dropdown above to view insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          <ChalkText color="green" speed={30}>Insights Overview</ChalkText>
        </h1>
        <p className="text-gray-600 font-handwriting">
          What's going on in your child's inner world?
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DailyConversationSummary />
        <TopEmotionsCard />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InterestTrendsChart />
        <SubjectMentionsChart />
      </div>
    </div>
  );
};

