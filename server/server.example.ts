// Example Express server setup for backend integration
// This shows how to integrate the dashboard API with your backend

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { postConversation, getConversations } from './api/conversations';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Vite dev server
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.post('/api/conversations', postConversation);
app.get('/api/conversations', getConversations);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to receive conversation data from LLM pipeline`);
});


