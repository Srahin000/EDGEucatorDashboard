'use client';

import React, { useState, useEffect } from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { ParentGoals, AcademicGoal, PersonalGrowthGoal, InterestTheme } from '@/types';
import { Target, BookOpen, Heart, Sparkles } from 'lucide-react';
import { ChalkText } from '../Layout/ChalkText';
import { updateParentGoals, getParentGoals } from '@/lib/parentGoalsStorage';

export const GoalsSection: React.FC = () => {
  const { selectedChild } = useChildContext();
  const [goals, setGoals] = useState<ParentGoals | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (selectedChild) {
      const savedGoals = getParentGoals(selectedChild.id);
      setGoals(savedGoals);
    }
  }, [selectedChild]);

  if (!selectedChild) return null;

  const handleSave = () => {
    if (goals) {
      updateParentGoals(goals);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const academicOptions: Array<{ value: AcademicGoal; label: string; icon: typeof BookOpen }> = [
    { value: 'encourage_math_confidence', label: 'Encourage Math Confidence', icon: BookOpen },
    { value: 'encourage_reading', label: 'Encourage Reading', icon: BookOpen },
    { value: 'encourage_science_curiosity', label: 'Encourage Science Curiosity', icon: BookOpen },
    { value: 'encourage_creativity', label: 'Encourage Creativity', icon: Sparkles },
  ];

  const personalOptions: Array<{ value: PersonalGrowthGoal; label: string; icon: typeof Heart }> = [
    { value: 'build_confidence', label: 'Build Confidence', icon: Heart },
    { value: 'support_emotional_regulation', label: 'Support Emotional Regulation', icon: Heart },
    { value: 'encourage_curiosity', label: 'Encourage Curiosity', icon: Sparkles },
    { value: 'support_social_skills', label: 'Support Social Skills', icon: Heart },
  ];

  const themeOptions: InterestTheme[] = [
    'space', 'animals', 'art', 'robots', 'magic', 'sports', 'music', 'nature'
  ];

  if (!goals) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">
          <ChalkText color="orange" speed={30}>Parent Goals</ChalkText>
        </h1>
        <p className="text-gray-600 font-handwriting">
          Guide the AI companion to support your child's development
        </p>
      </div>

      <div className="bg-pastel-orange rounded-xl p-6 shadow-lg border-2 border-orange-200/50 hover:shadow-xl transition-all duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5" />
          Academic Goal
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Choose ONE goal to help the AI encourage this area
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {academicOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setGoals({ ...goals, academicGoal: option.value })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  goals.academicGoal === option.value
                    ? 'border-accent-orange bg-accent-orange/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-2 text-gray-700" />
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-pastel-pink rounded-xl p-6 shadow-lg border-2 border-pink-200/50 hover:shadow-xl transition-all duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5" />
          Personal Growth Goal
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Choose ONE goal to help the AI support emotional and social development
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {personalOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setGoals({ ...goals, personalGrowthGoal: option.value })}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  goals.personalGrowthGoal === option.value
                    ? 'border-accent-pink bg-accent-pink/10'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <Icon className="w-5 h-5 mb-2 text-gray-700" />
                <p className="text-sm font-medium text-gray-900">{option.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-pastel-yellow rounded-xl p-6 shadow-lg border-2 border-yellow-200/50 hover:shadow-xl transition-all duration-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Interest Themes
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Select themes your child loves (the AI will reference these)
        </p>
        <div className="flex flex-wrap gap-2">
          {themeOptions.map((theme) => (
            <button
              key={theme}
              onClick={() => {
                const current = goals.interestThemes || [];
                const updated = current.includes(theme)
                  ? current.filter(t => t !== theme)
                  : [...current, theme];
                setGoals({ ...goals, interestThemes: updated });
              }}
              className={`px-4 py-2 rounded-lg border-2 transition-all capitalize ${
                goals.interestThemes?.includes(theme)
                  ? 'border-accent-yellow bg-accent-yellow/10 text-gray-900'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400'
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-pastel-mint rounded-xl p-6 shadow-lg border-2 border-teal-200/50 hover:shadow-xl transition-all duration-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={goals.interestExplorationEnabled || false}
            onChange={(e) => setGoals({ ...goals, interestExplorationEnabled: e.target.checked })}
            className="w-5 h-5"
          />
          <div>
            <p className="font-medium text-gray-900">Interest Exploration Mode</p>
            <p className="text-sm text-gray-600">
              Enable the AI to share micro-facts, ask curiosity questions, and tell mini stories about your child's interests
            </p>
          </div>
        </label>
      </div>

      <button
        onClick={handleSave}
        className={`w-full py-3 rounded-lg font-semibold transition-colors ${
          saved
            ? 'bg-green-500 text-white'
            : 'bg-primary-blue text-white hover:bg-primary-blue/90'
        }`}
      >
        {saved ? '✓ Goals Saved!' : 'Save Goals'}
      </button>
    </div>
  );
};

