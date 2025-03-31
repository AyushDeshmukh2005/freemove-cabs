
const express = require('express');
const {
  createNegotiation,
  getRideNegotiations,
  respondToNegotiation,
  acceptCounterOffer
} = require('../controllers/negotiationController');

const router = express.Router();

// Negotiation routes
router.post('/', createNegotiation);
router.get('/ride/:rideId', getRideNegotiations);
router.patch('/:id/respond', respondToNegotiation);
router.patch('/:id/accept-counter', acceptCounterOffer);

module.exports = router;
