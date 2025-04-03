
import express from 'express';
import { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  updateQuietHours
} from '../controllers/userController';

const router = express.Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserProfile);
router.patch('/:id', updateUserProfile);
router.patch('/:id/quiet-hours', updateQuietHours);

export default router;
