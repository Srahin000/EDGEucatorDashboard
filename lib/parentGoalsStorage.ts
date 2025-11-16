// Storage utilities for parent goals and AI companion settings
import { ParentGoals } from '@/types';

const STORAGE_KEY = 'parentGoals';

/**
 * Get parent goals for a specific child
 */
export function getParentGoals(childId: string): ParentGoals {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return all[childId] || {
      childId,
      academicGoal: null,
      personalGrowthGoal: null,
      interestThemes: [],
      interestExplorationEnabled: false,
      lastUpdated: new Date().toISOString(),
    };
  } catch {
    return {
      childId,
      academicGoal: null,
      personalGrowthGoal: null,
      interestThemes: [],
      interestExplorationEnabled: false,
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Update parent goals for a child
 */
export function updateParentGoals(goals: ParentGoals): void {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    all[goals.childId] = {
      ...goals,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error('Failed to save parent goals:', error);
    throw new Error('Failed to save parent goals');
  }
}

/**
 * Delete parent goals for a child
 */
export function deleteParentGoals(childId: string): void {
  try {
    const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    delete all[childId];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (error) {
    console.error('Failed to delete parent goals:', error);
  }
}

