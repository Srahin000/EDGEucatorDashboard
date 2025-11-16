# LLM Data Requirements for Dashboard

This document outlines exactly what data your Llama/LLM needs to extract from voice assistant conversations to feed into the dashboard.

## 📋 Required Data Structure

The LLM must process conversation transcripts and extract structured data matching the `Conversation` schema. Here's what's required:

### Core Conversation Data

```json
{
  "id": "conv-123-20251115-143022",
  "childId": "child-abc123",
  "startedAt": "2025-11-15T14:30:22.123Z",
  "endedAt": "2025-11-15T14:35:22.123Z",
  "durationSeconds": 300,
  "summary": "2-3 sentence neutral summary of the conversation",
  "keyPhrases": ["phrase1", "phrase2", "phrase3"],
  "topics": ["space", "math", "friends", "robots"]
}
```

### Emotion Analysis

```json
{
  "dominantEmotion": "Excited",  // One of: Joyful, Calm, Neutral, Frustrated, Anxious, Excited, Curious, Worried, Happy, Stressed
  "sentimentScore": 85,  // 0-100 scale (0-30: negative, 31-60: neutral, 61-100: positive)
  "emotionTimeline": [  // Optional but recommended
    {
      "secondOffset": 0,
      "emotion": "Curious"
    },
    {
      "secondOffset": 120,
      "emotion": "Excited"
    }
  ]
}
```

### Conversation Insights (Engagement & Communication)

```json
{
  "conversationInsight": {
    "engagementLevel": "high",  // "low" | "medium" | "high"
    "questionCount": 5,  // Number of questions the child asked
    "questionTypes": ["why", "how", "what-if"],  // Types of questions
    "avgUtteranceLength": 12,  // Average words per utterance
    "vocabularyComplexity": 75  // 0-100 scale
  }
}
```

### Learning Insights

```json
{
  "learningInsight": {
    "struggleAreas": ["fractions", "spelling test"],  // Topics/subjects child struggled with
    "breakthroughMoments": ["understood rocket propulsion", "figured out the math problem"],  // Learning breakthroughs
    "skillsMentioned": ["reading", "coding", "drawing"],  // Skills or activities mentioned
    "learningMethods": ["visual", "hands-on", "stories"]  // Preferred learning styles
  }
}
```

### Social Insights

```json
{
  "socialInsight": {
    "friendsMentioned": ["Alex", "Sam"],  // First names/nicknames only (de-identified)
    "empathyIndicators": ["comforted friend", "noticed someone was sad"],  // Signs of empathy
    "socialConcerns": ["argued with friend", "felt left out"]  // Social worries or issues
  }
}
```

### Wellbeing Insights

```json
{
  "wellbeingInsight": {
    "stressTriggers": ["math quiz", "presentation"],  // What caused stress/anxiety
    "copingStrategies": ["drawing", "talking", "going outside"],  // How child copes
    "resilienceSignals": ["tried again", "reframed mistake", "asked for help"],  // Positive resilience behaviors
    "warningSignals": ["sudden withdrawal", "negative self-talk"]  // Concerning behaviors (use sparingly)
  }
}
```

### Flags

```json
{
  "flags": {
    "breakthrough": true,  // Significant learning breakthrough detected
    "needsAttention": false  // Parent should check in on this conversation
  }
}
```

## 🎯 LLM Prompt Template

Use this prompt structure with your Llama model:

```python
def create_extraction_prompt(metadata: dict, transcript: str) -> str:
    return f"""You are analyzing a conversation between a child and an AI companion.

CONVERSATION DATA:
User Query: {metadata['user_query']}
AI Response: {metadata['harry_response']}
Full Transcript: {transcript}
Duration: {metadata['audio_duration_seconds']} seconds
Timestamp: {metadata['timestamp']}

EXTRACT THE FOLLOWING INFORMATION AS JSON:

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
   - friendsMentioned: names of friends (first names only, de-identified)
   - empathyIndicators: signs of empathy or emotional awareness
   - socialConcerns: social worries or issues

9. WELLBEING INSIGHTS:
   - stressTriggers: what caused stress or anxiety
   - copingStrategies: how the child copes with challenges
   - resilienceSignals: positive resilience behaviors
   - warningSignals: concerning behaviors or patterns (use sparingly)

10. FLAGS:
    - breakthrough: true if significant learning breakthrough
    - needsAttention: true if parent should check in

RETURN AS VALID JSON matching this structure:
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

## 📊 Complete Example Output

Here's a complete example of what the LLM should return:

```json
{
  "id": "conv-1-20251115-143022",
  "childId": "child-123",
  "startedAt": "2025-11-15T14:30:22.123Z",
  "endedAt": "2025-11-15T14:35:22.123Z",
  "durationSeconds": 300,
  "summary": "Child discussed space exploration and asked detailed questions about rockets. Showed excitement about a science project starting next week. Connected space interest with engineering.",
  "keyPhrases": [
    "How do rockets fly?",
    "I want to learn everything about space!",
    "This is so cool!"
  ],
  "topics": ["Space", "Rockets", "Science", "School", "Engineering"],
  "dominantEmotion": "Excited",
  "sentimentScore": 85,
  "emotionTimeline": [
    {"secondOffset": 0, "emotion": "Curious"},
    {"secondOffset": 120, "emotion": "Excited"},
    {"secondOffset": 240, "emotion": "Excited"}
  ],
  "conversationInsight": {
    "engagementLevel": "high",
    "questionCount": 5,
    "questionTypes": ["why", "how", "what-if"],
    "avgUtteranceLength": 12,
    "vocabularyComplexity": 75
  },
  "learningInsight": {
    "struggleAreas": [],
    "breakthroughMoments": ["understood rocket propulsion"],
    "skillsMentioned": ["reading", "science"],
    "learningMethods": ["visual", "hands-on"]
  },
  "socialInsight": {
    "friendsMentioned": [],
    "empathyIndicators": [],
    "socialConcerns": []
  },
  "wellbeingInsight": {
    "stressTriggers": [],
    "copingStrategies": ["asking questions"],
    "resilienceSignals": ["tried to understand", "engaged in discussion"],
    "warningSignals": []
  },
  "flags": {
    "breakthrough": true,
    "needsAttention": false
  }
}
```

## 🔄 Integration Flow

1. **Voice Assistant** records conversation → saves `metadata.json` and `transcript.txt`
2. **LLM Processing** → reads transcript, extracts structured data using prompt above
3. **Format Data** → convert LLM output to Conversation schema
4. **Send to Dashboard** → via API endpoint or file import

## ✅ What the Dashboard Does Automatically

Once you provide this data, the dashboard automatically:
- ✅ Aggregates daily summaries
- ✅ Tracks topic trends (emerging/declining)
- ✅ Calculates growth metrics (curiosity, communication, resilience, social)
- ✅ Generates recommendations
- ✅ Creates emotion timelines
- ✅ Identifies patterns and insights

## ⚠️ Important Notes

1. **Privacy**: Never include full names, addresses, or other PII in summaries or phrases
2. **De-identification**: Use first names only for friends, remove identifying details
3. **Neutral Summaries**: Keep summaries factual and neutral, not judgmental
4. **Valid JSON**: Ensure LLM returns valid JSON that matches the schema exactly
5. **Required Fields**: All fields in the schema are required (except `emotionTimeline` which is optional)

## 📚 Reference Files

- **Type Definitions**: `types/index.ts` - Complete TypeScript schema
- **Integration Guide**: `LLM_INTEGRATION_GUIDE.md` - Detailed integration steps
- **Processing Functions**: `lib/conversationProcessor.ts` - How data is processed
- **Ingestion**: `lib/llmDataIngestion.ts` - How to send data to dashboard

