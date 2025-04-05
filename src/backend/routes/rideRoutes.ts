
import express, { Router } from 'express';
import {
  getRides,
  createRide,
  getRideById,
  updateRideStatus,
  cancelRide,
  getRideHistory,
  applyPromoCode,
  scheduleFutureRide,
  getRidesByUserId,
  addRideStop,
} from '../controllers/rideController';

const router: Router = express.Router();

router.get('/', getRides);
router.post('/', createRide);
router.get('/:id', getRideById);
router.put('/:id/status', updateRideStatus);
router.put('/:id/cancel', cancelRide);
router.get('/history/:userId', getRideHistory);
router.put('/:id/promo', applyPromoCode);
router.post('/schedule', scheduleFutureRide);
router.get('/user/:userId', getRidesByUserId);
router.post('/:id/stops', addRideStop);

export default router;
