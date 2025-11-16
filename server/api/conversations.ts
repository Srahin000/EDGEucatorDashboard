// Backend API endpoint for conversations
// This should be integrated into your Express/FastAPI backend server

import { Request, Response } from 'express';
import { Conversation } from '../types';

/**
 * POST /api/conversations
 * Receives structured conversation data from LLM pipeline
 * 
 * Integration point: Your LLM pipeline calls this after processing
 */
export async function postConversation(req: Request, res: Response) {
  try {
    // Verify authentication
    const sessionId = req.cookies?.sessionId || req.headers.authorization;
    if (!sessionId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const conversationData: Partial<Conversation> = req.body;

    // Validate required fields
    if (!conversationData.id || !conversationData.childId) {
      return res.status(400).json({ 
        error: 'Missing required fields: id and childId' 
      });
    }

    // Import and use the ingestion function
    // Note: In production, replace localStorage with database
    const { ingestLLMConversation } = require('../lib/llmDataIngestion');
    
    try {
      ingestLLMConversation(conversationData);
      res.json({ 
        success: true,
        message: 'Conversation stored successfully'
      });
    } catch (error: any) {
      res.status(400).json({ 
        error: error.message || 'Failed to process conversation' 
      });
    }
  } catch (error: any) {
    console.error('Error in POST /api/conversations:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process conversation' 
    });
  }
}

/**
 * GET /api/conversations?childId=xxx&date=YYYY-MM-DD
 * Retrieves conversations for a specific child
 */
export async function getConversations(req: Request, res: Response) {
  try {
    const { childId, date } = req.query;

    if (!childId) {
      return res.status(400).json({ 
        error: 'childId parameter required' 
      });
    }

    // Import storage functions
    const { getChildData } = require('../lib/childDataStorage');
    const childData = getChildData(childId as string);
    
    let conversations = childData.conversations;
    
    // Filter by date if provided
    if (date) {
      conversations = conversations.filter((conv: Conversation) => {
        const convDate = new Date(conv.startedAt).toISOString().split('T')[0];
        return convDate === date;
      });
    }
    
    // Sort by startedAt (newest first)
    conversations.sort((a: Conversation, b: Conversation) => 
      new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
    
    res.json({ conversations });
  } catch (error: any) {
    console.error('Error in GET /api/conversations:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to retrieve conversations' 
    });
  }
}


