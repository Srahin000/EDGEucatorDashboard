'use client';

import React, { useState } from 'react';
import { TopTopicsList } from '../Interests/TopTopicsList';
import { TopicsBarChart } from '../Interests/TopicsBarChart';
import { TopicDetailCard } from '../Interests/TopicDetailCard';
import { getTopicsForChild } from '@/data/mockData';
import { useChildContext } from '@/contexts/ChildContext';
import { TopicInsight } from '@/types';
import { ChalkText } from '../Layout/ChalkText';

export const InterestsSection: React.FC = () => {
  const { selectedChild } = useChildContext();
  const [selectedTopic, setSelectedTopic] = useState<TopicInsight | null>(null);

  if (!selectedChild) return null;

  const topics = getTopicsForChild(selectedChild.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          <ChalkText color="pink" speed={30}>Interests & Topics</ChalkText>
        </h1>
        <p className="text-gray-600 font-handwriting">What your child talks about most</p>
      </div>
      <TopicsBarChart />
      <TopTopicsList onTopicClick={setSelectedTopic} />
      {selectedTopic && (
        <TopicDetailCard topic={selectedTopic} onClose={() => setSelectedTopic(null)} />
      )}
    </div>
  );
};

