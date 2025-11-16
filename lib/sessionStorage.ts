import { Session } from '@/types/auth';
import { promises as fs } from 'fs';
import path from 'path';

const SESSIONS_FILE = path.join(process.cwd(), 'data', 'sessions.json');

export interface SessionsData {
  sessions: Record<string, Session>; // sessionId -> Session
  lastUpdated: string | null;
}

export async function getSessions(): Promise<SessionsData> {
  try {
    const fileContents = await fs.readFile(SESSIONS_FILE, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Clean up expired sessions
    const now = new Date();
    const activeSessions: Record<string, Session> = {};
    
    Object.entries(data.sessions || {}).forEach(([sessionId, session]: [string, any]) => {
      if (new Date(session.expiresAt) > now) {
        activeSessions[sessionId] = session;
      }
    });
    
    if (Object.keys(activeSessions).length !== Object.keys(data.sessions || {}).length) {
      await saveSessions({ sessions: activeSessions, lastUpdated: null });
    }
    
    return { sessions: activeSessions, lastUpdated: data.lastUpdated };
  } catch (error) {
    return { sessions: {}, lastUpdated: null };
  }
}

export async function saveSessions(data: SessionsData): Promise<void> {
  try {
    const dir = path.dirname(SESSIONS_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    data.lastUpdated = new Date().toISOString();
    await fs.writeFile(SESSIONS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving sessions:', error);
    throw new Error('Failed to save sessions');
  }
}

export async function createSession(parentId: string, email: string, name: string): Promise<string> {
  const sessions = await getSessions();
  const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
  
  sessions.sessions[sessionId] = {
    parentId,
    email,
    name,
    expiresAt: expiresAt.toISOString(),
  };
  
  await saveSessions(sessions);
  return sessionId;
}

export async function getSession(sessionId: string): Promise<Session | null> {
  const sessions = await getSessions();
  return sessions.sessions[sessionId] || null;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await getSessions();
  delete sessions.sessions[sessionId];
  await saveSessions(sessions);
}


