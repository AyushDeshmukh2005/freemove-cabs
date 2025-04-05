
import express, { Router } from 'express';
import {
  createNegotiation,
  getRideNegotiations,
  respondToNegotiation,
  acceptCounterOffer
} from '../controllers/negotiationController';

const router: Router = express.Router();

router.post('/', createNegotiation);
router.get('/ride/:rideId', getRideNegotiations);
router.put('/:id/respond', respondToNegotiation);
router.put('/:id/accept', acceptCounterOffer);

export default router;
