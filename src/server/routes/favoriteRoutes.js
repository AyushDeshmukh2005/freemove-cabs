
const express = require('express');
const { 
  saveFavoriteRoute, 
  getFavoriteRoutes, 
  deleteFavoriteRoute,
  saveFavoriteDriver,
  getFavoriteDrivers,
  deleteFavoriteDriver
} = require('../controllers/favoriteController');

const router = express.Router();

// Favorite routes
router.post('/routes', saveFavoriteRoute);
router.get('/routes/user/:userId', getFavoriteRoutes);
router.delete('/routes/:id', deleteFavoriteRoute);

// Favorite drivers
router.post('/drivers', saveFavoriteDriver);
router.get('/drivers/user/:userId', getFavoriteDrivers);
router.delete('/drivers/:id', deleteFavoriteDriver);

module.exports = router;
