import express from 'express';
import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Define the routes
router.route('/')
  .post(protect, addOrderItems); // POST /api/orders

router.route('/:id')
  .get(protect, getOrderById); // GET /api/orders/:id

router.route('/:id/pay')
  .put(protect, updateOrderToPaid); // PUT /api/orders/:id/pay

// We can add admin routes later if needed
// router.route('/').get(protect, admin, getAllOrders);

export default router;