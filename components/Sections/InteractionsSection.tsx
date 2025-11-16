'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { OverallHealthSummary } from '../Interactions/HealthStatusCard';
import { ChalkText } from '../Layout/ChalkText';

export const InteractionsSection: React.FC = () => {
  const { selectedChild, isLoading } = useChildContext();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">
            <ChalkText color="purple" speed={30}>Interactions</ChalkText>
          </h1>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
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
            <ChalkText color="purple" speed={30}>Interactions</ChalkText>
          </h1>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <p className="text-gray-600">Please select a child from the dropdown above to view interaction summary.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          <ChalkText color="purple" speed={30}>Interactions Summary</ChalkText>
        </h1>
        <p className="text-gray-600 font-handwriting">
          Overall health status and interaction patterns
        </p>
      </div>
      
      <OverallHealthSummary />
    </div>
  );
};


