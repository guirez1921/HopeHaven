const express = require('express');
const cors = require('cors');
const { initDB } = require('./lib/db');
const apiRoutes = require('./routes/api');

const app = express();

// Configure CORS
app.use(cors({
  origin: ['https://hoperhaven.vercel.app', 'http://localhost:3000', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Initialize Database
initDB();

// Mount API Routes
app.use('/api', apiRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('✅ HopeHelper Modular Backend is running!');
});

// Export for Vercel
module.exports = app;