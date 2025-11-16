'use client';

import React from 'react';

export const RecommendationsIntro: React.FC = () => {
  return (
    <div className="bg-lightgreen rounded-lg p-6 mb-6 border-l-4 border-primary-blue">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">Personalized Recommendations</h2>
      <p className="text-gray-700 leading-relaxed">
        Based on your child's interests and emotional responses, here are some ideas for activities and resources 
        that might help nurture their growth and well-being. These recommendations are tailored to their recent 
        conversations and expressed interests.
      </p>
    </div>
  );
};

