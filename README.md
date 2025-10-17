# Amazon Product Listing with AI
Project Overview

This project allows users to fetch Amazon product details using ASIN numbers and get an optimized AI-generated version alongside the original data. Users can also view their search history.

Backend Structure

Environment Variables:

Port, host, user, password, database, connection limit

Gemini API key

Database:

MySQL database connection established

products table created for storing product data

Folders:

router/ → API routes

controller/ → Business logic for:

Searching product data

Retrieving product history

config/ → Database table setup

Frontend Structure

Built with React (using Vite for setup)

Components:

Centralized input component with:

ASIN input box

Submit button → fetches product data asynchronously

Loader animation until data is fetched

Two cards side-by-side showing:

Original product data

AI-optimized data

Footer component → displays frequently used search keywords

View History component → displays previously searched ASINs (most recent on top, hover to see ASIN)

Setup Instructions

Clone the repository

Install backend dependencies:

npm install


Install frontend dependencies:

cd frontend
npm install


Start the backend server:

npm run server


Start the frontend:

npm run client

API Testing

Fetch product by ASIN

curl -X POST http://localhost:9003/api/amazon-product \
  -H "Content-Type: application/json" \
  -d '{"ASIN":"B08N5WRWNW"}'


Get all search history

curl -X GET http://localhost:9003/all-history-product-list

Gemini AI Prompt Overview

The Gemini prompt ensures the AI generates optimized and structured product data. Key points:

Title:

Keyword-rich, 50–200 characters

Includes brand, product type, key features

If missing, create from bullet points/features

Description:

Detailed, persuasive, never empty

Generated using title, features, highlights, and use cases

Natural language; no forced capitalization

Bullet Points:

5–7 precise, clear points

One or two sentences each

Emphasizes product significance

Features:

Highlight key technical aspects or unique selling points

Informative and scannable

Price:

Use original price only; do not modify

Keywords:

5–10 relevant keywords

Focus on search terms similar to title

Rules for AI:

No empty strings in title, description, bullets, or features

Minimal original data → AI should creatively complete content

Original data present → AI should be accurate and specific

No promotional language like "best" or "cheapest"

Response must be in JSON format
