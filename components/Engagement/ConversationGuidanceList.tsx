'use client';

import React from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getParentGoals } from '@/lib/parentGoalsStorage';
import { getDailySummaries } from '@/data/mockData';
import { MessageSquare, Heart, Sparkles, Brain } from 'lucide-react';
import { ConversationGuidance } from '@/types';

export const ConversationGuidanceList: React.FC = () => {
  const { selectedChild } = useChildContext();

  if (!selectedChild) return null;

  const goals = getParentGoals(selectedChild.id);
  const summaries = getDailySummaries(selectedChild.id, 'week');
  const latestSummary = summaries[0];

  // Generate conversation guidance based on goals and recent data
  const guidance: ConversationGuidance[] = [];

  if (goals.academicGoal === 'encourage_math_confidence') {
    guidance.push({
      id: '1',
      suggestion: 'Try asking your child what they felt proud of in math today.',
      category: 'confidence',
      relatedGoal: 'encourage_math_confidence',
    });
  }

  if (goals.personalGrowthGoal === 'build_confidence') {
    guidance.push({
      id: '2',
      suggestion: 'Ask what they want to explore in science next.',
      category: 'curiosity',
      relatedGoal: 'build_confidence',
    });
  }

  if (latestSummary?.stressLevel === 'high' || latestSummary?.stressLevel === 'medium') {
    guidance.push({
      id: '3',
      suggestion: 'Check in about how they\'re feeling about school or friends.',
      category: 'emotional',
    });
  }

  if (latestSummary?.curiosityLevel === 'low') {
    guidance.push({
      id: '4',
      suggestion: 'Share something interesting about their favorite topic to spark curiosity.',
      category: 'curiosity',
    });
  }

  // Default guidance if none generated
  if (guidance.length === 0) {
    guidance.push({
      id: 'default-1',
      suggestion: 'Ask your child what they talked about with their AI companion today.',
      category: 'social',
    });
    guidance.push({
      id: 'default-2',
      suggestion: 'Share what you noticed about their interests and ask to explore together.',
      category: 'curiosity',
    });
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'confidence': return Heart;
      case 'curiosity': return Sparkles;
      case 'emotional': return Heart;
      case 'social': return MessageSquare;
      default: return Brain;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'confidence': return '#F97316';
      case 'curiosity': return '#FBBF24';
      case 'emotional': return '#8B5CF6';
      case 'social': return '#2563EB';
      default: return '#6B7280';
    }
  };

  return (
    <div className="bg-pastel-blue rounded-xl p-6 shadow-lg border-2 border-blue-200/50 hover:shadow-xl transition-all duration-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <MessageSquare className="w-5 h-5" />
        Conversation Guidance Suggestions
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Real-world ways to support your child's development
      </p>
      
      <div className="space-y-3">
        {guidance.map((item) => {
          const Icon = getCategoryIcon(item.category);
          const color = getCategoryColor(item.category);
          
          return (
            <div
              key={item.id}
              className="p-4 rounded-lg border-2 border-gray-200 bg-white/50"
            >
              <div className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: color + '20' }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <p className="text-gray-700 flex-1">{item.suggestion}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

