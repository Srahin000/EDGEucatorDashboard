'use client';

import React, { useState } from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getParentGoals } from '@/lib/parentGoalsStorage';
import { getDailySummaries } from '@/data/mockData';
import { BookOpen, Sparkles } from 'lucide-react';

export const BedtimeStoryGenerator: React.FC = () => {
  const { selectedChild } = useChildContext();
  const [generating, setGenerating] = useState(false);
  const [story, setStory] = useState<string | null>(null);

  if (!selectedChild) return null;

  const handleGenerate = () => {
    setGenerating(true);
    
    // Simulate story generation (in real app, this would call an API)
    setTimeout(() => {
      const summaries = getDailySummaries(selectedChild.id, 'week');
      const latestSummary = summaries[0];
      const goals = getParentGoals(selectedChild.id);
      
      const interests = latestSummary?.topTopics.slice(0, 3).join(', ') || 'adventure';
      const themes = goals.interestThemes.slice(0, 2).join(' and ') || 'magic';
      
      const generatedStory = `Once upon a time, in a world filled with ${themes}, there was a curious child who loved exploring ${interests}. 

Every night, they would dream of amazing adventures where they could learn and grow. The stars would whisper stories of courage and wonder, and the child would listen with wide eyes, feeling safe and loved.

As they drifted off to sleep, they knew that tomorrow would bring new discoveries and exciting conversations with their magical friend. The end.`;

      setStory(generatedStory);
      setGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-pastel-yellow rounded-xl p-6 shadow-lg border-2 border-yellow-200/50 hover:shadow-xl transition-all duration-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5" />
        Bedtime Story Generator
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Generate a personalized bedtime story that includes your child's interests, parent goals, and emotion-aware themes. The AI companion can read it aloud later.
      </p>
      
      {!story ? (
        <button
          onClick={handleGenerate}
          disabled={generating}
          className={`w-full py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${
            generating
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-accent-yellow text-gray-900 hover:bg-accent-yellow/90'
          }`}
        >
          {generating ? (
            <>
              <Sparkles className="w-5 h-5 animate-spin" />
              Generating Story...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Bedtime Story
            </>
          )}
        </button>
      ) : (
        <div className="space-y-4">
          <div className="bg-white/80 rounded-xl p-5 border-2 border-yellow-300/50">
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">{story}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setStory(null)}
              className="flex-1 py-2 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Generate New Story
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(story);
                alert('Story copied to clipboard!');
              }}
              className="flex-1 py-2 rounded-lg bg-primary-blue text-white hover:bg-primary-blue/90 transition-colors"
            >
              Copy Story
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

