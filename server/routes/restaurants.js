import express from 'express';
import {
  createRestaurant,
  getRestaurants,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus
} from '../controllers/restaurantController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getRestaurants)
  .post(protect, authorize('admin'), createRestaurant);

router.route('/:id')
  .get(getRestaurant)
  .put(protect, authorize('admin'), updateRestaurant)
  .delete(protect, authorize('admin'), deleteRestaurant);

router.put('/:id/toggle-status', protect, authorize('admin'), toggleRestaurantStatus);

export default router;
