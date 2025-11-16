# Dashboard Integration Guide

This guide explains how the dashboard integrates with the hacknyu voice assistant backend.

## Architecture Overview

```
┌─────────────────┐
│  Voice Assistant│  (hacknyu/harry_voice_assistant.py)
│  - Records audio│
│  - STT (Whisper)│
│  - LLM (Llama)  │
│  - Saves to disk│
└────────┬────────┘
         │
         │ Saves conversations to:
         │ hacknyu/conversations/YYYYMMDD/conv_####_HHMMSS/
         │   ├── audio.wav
         │   ├── transcript.txt
         │   └── metadata.json
         │
         ▼
┌─────────────────┐
│  LLM Processor  │  (Your LLM inference pipeline)
│  - Reads metadata│
│  - Extracts:     │
│    • Topics      │
│    • Emotions    │
│    • Insights    │
│  - Creates       │
│    Conversation  │
│    object        │
└────────┬────────┘
         │
         │ POST /api/conversations
         │ (Structured Conversation data)
         │
         ▼
┌─────────────────┐
│  Dashboard API  │  (app/api/conversations/route.ts)
│  - Validates     │
│  - Stores in     │
│    child schema  │
│  - Updates       │
│    aggregates    │
└────────┬────────┘
         │
         │ Updates localStorage
         │ (or database in production)
         │
         ▼
┌─────────────────┐
│   Dashboard UI  │  (Vite React App)
│   - Displays     │
│     conversations│
│   - Shows trends │
│   - Charts       │
└─────────────────┘
```

## Data Flow

### 1. Voice Assistant → File Storage

The voice assistant (`hacknyu/harry_voice_assistant.py`) saves:
- **Location**: `hacknyu/conversations/YYYYMMDD/conv_####_HHMMSS/`
- **Files**:
  - `audio.wav` - Raw audio (can be deleted after processing)
  - `transcript.txt` - Human-readable transcript
  - `metadata.json` - Basic metadata

**Current metadata.json structure:**
```json
{
  "conversation_id": 1,
  "timestamp": "2025-11-15T14:30:22.123456",
  "date": "20251115",
  "time": "143022",
  "user_query": "What is the meaning of life?",
  "harry_response": "Well, that's a profound question...",
  "audio_file": "20251115/conv_0001_143022/audio.wav",
  "transcript_file": "20251115/conv_0001_143022/transcript.txt",
  "sample_rate": 16000,
  "audio_duration_seconds": 7.5,
  "stt_type": "whisper-npu",
  "tts_type": "xtts_v2",
  "wake_word_type": "picovoice"
}
```

### 2. LLM Processing → Structured Data

Your LLM pipeline should:
1. Read `metadata.json` and `transcript.txt`
2. Extract structured insights (topics, emotions, etc.)
3. Create a `Conversation` object matching the dashboard schema
4. Send to dashboard API

**Required Conversation structure** (see `types/index.ts`):
```typescript
{
  id: string;
  childId: string;  // Which child had this conversation
  startedAt: string;  // ISO timestamp
  endedAt: string;     // ISO timestamp
  durationSeconds: number;
  summary: string;
  keyPhrases: string[];
  topics: string[];
  dominantEmotion: Emotion;
  sentimentScore: number;  // 0-100
  emotionTimeline: Array<{ secondOffset: number; emotion: Emotion }>;
  conversationInsight: { ... };
  learningInsight: { ... };
  socialInsight: { ... };
  wellbeingInsight: { ... };
  flags: { breakthrough?: boolean; needsAttention?: boolean };
}
```

### 3. API Endpoint

The dashboard is ready to receive data at:
- **Endpoint**: `POST /api/conversations`
- **Expected payload**: `Conversation` object
- **Response**: Success/error status

### 4. Dashboard Storage

The dashboard stores data in:
- **Development**: `localStorage` (childDataSchemas)
- **Production**: Database (to be implemented)

## Integration Points

### API Endpoint Structure

The dashboard expects these API endpoints (currently using localStorage, ready for backend):

1. **POST /api/conversations**
   - Receives structured conversation data
   - Stores in child's data schema
   - Updates daily summaries
   - Updates topic trajectories

2. **GET /api/conversations?childId=xxx&date=YYYY-MM-DD**
   - Retrieves conversations for a child/date

3. **GET /api/daily-summaries?childId=xxx&date=YYYY-MM-DD**
   - Gets daily aggregated data

4. **GET /api/topics?childId=xxx**
   - Gets topic trajectories

5. **GET /api/growth-metrics?childId=xxx&month=YYYY-MM**
   - Gets growth metrics

### Current Implementation

- ✅ Data schemas defined (`types/index.ts`)
- ✅ Storage system ready (`lib/childDataStorage.ts`)
- ✅ Processing utilities ready (`lib/conversationProcessor.ts`)
- ✅ Ingestion function ready (`lib/llmDataIngestion.ts`)
- ⚠️ API routes need to be created (currently using localStorage)

## Next Steps for Backend Integration

1. **Create API routes** in `app/api/conversations/route.ts`:
   - Accept POST requests with Conversation data
   - Use `ingestLLMConversation()` from `lib/llmDataIngestion.ts`
   - Return success/error

2. **Update voice assistant** to call API:
   - After LLM processing, POST to `/api/conversations`
   - Include childId (from user selection or config)

3. **Add authentication**:
   - Ensure API routes verify parent authentication
   - Link conversations to correct child

4. **Database migration** (for production):
   - Replace localStorage with database
   - Use same schema structure

## Example Integration Code

### From LLM Pipeline (Python):

```python
import requests
import json

# After LLM processes conversation
conversation_data = {
    "id": f"conv-{conversation_id}",
    "childId": "child-123",  # Get from user config
    "startedAt": metadata["timestamp"],
    "endedAt": end_timestamp,
    "durationSeconds": metadata["audio_duration_seconds"],
    "summary": llm_extracted_summary,
    "keyPhrases": llm_extracted_phrases,
    "topics": llm_extracted_topics,
    "dominantEmotion": llm_extracted_emotion,
    "sentimentScore": llm_sentiment_score,
    # ... all other fields
}

# Send to dashboard
response = requests.post(
    "http://localhost:3000/api/conversations",
    json=conversation_data,
    headers={"Content-Type": "application/json"}
)
```

### From Dashboard (TypeScript):

```typescript
import { ingestLLMConversation } from '@/lib/llmDataIngestion';

// In API route handler
export async function POST(request: Request) {
  const conversation = await request.json();
  try {
    ingestLLMConversation(conversation);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }
}
```

## Data Schema Compatibility

The dashboard schema is fully compatible with your voice assistant output:

| Voice Assistant | Dashboard Schema | Status |
|----------------|-----------------|--------|
| `metadata.json` | `Conversation` | ✅ Ready |
| `timestamp` | `startedAt`, `endedAt` | ✅ Ready |
| `audio_duration_seconds` | `durationSeconds` | ✅ Ready |
| `user_query` + `harry_response` | `summary`, `keyPhrases` | ⚠️ Needs LLM extraction |
| (Not in metadata) | `topics`, `emotions`, `insights` | ⚠️ Needs LLM extraction |

**Note**: The LLM extraction step is where you'll populate the structured fields (topics, emotions, insights) from the raw transcript.

## Testing Integration

1. **Test with mock data**:
   ```typescript
   // Use ingestLLMConversation() with sample data
   ```

2. **Test API endpoint** (once created):
   ```bash
   curl -X POST http://localhost:3000/api/conversations \
     -H "Content-Type: application/json" \
     -d @sample_conversation.json
   ```

3. **Verify dashboard updates**:
   - Check localStorage: `childDataSchemas`
   - View dashboard: Conversations should appear
   - Check daily summaries: Should be updated

## Current Status

✅ **Ready**:
- Data schemas defined
- Storage system implemented
- Processing utilities ready
- Ingestion functions ready
- Dashboard UI ready to display data

⚠️ **Needs Implementation**:
- API route handlers (`app/api/conversations/route.ts`)
- Backend database (replace localStorage)
- Authentication middleware
- LLM extraction pipeline (your side)

The dashboard is **fully ready** to receive and process conversation data once you:
1. Create the API endpoints
2. Connect your LLM pipeline to POST to those endpoints


