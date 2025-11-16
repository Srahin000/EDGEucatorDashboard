'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { ConfidenceSignalsCard } from '../Growth/ConfidenceSignalsCard';
import { CuriosityLevelCard } from '../Growth/CuriosityLevelCard';
import { EmotionPatternsCard } from '../Growth/EmotionPatternsCard';
import { EmergingInterestsCard } from '../Growth/EmergingInterestsCard';
import { ChalkText } from '../Layout/ChalkText';

export const GrowthSection: React.FC = () => {
  const { selectedChild, isLoading } = useChildContext();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            <ChalkText color="purple" speed={30}>Learning & Growth Insights</ChalkText>
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
            <ChalkText color="purple" speed={30}>Learning & Growth Insights</ChalkText>
          </h1>
        </div>
        <div className="bg-lightgreen rounded-lg p-6 shadow-card">
          <p className="text-gray-600">Please select a child from the dropdown above to view growth insights.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          <ChalkText color="purple" speed={30}>Learning & Growth Insights</ChalkText>
        </h1>
        <p className="text-gray-600 font-handwriting">
          How is your child growing? What are they curious or worried about?
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ConfidenceSignalsCard />
        <CuriosityLevelCard />
      </div>
      
      <EmotionPatternsCard />
      <EmergingInterestsCard />
    </div>
  );
};

