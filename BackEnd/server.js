
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const { testConnection } = require('../Database/database');

// Import routes
const userRoutes = require('./routes/userRoutes');
const rideRoutes = require('./routes/rideRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const negotiationRoutes = require('./routes/negotiationRoutes');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/negotiations', negotiationRoutes);

// Test route
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'FreeMoves Cabs API is running',
    version: '1.0.0'
  });
});

// Start the server
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  
  // Test database connection
  const dbConnected = await testConnection();
  if (dbConnected) {
    console.log('Database connection established successfully');
  } else {
    console.error('Could not establish database connection');
  }
});

// Export app for testing
module.exports = app;
