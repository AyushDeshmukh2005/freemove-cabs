
import express from 'express';
import { 
  saveFavoriteRoute, 
  getFavoriteRoutes, 
  deleteFavoriteRoute,
  saveFavoriteDriver,
  getFavoriteDrivers,
  deleteFavoriteDriver
} from '../controllers/favoriteController';

const router = express.Router();

// Favorite routes
router.post('/routes', saveFavoriteRoute);
router.get('/routes/user/:userId', getFavoriteRoutes);
router.delete('/routes/:id', deleteFavoriteRoute);

// Favorite drivers
router.post('/drivers', saveFavoriteDriver);
router.get('/drivers/user/:userId', getFavoriteDrivers);
router.delete('/drivers/:id', deleteFavoriteDriver);

export default router;
