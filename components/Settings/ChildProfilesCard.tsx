'use client';

import React, { useState } from 'react';
import { useChildContext } from '@/contexts/ChildContext';
import { Child } from '@/types';
import { UserPlus, Trash2, Edit2 } from 'lucide-react';
import { OnboardingFlow } from '../Onboarding/OnboardingFlow';

export const ChildProfilesCard: React.FC = () => {
  const { children, refreshChildren, setSelectedChild } = useChildContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);

  const handleDelete = async (childId: string) => {
    if (!confirm('Are you sure you want to delete this child profile? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/profiles/${childId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await refreshChildren();
        // If deleted child was selected, select first available
        if (children.length > 1) {
          const remaining = children.filter(c => c.id !== childId);
          if (remaining.length > 0) {
            setSelectedChild(remaining[0]);
          }
        }
      } else {
        alert('Failed to delete profile');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
      alert('Failed to delete profile');
    }
  };

  const handleEdit = (child: Child) => {
    setEditingChild(child);
    setShowAddForm(true);
  };

  const handleOnboardingComplete = async (child: Child) => {
    setShowAddForm(false);
    setEditingChild(null);
    await refreshChildren();
    setSelectedChild(child);
  };

  return (
    <>
      <div className="bg-pastel-lavender rounded-xl p-6 shadow-lg border-2 border-purple-200/50 hover:shadow-xl transition-all duration-200 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary-blue/10 rounded-lg">
              <UserPlus className="w-6 h-6 text-primary-blue" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Child Profiles</h2>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-blue text-white rounded-xl font-bold hover:bg-primary-blue/90 transition-all shadow-lg hover:shadow-xl"
          >
            <UserPlus className="w-5 h-5" />
            Add Child
          </button>
        </div>

        {children.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
            <p className="text-lg font-medium">No child profiles yet.</p>
            <p className="text-sm mt-1">Add your first child to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between p-5 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md"
                    style={{ backgroundColor: child.avatarColor }}
                  >
                    {child.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{child.name}</h3>
                    <p className="text-sm text-gray-600">Age {child.age}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(child)}
                    className="p-2.5 text-gray-600 hover:text-primary-blue hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit profile"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(child.id)}
                    className="p-2.5 text-gray-600 hover:text-accent-red hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete profile"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddForm && (
        <OnboardingFlow
          editingChild={editingChild}
          onComplete={handleOnboardingComplete}
          onSkip={() => {
            setShowAddForm(false);
            setEditingChild(null);
          }}
        />
      )}
    </>
  );
};

