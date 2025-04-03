
import express from 'express';
import { 
  getWeatherCondition, 
  getWeatherForecast, 
  getWeatherAdjustment 
} from '../controllers/weatherController';

const router = express.Router();

// Weather routes
router.get('/current/:location', getWeatherCondition);
router.get('/forecast/:location', getWeatherForecast);
router.get('/adjustment/:condition', getWeatherAdjustment);

export default router;
