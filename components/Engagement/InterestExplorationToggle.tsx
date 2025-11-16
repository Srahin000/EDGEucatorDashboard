'use client';

import React, { useState, useEffect } from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { getParentGoals, updateParentGoals } from '@/lib/parentGoalsStorage';
import { Sparkles, ToggleLeft, ToggleRight } from 'lucide-react';

export const InterestExplorationToggle: React.FC = () => {
  const { selectedChild } = useChildContext();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (selectedChild) {
      const goals = getParentGoals(selectedChild.id);
      setEnabled(goals.interestExplorationEnabled || false);
    }
  }, [selectedChild]);

  if (!selectedChild) return null;

  const handleToggle = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    
    const goals = getParentGoals(selectedChild.id);
    updateParentGoals({
      ...goals,
      interestExplorationEnabled: newValue,
    });
  };

  return (
    <div className="bg-pastel-green rounded-xl p-6 shadow-lg border-2 border-green-200/50 hover:shadow-xl transition-all duration-200">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5" />
        Interest Exploration Mode
      </h2>
      
      <div className="flex items-center gap-4">
        <button
          onClick={handleToggle}
          className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
            enabled ? 'bg-accent-green' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-9' : 'translate-x-1'
            }`}
          />
        </button>
        
        <div className="flex-1">
          <p className="font-medium text-gray-900">
            {enabled ? 'Enabled' : 'Disabled'}
          </p>
          <p className="text-sm text-gray-600">
            {enabled
              ? 'The AI companion will share micro-facts, ask curiosity questions, and tell mini imaginative stories about your child\'s interests.'
              : 'Enable to let the AI companion explore your child\'s interests more deeply.'}
          </p>
        </div>
      </div>

      {enabled && (
        <div className="mt-4 p-3 rounded-lg bg-accent-green/10 border border-accent-green/20">
          <p className="text-sm text-gray-700">
            ✨ When enabled, the AI will:
          </p>
          <ul className="list-disc list-inside text-sm text-gray-600 mt-2 space-y-1">
            <li>Share interesting facts about their favorite topics</li>
            <li>Ask "why" and "what if" questions to spark curiosity</li>
            <li>Tell short imaginative stories that connect to their interests</li>
            <li>Extend conversations around their passions</li>
          </ul>
        </div>
      )}
    </div>
  );
};

