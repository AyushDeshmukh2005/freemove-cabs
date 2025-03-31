
const express = require('express');
const { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateUserProfile,
  updateQuietHours
} = require('../controllers/userController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/:id', getUserProfile);
router.patch('/:id', updateUserProfile);
router.patch('/:id/quiet-hours', updateQuietHours);

module.exports = router;
