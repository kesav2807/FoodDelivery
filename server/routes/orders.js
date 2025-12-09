import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  assignDeliveryPartner,
  getDeliveryOrders,
  getOrderStats
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(authorize('admin'), getAllOrders)
  .post(createOrder);

router.get('/my-orders', getMyOrders);
router.get('/stats', authorize('admin'), getOrderStats);
router.get('/delivery', authorize('delivery'), getDeliveryOrders);

router.route('/:id')
  .get(getOrder);

router.put('/:id/status', authorize('admin', 'delivery'), updateOrderStatus);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/assign', authorize('admin'), assignDeliveryPartner);

export default router;
