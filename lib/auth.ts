// Note: This file is for server-side use only
// For client-side auth, use the /api/auth/me endpoint
import { getSession } from './sessionStorage';
import { getParentById } from './parentStorage';
import { Parent } from '@/types/auth';

// Client-side function to get current parent from API
export async function getCurrentParentClient(): Promise<Parent | null> {
  try {
    const response = await fetch('/api/auth/me', { credentials: 'include' });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.parent || null;
  } catch (error) {
    console.error('Error getting current parent:', error);
    return null;
  }
}

// Server-side function (for API routes if needed)
export async function getCurrentParent(sessionId?: string): Promise<Parent | null> {
  try {
    if (!sessionId) {
      return null;
    }

    const session = await getSession(sessionId);
    if (!session) {
      return null;
    }

    const parent = await getParentById(session.parentId);
    return parent || null;
  } catch (error) {
    console.error('Error getting current parent:', error);
    return null;
  }
}

export async function requireAuth(sessionId?: string): Promise<Parent> {
  const parent = await getCurrentParent(sessionId);
  if (!parent) {
    throw new Error('Not authenticated');
  }
  return parent;
}

