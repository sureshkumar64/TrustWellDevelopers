import express from 'express';
import {
  loginUser,
  likeProperty,
  unlikeProperty,
  getLikedProperties
} from '../controllers/authControllers.js'; // ✅ All from same controller

import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Login with Firebase token
router.post('/login', loginUser);

// ✅ Like a property
router.post('/like/:propertyId', verifyToken, likeProperty);

// ✅ Unlike a property
router.post('/unlike/:propertyId', verifyToken, unlikeProperty);

// ✅ Get liked properties for logged-in user
router.get('/liked', verifyToken, getLikedProperties);

export default router;
