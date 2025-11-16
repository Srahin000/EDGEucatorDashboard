'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { BedtimeStoryGenerator } from '../Engagement/BedtimeStoryGenerator';
import { ConversationGuidanceList } from '../Engagement/ConversationGuidanceList';
import { InterestExplorationToggle } from '../Engagement/InterestExplorationToggle';
import { ChalkText } from '../Layout/ChalkText';

export const EngagementSection: React.FC = () => {
  const { selectedChild, isLoading } = useChildContext();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            <ChalkText color="yellow" speed={30}>Engagement Tools</ChalkText>
          </h1>
        </div>
        <div className="bg-pastel-yellow rounded-xl p-6 shadow-lg border-2 border-yellow-200/50">
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
            <ChalkText color="yellow" speed={30}>Engagement Tools</ChalkText>
          </h1>
        </div>
        <div className="bg-pastel-yellow rounded-xl p-6 shadow-lg border-2 border-yellow-200/50">
          <p className="text-gray-600">Please select a child from the dropdown above to use engagement tools.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          <ChalkText color="yellow" speed={30}>Engagement Tools</ChalkText>
        </h1>
        <p className="text-gray-600 font-handwriting">
          Participate in your child's development and support their world
        </p>
      </div>
      
      <BedtimeStoryGenerator />
      <ConversationGuidanceList />
      <InterestExplorationToggle />
    </div>
  );
};

