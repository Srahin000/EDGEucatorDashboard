'use client';

import React, { useState } from 'react';
import { Child } from '@/types';
import { User, Sparkles, Check } from 'lucide-react';

interface OnboardingFlowProps {
  onComplete: (child: Child) => void;
  onSkip?: () => void;
  editingChild?: Child | null;
}

const avatarColors = [
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Green', value: '#10B981' },
  { name: 'Purple', value: '#8B5CF6' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#FBBF24' },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete, onSkip, editingChild }) => {
  const [step, setStep] = useState(editingChild ? 2 : 1);
  const [formData, setFormData] = useState({
    name: editingChild?.name || '',
    age: editingChild?.age.toString() || '',
    avatarColor: editingChild?.avatarColor || '#3B82F6',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const child: Child = {
      id: editingChild?.id || `child-${Date.now()}`,
      name: formData.name.trim(),
      age: parseInt(formData.age),
      avatarColor: formData.avatarColor,
    };

    try {
      // Save to backend
      const url = editingChild ? `/api/profiles/${editingChild.id}` : '/api/profiles';
      const method = editingChild ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(child),
      });

      if (!response.ok) {
        throw new Error('Failed to save profile');
      }

      onComplete(child);
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to save profile. Please try again.');
    }
  };

  if (step === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 border-l-4 border-primary-blue">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-blue to-accent-purple rounded-full flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Child Insights Dashboard</h2>
            <p className="text-gray-600">
              Let's set up your child's profile to get started with personalized insights.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => setStep(2)}
              className="w-full px-4 py-3 bg-primary-blue text-white rounded-button font-semibold hover:bg-primary-blue/90 transition-all duration-200 shadow-card hover:shadow-card-hover"
            >
              Get Started
            </button>
            {onSkip && (
              <button
                onClick={onSkip}
                className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Skip for now
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 border-l-4 border-primary-blue max-h-[90vh] overflow-y-auto">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary-blue to-accent-purple rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {editingChild ? 'Edit Child Profile' : 'Create Child Profile'}
          </h2>
          <p className="text-gray-600">
            {editingChild 
              ? 'Update your child\'s information.'
              : 'Tell us about your child to personalize their experience.'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Child's Name *
            </label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all"
              placeholder="Enter child's name"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
              Age *
            </label>
            <input
              type="number"
              id="age"
              required
              min="3"
              max="18"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-button focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-primary-blue transition-all"
              placeholder="Enter age"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Avatar Color *
            </label>
            <div className="grid grid-cols-3 gap-3">
              {avatarColors.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, avatarColor: color.value })}
                  className={`
                    p-4 rounded-lg border-2 transition-all
                    ${formData.avatarColor === color.value
                      ? 'border-gray-900 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-gray-400'
                    }
                  `}
                  style={{ backgroundColor: color.value }}
                >
                  {formData.avatarColor === color.value && (
                    <Check className="w-6 h-6 text-white mx-auto" />
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Selected: {avatarColors.find(c => c.value === formData.avatarColor)?.name}
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-button font-semibold hover:bg-gray-50 transition-all"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={!formData.name.trim() || !formData.age}
              className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-button font-semibold hover:bg-primary-blue/90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-card hover:shadow-card-hover"
            >
              {editingChild ? 'Update Profile' : 'Create Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

