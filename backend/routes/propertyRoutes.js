// backend/routes/propertyRoutes.js
import express from 'express';
import {
  addProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} from '../controllers/propertyControllers.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.get('/', getAllProperties);             // GET /api/properties
router.get('/admin', verifyToken, isAdmin, getAllProperties);
router.get('/:id', getPropertyById);           // GET /api/properties/:id
router.post('/', verifyToken, isAdmin, addProperty);          // POST /api/properties
router.put('/:id', verifyToken, isAdmin, updateProperty);     // PUT /api/properties/:id
router.delete('/:id', verifyToken, isAdmin, deleteProperty);  // DELETE /api/properties/:id

export default router;