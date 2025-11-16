// API endpoint for receiving LLM-processed conversation data
// This is the integration point between your LLM pipeline and the dashboard

import { NextRequest, NextResponse } from 'next/server';
import { Conversation } from '@/types';

// Note: This uses the client-side storage functions
// In production, replace with database operations

/**
 * POST /api/conversations
 * Receives structured conversation data from LLM pipeline
 * 
 * Expected payload:
 * {
 *   id: string;
 *   childId: string;
 *   startedAt: string;
 *   endedAt: string;
 *   durationSeconds: number;
 *   summary: string;
 *   keyPhrases: string[];
 *   topics: string[];
 *   dominantEmotion: Emotion;
 *   sentimentScore: number;
 *   emotionTimeline: Array<{ secondOffset: number; emotion: Emotion }>;
 *   conversationInsight: { ... };
 *   learningInsight: { ... };
 *   socialInsight: { ... };
 *   wellbeingInsight: { ... };
 *   flags: { breakthrough?: boolean; needsAttention?: boolean };
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    
    // In development, check localStorage for auth
    // In production, verify session with database
    if (!sessionId && import.meta?.env?.DEV) {
      // Allow in dev mode for testing
    } else if (!sessionId) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const conversationData: Partial<Conversation> = await request.json();

    // Validate required fields
    if (!conversationData.id || !conversationData.childId) {
      return NextResponse.json(
        { error: 'Missing required fields: id and childId' },
        { status: 400 }
      );
    }

    // In development, use client-side storage
    // In production, use database
    if (import.meta?.env?.DEV) {
      // Import dynamically to avoid SSR issues
      const { ingestLLMConversation } = await import('@/lib/llmDataIngestion');
      
      try {
        ingestLLMConversation(conversationData);
        return NextResponse.json({ 
          success: true,
          message: 'Conversation stored successfully'
        });
      } catch (error: any) {
        return NextResponse.json(
          { error: error.message || 'Failed to process conversation' },
          { status: 400 }
        );
      }
    } else {
      // Production: Store in database
      // TODO: Implement database storage
      return NextResponse.json(
        { error: 'Database storage not yet implemented' },
        { status: 501 }
      );
    }
  } catch (error: any) {
    console.error('Error in /api/conversations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process conversation' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/conversations?childId=xxx&date=YYYY-MM-DD
 * Retrieves conversations for a specific child and optional date filter
 */
export async function GET(request: NextRequest) {
  try {
    const sessionId = request.cookies.get('sessionId')?.value;
    const { searchParams } = new URL(request.url);
    const childId = searchParams.get('childId');
    const date = searchParams.get('date'); // Optional: YYYY-MM-DD

    if (!childId) {
      return NextResponse.json(
        { error: 'childId parameter required' },
        { status: 400 }
      );
    }

    // In development, read from localStorage
    if (import.meta?.env?.DEV) {
      const { getChildData } = await import('@/lib/childDataStorage');
      const childData = getChildData(childId);
      
      let conversations = childData.conversations;
      
      // Filter by date if provided
      if (date) {
        conversations = conversations.filter(conv => {
          const convDate = new Date(conv.startedAt).toISOString().split('T')[0];
          return convDate === date;
        });
      }
      
      // Sort by startedAt (newest first)
      conversations.sort((a, b) => 
        new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
      );
      
      return NextResponse.json({ conversations });
    } else {
      // Production: Query database
      // TODO: Implement database query
      return NextResponse.json(
        { error: 'Database query not yet implemented' },
        { status: 501 }
      );
    }
  } catch (error: any) {
    console.error('Error in GET /api/conversations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve conversations' },
      { status: 500 }
    );
  }
}


