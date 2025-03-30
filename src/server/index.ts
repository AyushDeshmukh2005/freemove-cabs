
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { testConnection } from '../config/database';

// Import routes
import weatherRoutes from './routes/weatherRoutes';
import rideRoutes from './routes/rideRoutes';
import userRoutes from './routes/userRoutes';
import favoriteRoutes from './routes/favoriteRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Test database connection
testConnection();

// API routes
app.use('/api/weather', weatherRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/users', userRoutes);
app.use('/api/favorites', favoriteRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
