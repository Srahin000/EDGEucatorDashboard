import { Child } from '@/types';
import { promises as fs } from 'fs';
import path from 'path';

// Use absolute path for Next.js API routes
const PROFILES_FILE = path.join(process.cwd(), 'data', 'profiles.json');

export interface ProfileData {
  children: Child[];
  lastUpdated: string | null;
}

export async function getProfiles(): Promise<ProfileData> {
  try {
    const fileContents = await fs.readFile(PROFILES_FILE, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    // If file doesn't exist, return empty structure
    return { children: [], lastUpdated: null };
  }
}

export async function saveProfiles(data: ProfileData): Promise<void> {
  try {
    // Ensure directory exists
    const dir = path.dirname(PROFILES_FILE);
    await fs.mkdir(dir, { recursive: true });
    
    data.lastUpdated = new Date().toISOString();
    await fs.writeFile(PROFILES_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error saving profiles:', error);
    throw new Error('Failed to save profiles');
  }
}

export async function addChild(child: Child): Promise<Child> {
  const data = await getProfiles();
  
  // Check if child with same ID exists
  const existingIndex = data.children.findIndex(c => c.id === child.id);
  
  if (existingIndex >= 0) {
    // Update existing
    data.children[existingIndex] = child;
  } else {
    // Add new
    data.children.push(child);
  }
  
  await saveProfiles(data);
  return child;
}

export async function deleteChild(childId: string): Promise<void> {
  const data = await getProfiles();
  data.children = data.children.filter(c => c.id !== childId);
  await saveProfiles(data);
}

export async function getChildById(childId: string): Promise<Child | undefined> {
  const data = await getProfiles();
  return data.children.find(c => c.id === childId);
}

