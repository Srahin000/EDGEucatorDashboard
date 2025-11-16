# Direct Disk Integration Guide

The dashboard can now read conversations directly from disk without needing API calls!

## How It Works

Instead of using API endpoints, the dashboard reads conversation files directly from your `hacknyu/conversations/` directory using the browser's File System Access API.

## Data Flow

```
hacknyu/harry_voice_assistant.py
  ↓ (saves to disk)
hacknyu/conversations/YYYYMMDD/conv_####_HHMMSS/
  ├── audio.wav
  ├── transcript.txt
  └── metadata.json
  ↓
Dashboard (File Picker)
  ↓ (reads metadata.json)
convertMetadataToConversation()
  ↓ (converts to dashboard format)
ingestLLMConversation()
  ↓ (stores + processes)
Dashboard displays data
```

## Usage

### Option 1: Directory Picker (Recommended)

1. Go to **Settings** section in the dashboard
2. Find the **"Sync Conversations from Disk"** card
3. Click **"Select Conversations Directory"**
4. Navigate to `hacknyu/conversations/` folder
5. Select the folder
6. All `metadata.json` files will be automatically processed

### Option 2: File Upload

1. Go to **Settings** section
2. Click **"Upload metadata.json Files"**
3. Select one or more `metadata.json` files
4. Files will be processed automatically

## What Gets Processed

For each `metadata.json` file found:

1. **Reads** the metadata file
2. **Converts** to dashboard Conversation format:
   - Extracts topics (basic keyword matching)
   - Detects emotions (basic sentiment analysis)
   - Creates summary from user_query + harry_response
   - Calculates basic insights
3. **Stores** in child's data schema
4. **Updates** daily summaries automatically
5. **Tracks** topic trajectories
6. **Calculates** growth metrics

## Current Processing

The current implementation uses **basic extraction** (keyword matching, simple sentiment). This is a starting point - you can enhance it with your LLM later.

**Basic extraction includes:**
- ✅ Topic detection (keyword matching)
- ✅ Emotion detection (sentiment keywords)
- ✅ Question counting
- ✅ Basic sentiment score
- ✅ Key phrase extraction

**Needs LLM enhancement:**
- ⚠️ Advanced topic extraction
- ⚠️ Detailed emotion timeline
- ⚠️ Learning insights
- ⚠️ Social insights
- ⚠️ Wellbeing insights

## Enhancing with LLM

You can enhance the processing by:

1. **Option A**: Process files with LLM before importing
   - Run your LLM on `metadata.json` files
   - Create enhanced Conversation objects
   - Import those instead

2. **Option B**: Add LLM processing in the conversion function
   - Modify `convertMetadataToConversation()` in `lib/fileWatcher.ts`
   - Call your LLM API to extract insights
   - Use the enhanced data

## File Structure Expected

The dashboard expects:
```
hacknyu/conversations/
  └── YYYYMMDD/
      └── conv_####_HHMMSS/
          └── metadata.json  ← This file is read
```

The `metadata.json` should have:
```json
{
  "conversation_id": 1,
  "timestamp": "2025-11-15T14:30:22.123456",
  "date": "20251115",
  "time": "143022",
  "user_query": "...",
  "harry_response": "...",
  "audio_duration_seconds": 8.0,
  ...
}
```

## Child Assignment

When importing, conversations are assigned to:
1. The currently selected child (from dropdown)
2. Or the first child in your account
3. Or a default child if none exist

Make sure to select the correct child before importing!

## Benefits

✅ **No backend needed** - Works entirely in browser
✅ **No API calls** - Direct file access
✅ **Privacy** - Data stays local
✅ **Simple** - Just select folder and import
✅ **Automatic** - Updates summaries and metrics

## Limitations

⚠️ **Browser security** - Requires user to select files/folders (can't auto-watch)
⚠️ **Manual sync** - Need to click button to import (not automatic)
⚠️ **Basic extraction** - Uses simple keyword matching (enhance with LLM)

## Future Enhancements

- Auto-watch directory (requires Electron or backend)
- LLM integration for advanced extraction
- Batch processing with progress indicator
- Duplicate detection (skip already imported)

The dashboard is now ready to read conversations directly from disk! 🎉


