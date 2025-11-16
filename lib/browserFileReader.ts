// Browser-compatible file reader for conversations
// Uses File System Access API or drag-and-drop

import { Conversation } from '@/types';
import { ingestLLMConversation } from './llmDataIngestion';
import { VoiceAssistantMetadata, convertMetadataToConversation } from './fileWatcher';

/**
 * Read a metadata.json file using File System Access API
 * User selects the file/folder through browser
 */
export async function readConversationFile(file: File, childId?: string): Promise<boolean> {
  try {
    const text = await file.text();
    const metadata: VoiceAssistantMetadata = JSON.parse(text);
    
    // Get childId from parameter or localStorage
    if (!childId) {
      const children = JSON.parse(localStorage.getItem('mockChildren') || '[]');
      childId = children[0]?.id || 'child-default'; // Use first child or default
    }
    
    const conversation = convertMetadataToConversation(metadata, childId);
    ingestLLMConversation(conversation);
    
    return true;
  } catch (error) {
    console.error('Error reading conversation file:', error);
    return false;
  }
}

/**
 * Read multiple conversation files (drag and drop or file picker)
 */
export async function readConversationFiles(files: FileList, childId?: string): Promise<{
  processed: number;
  failed: number;
}> {
  let processed = 0;
  let failed = 0;

  const metadataFiles = Array.from(files).filter(f => f.name === 'metadata.json');

  for (const file of metadataFiles) {
    if (await readConversationFile(file, childId)) {
      processed++;
    } else {
      failed++;
    }
  }

  return { processed, failed };
}

/**
 * Read entire conversation directory using Directory Picker API
 */
export async function readConversationDirectory(childId?: string): Promise<{
  processed: number;
  failed: number;
}> {
  try {
    // Check if File System Access API is available
    if (!('showDirectoryPicker' in window)) {
      throw new Error('File System Access API not supported. Use file picker instead.');
    }

    const directoryHandle = await (window as any).showDirectoryPicker();
    let processed = 0;
    let failed = 0;

    // Get childId from parameter or localStorage
    if (!childId) {
      const children = JSON.parse(localStorage.getItem('mockChildren') || '[]');
      childId = children[0]?.id || 'child-default';
    }

    // Recursively scan directory
    async function scanDirectory(dirHandle: any, path = '') {
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'directory') {
          await scanDirectory(entry, `${path}/${entry.name}`);
        } else if (entry.name === 'metadata.json') {
          try {
            const file = await entry.getFile();
            const metadata: VoiceAssistantMetadata = JSON.parse(await file.text());
            const conversation = convertMetadataToConversation(metadata, childId!);
            ingestLLMConversation(conversation);
            processed++;
          } catch (error) {
            console.error(`Error processing ${path}/${entry.name}:`, error);
            failed++;
          }
        }
      }
    }

    await scanDirectory(directoryHandle);
    return { processed, failed };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      // User cancelled
      return { processed: 0, failed: 0 };
    }
    throw error;
  }
}

/**
 * Auto-sync: Poll a local path (requires backend helper or Electron)
 * For browser-only, use manual file picker
 */
export function setupAutoSync(conversationsPath: string, childId: string): void {
  // In browser, we can't directly access file system
  // Options:
  // 1. Use file picker (manual)
  // 2. Use Electron (desktop app)
  // 3. Use backend server to watch files
  
  console.log('Auto-sync requires file system access. Use file picker or Electron.');
}

