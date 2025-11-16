'use client';

import React from 'react';
import { EmotionTimeline } from '../Emotion/EmotionTimeline';
import { EmotionBreakdown } from '../Emotion/EmotionBreakdown';
import { EmotionByTopicGrid } from '../Emotion/EmotionByTopicGrid';
import { ChalkText } from '../Layout/ChalkText';

export const EmotionSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          <ChalkText color="yellow" speed={30}>Emotion & Wellbeing</ChalkText>
        </h1>
        <p className="text-gray-600 font-handwriting">Emotional tone and patterns over time</p>
      </div>
      <EmotionTimeline />
      <EmotionBreakdown />
      <EmotionByTopicGrid />
    </div>
  );
};

