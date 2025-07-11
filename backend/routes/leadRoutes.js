// backend/routes/leadRoutes.js
import express from 'express';
import {
  createContactLead,
  createUserPropertyLead,
  getAllLeads,
  deleteLead
} from '../controllers/leadControllers.js';

import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

// Public or user-authenticated routes
router.post('/contact', createContactLead);          // anyone can contact
router.post('/property', verifyToken, createUserPropertyLead); // user must be logged in

// Admin-only route
router.get('/', verifyToken, isAdmin, getAllLeads);
router.delete('/:id', verifyToken, isAdmin, deleteLead);

export default router;
