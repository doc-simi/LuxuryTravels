// netlify/functions/flights.js
import fetch from 'node-fetch';

export async function handler(event, context) {
  try {
    // API key from environment variable
    const API_KEY = process.env.SERP_API_KEY;

    // Base URL
    const BASE_URL = `https://serpapi.com/search.json?engine=google_flights&hl=en&api_key=${API_KEY}`;

    // Forward query params from frontend → backend
    const query = event.queryStringParameters;
    const queryString = new URLSearchParams(query).toString();

    const url = `${BASE_URL}&${queryString}`;
    console.log('🔗 Fetching:', url);

    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // so frontend can call it
      },
    };
  } catch (error) {
    console.error('❌ Error fetching flights:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Something went wrong' }),
    };
  }
}
