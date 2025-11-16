// Alternative: Read conversations from disk using Electron or Node.js
// This version works when running in a Node.js environment

import { Conversation, Emotion } from '@/types';
import { ingestLLMConversation } from './llmDataIngestion';
import { VoiceAssistantMetadata } from './fileWatcher';

/**
 * Read metadata.json from file system (Node.js only)
 * Use this in a Node.js backend or Electron app
 */
export async function readConversationMetadata(
  metadataPath: string
): Promise<VoiceAssistantMetadata | null> {
  try {
    const fs = await import('fs/promises');
    const content = await fs.readFile(metadataPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error('Error reading metadata:', error);
    return null;
  }
}

/**
 * Scan conversations directory and find all metadata.json files
 */
export async function findAllConversations(
  conversationsDir: string
): Promise<string[]> {
  try {
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const metadataFiles: string[] = [];
    
    async function scanDirectory(dir: string) {
      const entries = await fs.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.name === 'metadata.json') {
          metadataFiles.push(fullPath);
        }
      }
    }
    
    await scanDirectory(conversationsDir);
    return metadataFiles;
  } catch (error) {
    console.error('Error scanning directory:', error);
    return [];
  }
}

/**
 * Process all conversations from disk for a child
 */
export async function processAllConversationsFromDisk(
  conversationsDir: string,
  childId: string
): Promise<{ processed: number; failed: number }> {
  const metadataFiles = await findAllConversations(conversationsDir);
  let processed = 0;
  let failed = 0;

  for (const metadataPath of metadataFiles) {
    try {
      const metadata = await readConversationMetadata(metadataPath);
      if (!metadata) {
        failed++;
        continue;
      }

      const conversation = convertMetadataToConversation(metadata, childId);
      ingestLLMConversation(conversation);
      processed++;
    } catch (error) {
      console.error(`Error processing ${metadataPath}:`, error);
      failed++;
    }
  }

  return { processed, failed };
}

/**
 * Watch for new conversations and process them automatically
 */
export async function watchConversationsDirectory(
  conversationsDir: string,
  childId: string,
  onNewConversation?: (conversation: Conversation) => void
): Promise<void> {
  // Use chokidar or native fs.watch
  try {
    const chokidar = await import('chokidar');
    
    const watcher = chokidar.watch(
      path.join(conversationsDir, '**/metadata.json'),
      { 
        ignored: /(^|[\/\\])\../, // ignore dotfiles
        persistent: true 
      }
    );

    const processedFiles = new Set<string>();

    watcher.on('add', async (filePath: string) => {
      if (processedFiles.has(filePath)) return;
      processedFiles.add(filePath);

      try {
        const metadata = await readConversationMetadata(filePath);
        if (!metadata) return;

        const conversation = convertMetadataToConversation(metadata, childId);
        ingestLLMConversation(conversation);
        
        if (onNewConversation) {
          onNewConversation(conversation as Conversation);
        }
      } catch (error) {
        console.error(`Error processing new conversation ${filePath}:`, error);
      }
    });
  } catch (error) {
    console.error('Error setting up file watcher:', error);
    // Fallback to polling if chokidar not available
    setInterval(async () => {
      await processAllConversationsFromDisk(conversationsDir, childId);
    }, 5000); // Poll every 5 seconds
  }
}

// Import conversion functions
import { 
  convertMetadataToConversation,
  detectEmotionFromText,
  extractTopicsFromText,
  extractKeyPhrases,
  calculateBasicSentiment,
  extractQuestionTypes,
  extractSkills
} from './fileWatcher';


