
import express, { Router } from 'express';
import {
  createUser,
  loginUser,
  getUser,
  updateUser,
  getUserSettings
} from '../controllers/userController';

const router: Router = express.Router();

router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.get('/:id/settings', getUserSettings);

export default router;
