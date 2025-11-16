# LLM Integration Guide for Voice Assistant → Dashboard

## ✅ Dashboard Status: READY TO USE

The dashboard is **fully functional** and ready to receive conversation data from your voice assistant. You just need to:

1. **Process transcriptions with Llama** to extract structured insights
2. **Format the data** according to the Conversation schema
3. **Send to dashboard** via API or direct file import

---

## 📋 What You Need from Llama/LLM

Your LLM needs to process the voice assistant's `metadata.json` and `transcript.txt` files and extract:

### Required Data Extraction

1. **Topics** - What the child talked about (e.g., `['space', 'robots', 'math', 'friends']`)
2. **Emotions** - Emotional state during conversation (e.g., `'Excited'`, `'Curious'`, `'Frustrated'`)
3. **Sentiment Score** - Overall sentiment (0-100 scale)
4. **Summary** - 2-3 sentence neutral summary of the conversation
5. **Key Phrases** - Important phrases mentioned (de-identified)
6. **Insights** - Learning, social, and wellbeing insights

### Optional but Recommended

- **Emotion Timeline** - How emotions changed during conversation
- **Question Analysis** - Count and types of questions asked
- **Breakthrough Moments** - Learning breakthroughs detected
- **Stress Triggers** - What caused stress or anxiety
- **Resilience Signals** - Positive coping behaviors

---

## 🎯 LLM Prompt Template

Use this prompt structure with Llama to extract structured data:

```python
def create_extraction_prompt(metadata: dict, transcript: str) -> str:
    return f"""You are analyzing a conversation between a child and an AI companion (Harry Potter).

CONVERSATION DATA:
User Query: {metadata['user_query']}
AI Response: {metadata['harry_response']}
Full Transcript: {transcript}
Duration: {metadata['audio_duration_seconds']} seconds
Timestamp: {metadata['timestamp']}

EXTRACT THE FOLLOWING INFORMATION:

1. TOPICS (array of strings):
   - What subjects did the child discuss? (e.g., space, math, friends, art, animals)
   - Return as JSON array: ["topic1", "topic2", ...]

2. DOMINANT EMOTION (one of: Joyful, Calm, Neutral, Frustrated, Anxious, Excited, Curious, Worried, Happy, Stressed):
   - What was the child's overall emotional state?
   - Return as string

3. SENTIMENT SCORE (0-100):
   - 0-30: Negative, 31-60: Neutral, 61-100: Positive
   - Return as number

4. SUMMARY (2-3 sentences):
   - Neutral, factual summary of what was discussed
   - No personal identifiers
   - Return as string

5. KEY PHRASES (array of short phrases):
   - Important phrases or statements (de-identified)
   - Return as JSON array: ["phrase1", "phrase2", ...]

6. CONVERSATION INSIGHTS:
   - engagementLevel: "low" | "medium" | "high"
   - questionCount: number of questions asked
   - questionTypes: array of question types (e.g., ["why", "how", "what-if"])
   - avgUtteranceLength: average words per utterance
   - vocabularyComplexity: 0-100 scale

7. LEARNING INSIGHTS:
   - struggleAreas: topics/subjects the child struggled with
   - breakthroughMoments: learning breakthroughs or "aha" moments
   - skillsMentioned: skills or activities mentioned
   - learningMethods: preferred learning styles mentioned

8. SOCIAL INSIGHTS:
   - friendsMentioned: names of friends (first names only)
   - empathyIndicators: signs of empathy or emotional awareness
   - socialConcerns: social worries or issues

9. WELLBEING INSIGHTS:
   - stressTriggers: what caused stress or anxiety
   - copingStrategies: how the child copes with challenges
   - resilienceSignals: positive resilience behaviors
   - warningSignals: concerning behaviors or patterns

10. FLAGS:
    - breakthrough: true if significant learning breakthrough
    - needsAttention: true if parent should check in

RETURN AS JSON:
{{
  "topics": ["space", "robots"],
  "dominantEmotion": "Excited",
  "sentimentScore": 85,
  "summary": "Child discussed space exploration and asked about rockets...",
  "keyPhrases": ["rockets are cool", "want to learn more"],
  "conversationInsight": {{
    "engagementLevel": "high",
    "questionCount": 5,
    "questionTypes": ["why", "how"],
    "avgUtteranceLength": 12,
    "vocabularyComplexity": 75
  }},
  "learningInsight": {{
    "struggleAreas": [],
    "breakthroughMoments": ["understood rocket propulsion"],
    "skillsMentioned": ["reading", "science"],
    "learningMethods": ["visual", "hands-on"]
  }},
  "socialInsight": {{
    "friendsMentioned": [],
    "empathyIndicators": [],
    "socialConcerns": []
  }},
  "wellbeingInsight": {{
    "stressTriggers": [],
    "copingStrategies": ["asking questions"],
    "resilienceSignals": ["tried to understand"],
    "warningSignals": []
  }},
  "flags": {{
    "breakthrough": true,
    "needsAttention": false
  }}
}}"""
```

---

## 📦 Data Format: Conversation Schema

The dashboard expects this exact structure (see `types/index.ts`):

```typescript
interface Conversation {
  id: string;                    // Unique ID: "conv-{id}-{date}-{time}"
  childId: string;                // Which child (from parent's account)
  startedAt: string;            // ISO timestamp: "2025-11-15T14:30:22.123Z"
  endedAt: string;               // ISO timestamp: "2025-11-15T14:35:22.123Z"
  durationSeconds: number;        // Duration in seconds
  
  // Content & Topics
  summary: string;               // 2-3 sentence summary
  keyPhrases: string[];         // ["phrase1", "phrase2"]
  topics: string[];             // ["space", "math", "friends"]
  
  // Emotions
  dominantEmotion: Emotion;     // "Joyful" | "Calm" | "Excited" | etc.
  sentimentScore: number;        // 0-100
  emotionTimeline: Array<{       // Optional: emotion changes over time
    secondOffset: number;
    emotion: Emotion;
  }>;
  
  // Insights
  conversationInsight: {
    engagementLevel: "low" | "medium" | "high";
    questionCount: number;
    questionTypes: string[];
    avgUtteranceLength: number;
    vocabularyComplexity: number;  // 0-100
  };
  
  learningInsight: {
    struggleAreas: string[];
    breakthroughMoments: string[];
    skillsMentioned: string[];
    learningMethods: string[];
  };
  
  socialInsight: {
    friendsMentioned: string[];
    empathyIndicators: string[];
    socialConcerns: string[];
  };
  
  wellbeingInsight: {
    stressTriggers: string[];
    copingStrategies: string[];
    resilienceSignals: string[];
    warningSignals: string[];
  };
  
  flags: {
    breakthrough?: boolean;
    needsAttention?: boolean;
  };
}
```

---

## 🔄 Integration Methods

### Method 1: API Endpoint (Recommended)

**Step 1:** Create/update `app/api/conversations/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { ingestLLMConversation } from '@/lib/llmDataIngestion';
import { getCurrentParent, requireAuth } from '@/lib/auth';
import { Conversation } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const sessionId = request.cookies.get('sessionId')?.value;
    const parent = await requireAuth(sessionId);
    
    // Get conversation data from request
    const conversationData: Partial<Conversation> = await request.json();
    
    // Verify child belongs to parent
    if (!parent.children.includes(conversationData.childId!)) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    // Ingest the conversation
    ingestLLMConversation(conversationData);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error ingesting conversation:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to ingest conversation' },
      { status: 400 }
    );
  }
}
```

**Step 2:** From your Python LLM pipeline:

```python
import requests
import json
from datetime import datetime

def send_conversation_to_dashboard(conversation_data: dict, child_id: str):
    """Send LLM-processed conversation to dashboard"""
    
    # Format according to Conversation schema
    dashboard_conversation = {
        "id": f"conv-{conversation_data['conversation_id']}-{conversation_data['date']}-{conversation_data['time']}",
        "childId": child_id,  # Get from user config or parent account
        "startedAt": conversation_data['timestamp'],
        "endedAt": (datetime.fromisoformat(conversation_data['timestamp']) + 
                   timedelta(seconds=conversation_data['audio_duration_seconds'])).isoformat(),
        "durationSeconds": int(conversation_data['audio_duration_seconds']),
        "summary": conversation_data['llm_extracted']['summary'],
        "keyPhrases": conversation_data['llm_extracted']['keyPhrases'],
        "topics": conversation_data['llm_extracted']['topics'],
        "dominantEmotion": conversation_data['llm_extracted']['dominantEmotion'],
        "sentimentScore": conversation_data['llm_extracted']['sentimentScore'],
        "emotionTimeline": conversation_data['llm_extracted'].get('emotionTimeline', []),
        "conversationInsight": conversation_data['llm_extracted']['conversationInsight'],
        "learningInsight": conversation_data['llm_extracted']['learningInsight'],
        "socialInsight": conversation_data['llm_extracted']['socialInsight'],
        "wellbeingInsight": conversation_data['llm_extracted']['wellbeingInsight'],
        "flags": conversation_data['llm_extracted']['flags'],
    }
    
    # Send to dashboard
    response = requests.post(
        "http://localhost:3000/api/conversations",
        json=dashboard_conversation,
        headers={"Content-Type": "application/json"},
        cookies={"sessionId": get_session_id()}  # Get from parent's session
    )
    
    if response.ok:
        print(f"✓ Conversation {dashboard_conversation['id']} ingested successfully")
    else:
        print(f"✗ Error: {response.text}")
```

### Method 2: Direct File Import (Current Implementation)

The dashboard can read `metadata.json` files directly from disk:

1. **Voice Assistant** saves to: `hacknyu/conversations/YYYYMMDD/conv_####_HHMMSS/metadata.json`
2. **LLM Processing** (optional): Enhance `metadata.json` with extracted insights
3. **Dashboard Import**: Use Settings → Data Sync → Select Conversations Directory

**Enhanced metadata.json format** (add LLM-extracted fields):

```json
{
  "conversation_id": 1,
  "timestamp": "2025-11-15T14:30:22.123456",
  "date": "20251115",
  "time": "143022",
  "user_query": "What is the meaning of life?",
  "harry_response": "Well, that's a profound question...",
  "audio_duration_seconds": 7.5,
  
  // ADD THESE FIELDS FROM LLM:
  "llm_extracted": {
    "topics": ["philosophy", "life"],
    "dominantEmotion": "Curious",
    "sentimentScore": 75,
    "summary": "Child asked about life's meaning...",
    "keyPhrases": ["meaning of life", "profound question"],
    "conversationInsight": {
      "engagementLevel": "high",
      "questionCount": 3,
      "questionTypes": ["what", "why"],
      "avgUtteranceLength": 8,
      "vocabularyComplexity": 70
    },
    "learningInsight": {
      "struggleAreas": [],
      "breakthroughMoments": [],
      "skillsMentioned": ["thinking", "questioning"],
      "learningMethods": ["discussion"]
    },
    "socialInsight": {
      "friendsMentioned": [],
      "empathyIndicators": [],
      "socialConcerns": []
    },
    "wellbeingInsight": {
      "stressTriggers": [],
      "copingStrategies": ["asking questions"],
      "resilienceSignals": ["engaged in discussion"],
      "warningSignals": []
    },
    "flags": {
      "breakthrough": false,
      "needsAttention": false
    }
  }
}
```

Then update `lib/fileWatcher.ts` to read `llm_extracted` fields if present.

---

## 🚀 Complete Integration Workflow

### Option A: Real-time Processing (Recommended)

```python
# In your voice assistant or post-processing script

def process_conversation_with_llm(metadata_path: str, transcript_path: str, child_id: str):
    """Process conversation and send to dashboard"""
    
    # 1. Load files
    with open(metadata_path, 'r') as f:
        metadata = json.load(f)
    with open(transcript_path, 'r') as f:
        transcript = f.read()
    
    # 2. Extract with Llama
    llm_prompt = create_extraction_prompt(metadata, transcript)
    llm_response = llama.generate(llm_prompt)  # Your Llama call
    extracted_data = json.loads(llm_response)
    
    # 3. Format for dashboard
    conversation = format_for_dashboard(metadata, extracted_data, child_id)
    
    # 4. Send to dashboard
    send_conversation_to_dashboard(conversation, child_id)
```

### Option B: Batch Processing

```python
# Process all conversations in a directory

def batch_process_conversations(conversations_dir: str, child_id: str):
    """Process all conversations and send to dashboard"""
    
    for date_dir in os.listdir(conversations_dir):
        for conv_dir in os.listdir(os.path.join(conversations_dir, date_dir)):
            metadata_path = os.path.join(conversations_dir, date_dir, conv_dir, 'metadata.json')
            transcript_path = os.path.join(conversations_dir, date_dir, conv_dir, 'transcript.txt')
            
            if os.path.exists(metadata_path) and os.path.exists(transcript_path):
                process_conversation_with_llm(metadata_path, transcript_path, child_id)
```

---

## 📝 Example: Complete Python Integration Script

```python
"""
process_conversations.py
Processes voice assistant conversations with Llama and sends to dashboard
"""

import json
import os
import requests
from datetime import datetime, timedelta
from pathlib import Path

# Your Llama/LLM interface
def extract_with_llama(metadata: dict, transcript: str) -> dict:
    """Call Llama to extract structured insights"""
    prompt = create_extraction_prompt(metadata, transcript)
    # Your Llama API call here
    response = llama_api.generate(prompt)
    return json.loads(response)

def format_conversation(metadata: dict, extracted: dict, child_id: str) -> dict:
    """Format LLM output to dashboard Conversation schema"""
    start_time = datetime.fromisoformat(metadata['timestamp'])
    end_time = start_time + timedelta(seconds=metadata['audio_duration_seconds'])
    
    return {
        "id": f"conv-{metadata['conversation_id']}-{metadata['date']}-{metadata['time']}",
        "childId": child_id,
        "startedAt": start_time.isoformat(),
        "endedAt": end_time.isoformat(),
        "durationSeconds": int(metadata['audio_duration_seconds']),
        "summary": extracted['summary'],
        "keyPhrases": extracted['keyPhrases'],
        "topics": extracted['topics'],
        "dominantEmotion": extracted['dominantEmotion'],
        "sentimentScore": extracted['sentimentScore'],
        "emotionTimeline": extracted.get('emotionTimeline', []),
        "conversationInsight": extracted['conversationInsight'],
        "learningInsight": extracted['learningInsight'],
        "socialInsight": extracted['socialInsight'],
        "wellbeingInsight": extracted['wellbeingInsight'],
        "flags": extracted['flags'],
    }

def send_to_dashboard(conversation: dict, session_id: str):
    """Send conversation to dashboard API"""
    response = requests.post(
        "http://localhost:3000/api/conversations",
        json=conversation,
        headers={"Content-Type": "application/json"},
        cookies={"sessionId": session_id}
    )
    return response.ok

# Main processing function
def process_conversation_directory(conversations_dir: str, child_id: str, session_id: str):
    """Process all conversations in directory"""
    base_path = Path(conversations_dir)
    
    for date_dir in base_path.iterdir():
        if not date_dir.is_dir():
            continue
            
        for conv_dir in date_dir.iterdir():
            if not conv_dir.is_dir():
                continue
                
            metadata_path = conv_dir / 'metadata.json'
            transcript_path = conv_dir / 'transcript.txt'
            
            if not metadata_path.exists() or not transcript_path.exists():
                continue
            
            # Load files
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
            with open(transcript_path, 'r') as f:
                transcript = f.read()
            
            # Extract with LLM
            extracted = extract_with_llama(metadata, transcript)
            
            # Format for dashboard
            conversation = format_conversation(metadata, extracted, child_id)
            
            # Send to dashboard
            if send_to_dashboard(conversation, session_id):
                print(f"✓ Processed: {conversation['id']}")
            else:
                print(f"✗ Failed: {conversation['id']}")

if __name__ == "__main__":
    # Configuration
    CONVERSATIONS_DIR = "hacknyu/conversations"
    CHILD_ID = "child-123"  # Get from parent account
    SESSION_ID = "session-xxx"  # Get from authenticated parent
    
    process_conversation_directory(CONVERSATIONS_DIR, CHILD_ID, SESSION_ID)
```

---

## ✅ What's Already Working

- ✅ **Dashboard UI** - All sections functional
- ✅ **Data Storage** - localStorage system ready
- ✅ **Data Processing** - Automatic aggregation and summaries
- ✅ **API Structure** - Endpoints defined
- ✅ **Type Definitions** - Complete TypeScript schemas
- ✅ **Ingestion Functions** - `ingestLLMConversation()` ready
- ✅ **File Import** - Can read from disk (basic extraction)

## ⚠️ What You Need to Add

1. **LLM Extraction** - Use Llama to extract structured data from transcripts
2. **API Endpoint** - Create `app/api/conversations/route.ts` (code provided above)
3. **Child ID Mapping** - Map voice assistant sessions to child profiles
4. **Session Management** - Get parent's sessionId for API calls

---

## 🎯 Quick Start Checklist

- [ ] Set up Llama/LLM for extraction
- [ ] Create extraction prompt (template provided)
- [ ] Create `app/api/conversations/route.ts` (code provided)
- [ ] Test with one conversation
- [ ] Verify data appears in dashboard
- [ ] Set up batch processing for all conversations
- [ ] Map child IDs from voice assistant to dashboard

---

## 📚 Key Files Reference

- **Type Definitions**: `types/index.ts` - Conversation schema
- **Ingestion**: `lib/llmDataIngestion.ts` - Main ingestion function
- **Processing**: `lib/conversationProcessor.ts` - Data processing utilities
- **Storage**: `lib/childDataStorage.ts` - Data storage system
- **File Import**: `lib/fileWatcher.ts` - Disk file reading
- **API Route**: `app/api/conversations/route.ts` - API endpoint (needs creation)

---

## 💡 Tips for Cursor/AI Assistant

When implementing the LLM integration:

1. **Use the prompt template** - It's designed to extract all required fields
2. **Validate JSON output** - Ensure Llama returns valid JSON matching the schema
3. **Handle errors gracefully** - Some fields can be optional, but `id`, `childId`, `startedAt`, `endedAt` are required
4. **Test incrementally** - Start with one conversation, verify it appears in dashboard
5. **Check localStorage** - Use browser DevTools to verify data is stored in `childDataSchemas`

The dashboard will automatically:
- Update daily summaries
- Track topic trajectories
- Calculate growth metrics
- Generate recommendations
- Display all insights in the UI

**You're ready to connect your voice assistant!** 🚀


