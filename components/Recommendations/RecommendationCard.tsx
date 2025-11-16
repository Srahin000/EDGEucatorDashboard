'use client';

import React from 'react';
import { Recommendation } from '@/types';
import { getTopicColor, getTopicCategory } from '@/lib/topicUtils';
import { GraduationCap, Users, BookOpen } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

const categoryIcons = {
  afterschool: GraduationCap,
  clubs: Users,
  resources: BookOpen,
};

const categoryLabels = {
  afterschool: 'Afterschool Program',
  clubs: 'Club/Team',
  resources: 'Learning Resource',
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  const Icon = categoryIcons[recommendation.category];
  const categoryLabel = categoryLabels[recommendation.category];

  return (
    <div className="bg-lightgreen rounded-lg p-6 shadow-card border-l-4 border-accent-yellow hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">{recommendation.title}</h3>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
              {categoryLabel}
            </span>
          </div>
          <p className="text-gray-700 leading-relaxed">{recommendation.description}</p>
        </div>
      </div>

      {recommendation.relatedTopics.length > 0 && (
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-600 mb-2">Related to:</p>
          <div className="flex flex-wrap gap-2">
            {recommendation.relatedTopics.map((topic, index) => {
              const category = getTopicCategory(topic);
              const topicColor = getTopicColor(category);
              return (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs font-medium"
                  style={{
                    backgroundColor: `${topicColor}15`,
                    color: topicColor,
                  }}
                >
                  {topic}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-gray-100">
        <p className="text-sm text-gray-600 italic">
          {recommendation.reason}
        </p>
      </div>
    </div>
  );
};

