'use client';

import React from 'react';
import { RecommendationsIntro } from '../Recommendations/RecommendationsIntro';
import { RecommendationsList } from '../Recommendations/RecommendationsList';
import { ChalkText } from '../Layout/ChalkText';

export const RecommendationsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          <ChalkText color="green" speed={30}>Recommendations</ChalkText>
        </h1>
        <p className="text-gray-600 font-handwriting">Personalized suggestions based on interests and emotions</p>
      </div>
      <RecommendationsIntro />
      <RecommendationsList />
    </div>
  );
};

