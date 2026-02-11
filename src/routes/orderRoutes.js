import express from 'express';
import { listOrders } from '../controllers/orderController.js';

const router = express.Router();

// GET /api/orders
// Supports query params: ?status=shipped&page=2&limit=100
router.get('/orders', listOrders);

export default router;