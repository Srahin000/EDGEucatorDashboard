'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getRecommendationsForChild } from '@/data/mockData';
import { RecommendationCard } from './RecommendationCard';
import { RecommendationCategory } from '@/types';

export const RecommendationsList: React.FC = () => {
  const { selectedChild } = useChildContext();

  if (!selectedChild) return null;

  const recommendations = getRecommendationsForChild(selectedChild.id);

  if (recommendations.length === 0) {
    return (
      <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-yellow">
        <p className="text-gray-500">No recommendations available at this time.</p>
      </div>
    );
  }

  const groupedByCategory = recommendations.reduce((acc, rec) => {
    if (!acc[rec.category]) {
      acc[rec.category] = [];
    }
    acc[rec.category].push(rec);
    return acc;
  }, {} as Record<RecommendationCategory, typeof recommendations>);

  const categoryOrder: RecommendationCategory[] = ['afterschool', 'clubs', 'resources'];
  const categoryTitles: Record<RecommendationCategory, string> = {
    afterschool: 'Afterschool Programs',
    clubs: 'Clubs & Teams',
    resources: 'Learning Resources',
  };

  return (
    <div className="space-y-8">
      {categoryOrder.map(category => {
        const categoryRecs = groupedByCategory[category] || [];
        if (categoryRecs.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-xl font-semibold text-chalk-green mb-4 font-handwriting">
              {categoryTitles[category]}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryRecs.map(rec => (
                <RecommendationCard key={rec.id} recommendation={rec} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

