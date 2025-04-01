
const express = require('express');
const { 
  getWeatherCondition, 
  getWeatherForecast, 
  getWeatherAdjustment 
} = require('../controllers/weatherController');

const router = express.Router();

router.get('/current/:location', getWeatherCondition);
router.get('/forecast/:location', getWeatherForecast);
router.get('/adjustment/:condition', getWeatherAdjustment);

module.exports = router;
