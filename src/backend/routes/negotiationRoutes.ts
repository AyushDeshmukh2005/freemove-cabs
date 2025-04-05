
import express from 'express';
import {
  createNegotiation,
  getRideNegotiations,
  respondToNegotiation,
  acceptCounterOffer
} from '../controllers/negotiationController';

const router = express.Router();

// Negotiation routes
router.post('/', createNegotiation);
router.get('/ride/:rideId', getRideNegotiations);
router.patch('/:id/respond', respondToNegotiation);
router.patch('/:id/accept-counter', acceptCounterOffer);

export default router;
