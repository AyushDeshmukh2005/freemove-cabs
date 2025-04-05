
import express, { Router } from 'express';
import {
  createFavoritePlace,
  updateFavoritePlace,
  deleteFavoritePlace,
  getFavoritePlaces,
  createFavoriteDriver,
  updateFavoriteDriver,
  deleteFavoriteDriver
} from '../controllers/favoriteController';

const router: Router = express.Router();

// Favorite places routes
router.post('/places', createFavoritePlace);
router.put('/places/:id', updateFavoritePlace);
router.delete('/places/:id', deleteFavoritePlace);
router.get('/places/user/:userId', getFavoritePlaces);

// Favorite drivers routes
router.post('/drivers', createFavoriteDriver);
router.put('/drivers/:id', updateFavoriteDriver);
router.delete('/drivers/:id', deleteFavoriteDriver);

export default router;
