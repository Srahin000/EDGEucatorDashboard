import { Parent } from '@/types/auth';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const PARENTS_FILE = path.join(process.cwd(), 'data', 'parents.json');

export interface ParentsData {
  parents: Parent[];
  lastUpdated: string | null;
}

export async function getParents(): Promise<ParentsData> {
  try {
    const fileContents = await fs.readFile(PARENTS_FILE, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    return { parents: [], lastUpdated: null };
  }
}

export async function saveParents(data: ParentsData): Promise<void> {
  try {
    const dir = path.dirname(PARENTS_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    data.lastUpdated = new Date().toISOString();
    await fs.writeFile(PARENTS_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving parents:', error);
    throw new Error('Failed to save parents');
  }
}

export async function addParent(parent: Parent): Promise<Parent> {
  const data = await getParents();
  
  // Check if email already exists
  const existing = data.parents.find(p => p.email === parent.email);
  if (existing) {
    throw new Error('Email already registered');
  }
  
  data.parents.push(parent);
  await saveParents(data);
  return parent;
}

export async function getParentByEmail(email: string): Promise<Parent | undefined> {
  const data = await getParents();
  return data.parents.find(p => p.email === email);
}

export async function getParentById(id: string): Promise<Parent | undefined> {
  const data = await getParents();
  return data.parents.find(p => p.id === id);
}

export async function updateParent(parentId: string, updates: Partial<Parent>): Promise<Parent> {
  const data = await getParents();
  const index = data.parents.findIndex(p => p.id === parentId);
  
  if (index === -1) {
    throw new Error('Parent not found');
  }
  
  data.parents[index] = { ...data.parents[index], ...updates };
  await saveParents(data);
  return data.parents[index];
}

// Simple password hashing (in production, use bcrypt)
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}


