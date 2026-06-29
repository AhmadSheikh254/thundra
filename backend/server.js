require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const projectRoutes = require('./routes/projectRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors({
  origin: '*', // For development, allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Parsing body
app.use(express.json());

// Connecting to Database
connectDB();

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "OK", message: "Thundra AI Backend is active and running!" });
});

// API Routes
app.use('/api', projectRoutes);

// Start listening
app.listen(PORT, () => {
  console.log(`🚀 Thundra AI Server running on http://localhost:${PORT}`);
  if (process.env.GEMINI_API_KEY) {
    console.log("Gemini initialized successfully");
    console.log("Using model: gemini-2.5-flash");
  } else if (process.env.OPENAI_API_KEY) {
    console.log("OpenAI initialized successfully");
    console.log("Using model: gpt-4o-mini");
  } else if (process.env.CLAUDE_API_KEY) {
    console.log("Claude initialized successfully");
    console.log("Using model: claude-3-5-sonnet-20240620");
  }
});
