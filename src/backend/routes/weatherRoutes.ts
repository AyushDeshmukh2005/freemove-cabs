
import express, { Router } from 'express';
import {
  getWeatherCondition,
  getWeatherForecast,
  getWeatherAdjustment
} from '../controllers/weatherController';

const router: Router = express.Router();

router.get('/condition/:location', getWeatherCondition);
router.get('/forecast/:location', getWeatherForecast);
router.get('/adjustment/:condition', getWeatherAdjustment);

export default router;
