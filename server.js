// server.js
import express from 'express';
import fetch from 'node-fetch'; // ⚠️ node-fetch v3 only works in ESM
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Allow requests from both local dev & Netlify frontend
app.use(
  cors({
    origin: ['http://localhost:1234', 'https://your-netlify-site.netlify.app'],
  })
);

const API_KEY =
  'a38ca758fdc3e900dc48e99600c164ddefd53a11e31b7109cc427634d5e73380';

// Base URL
const BASE_URL = `https://serpapi.com/search.json?engine=google_flights&hl=en&api_key=${API_KEY}`;

// Proxy route
app.get('/api/flights', async (req, res) => {
  try {
    const query = new URLSearchParams(req.query).toString();
    const url = `${BASE_URL}&${query}`;

    console.log('🔗 Fetching:', url);

    const response = await fetch(url);
    const data = await response.json();

    res.json(data);
  } catch (error) {
    console.error('❌ Error fetching flights:', error);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
