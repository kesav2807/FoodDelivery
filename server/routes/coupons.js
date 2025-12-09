import express from 'express';
import {
  createCoupon,
  getCoupons,
  getActiveCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  validateCoupon
} from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/active', getActiveCoupons);
router.post('/validate', protect, validateCoupon);

router.route('/')
  .get(protect, authorize('admin'), getCoupons)
  .post(protect, authorize('admin'), createCoupon);

router.route('/:id')
  .get(protect, authorize('admin'), getCoupon)
  .put(protect, authorize('admin'), updateCoupon)
  .delete(protect, authorize('admin'), deleteCoupon);

router.put('/:id/toggle-status', protect, authorize('admin'), toggleCouponStatus);

export default router;
