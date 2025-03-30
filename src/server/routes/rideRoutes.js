
const express = require('express');
const { 
  bookRide, 
  getRideById, 
  getUserRides, 
  updateRideStatus,
  rateRide, 
  cancelRide, 
  applyRidesharingDiscount,
  addStopToRide,
  changeRideDestination,
  generateSplitPaymentLink
} = require('../controllers/rideController');

const router = express.Router();

router.post('/', bookRide);
router.get('/:id', getRideById);
router.get('/user/:userId', getUserRides);
router.patch('/:id/status', updateRideStatus);
router.patch('/:id/rate', rateRide);
router.patch('/:id/cancel', cancelRide);
router.patch('/:id/discount', applyRidesharingDiscount);
router.post('/:id/stops', addStopToRide);
router.patch('/:id/destination', changeRideDestination);
router.post('/:id/split-payment', generateSplitPaymentLink);

module.exports = router;
