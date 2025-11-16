# Backend Integration Setup

This document explains how to integrate the dashboard with your hacknyu voice assistant backend.

## Current Architecture

```
┌─────────────────────────────────────────────────────────┐
│  hacknyu/ (Voice Assistant)                             │
│  - harry_voice_assistant.py                              │
│  - Saves to: conversations/YYYYMMDD/conv_####/          │
│    ├── audio.wav                                        │
│    ├── transcript.txt                                   │
│    └── metadata.json                                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Your LLM Pipeline
                     │ (Extracts structured data)
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Backend Server (Express/FastAPI)                       │
│  - POST /api/conversations                              │
│  - Receives structured Conversation data                │
│  - Stores in database/localStorage                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP API
                     ▼
┌─────────────────────────────────────────────────────────┐
│  Dashboard (Vite + React)                               │
│  - Frontend displays data                               │
│  - Fetches from /api/conversations                      │
└─────────────────────────────────────────────────────────┘
```

## Integration Steps

### 1. Dashboard is Ready ✅

The dashboard has:
- ✅ Data schemas defined (`types/index.ts`)
- ✅ Storage system (`lib/childDataStorage.ts`)
- ✅ Processing utilities (`lib/conversationProcessor.ts`)
- ✅ Ingestion functions (`lib/llmDataIngestion.ts`)
- ✅ API route structure (`app/api/conversations/route.ts` - for Next.js)
- ✅ Example server setup (`server/server.example.ts`)

### 2. Set Up Backend Server

You have two options:

#### Option A: Express Server (Recommended)

1. **Install dependencies**:
```bash
npm install express cors cookie-parser
npm install -D @types/express @types/cors @types/cookie-parser
```

2. **Create server** (use `server/server.example.ts` as template):
```typescript
import express from 'express';
import cors from 'cors';
import { postConversation, getConversations } from './api/conversations';

const app = express();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.post('/api/conversations', postConversation);
app.get('/api/conversations', getConversations);

app.listen(3001, () => {
  console.log('Backend server running on port 3001');
});
```

3. **Run server**:
```bash
npm run server  # Add to package.json scripts
```

#### Option B: FastAPI (Python)

If you prefer Python backend:

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/conversations")
async def post_conversation(conversation: dict):
    # Call your ingestion function
    # For now, save to localStorage equivalent or database
    # In production, use database
    return {"success": True}

@app.get("/api/conversations")
async def get_conversations(childId: str, date: str = None):
    # Retrieve conversations
    return {"conversations": []}
```

### 3. Connect LLM Pipeline

After your LLM processes the conversation, POST to the backend:

```python
# In your LLM processing script
import requests
import json

# After LLM extraction
conversation_data = {
    "id": f"conv-{conversation_id}",
    "childId": "child-123",  # Get from config/user selection
    "startedAt": metadata["timestamp"],
    "endedAt": end_timestamp,
    "durationSeconds": metadata["audio_duration_seconds"],
    "summary": llm_extracted_summary,
    "keyPhrases": llm_extracted_phrases,
    "topics": llm_extracted_topics,
    "dominantEmotion": llm_extracted_emotion,
    "sentimentScore": llm_sentiment_score,
    "emotionTimeline": llm_emotion_timeline,
    "conversationInsight": llm_conversation_insight,
    "learningInsight": llm_learning_insight,
    "socialInsight": llm_social_insight,
    "wellbeingInsight": llm_wellbeing_insight,
    "flags": llm_flags,
}

# Send to backend
response = requests.post(
    "http://localhost:3001/api/conversations",
    json=conversation_data,
    headers={"Content-Type": "application/json"}
)
```

### 4. Vite Proxy Configuration

The dashboard is already configured to proxy API calls to `localhost:3001`:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:3001',
      changeOrigin: true,
    },
  },
}
```

So when the dashboard calls `/api/conversations`, it will be proxied to your backend.

## Data Flow

1. **Voice Assistant** → Saves `metadata.json` + `transcript.txt`
2. **LLM Pipeline** → Reads files, extracts structured data
3. **LLM Pipeline** → POSTs to `http://localhost:3001/api/conversations`
4. **Backend Server** → Validates and stores data
5. **Dashboard** → Fetches from `/api/conversations` (proxied to backend)

## Testing

### Test Backend Directly:
```bash
curl -X POST http://localhost:3001/api/conversations \
  -H "Content-Type: application/json" \
  -d @sample_conversation.json
```

### Test from Dashboard:
The dashboard will automatically call the API when:
- Viewing conversations
- Loading daily summaries
- Displaying topic trajectories

## Production Considerations

1. **Database**: Replace localStorage with database (PostgreSQL, MongoDB, etc.)
2. **Authentication**: Add proper session/auth middleware
3. **Child ID Mapping**: Map voice assistant sessions to child profiles
4. **Error Handling**: Add retry logic and error recovery
5. **Data Retention**: Implement parent settings for data retention

## Current Status

✅ **Ready**:
- Dashboard data schemas
- Storage system
- Processing utilities
- API route structure
- Vite proxy configuration

⚠️ **Needs Implementation**:
- Backend server (Express/FastAPI)
- Database integration (replace localStorage)
- Authentication middleware
- Child ID mapping from voice assistant

The dashboard is **fully ready** to receive data once you:
1. Set up the backend server
2. Connect your LLM pipeline to POST to it


