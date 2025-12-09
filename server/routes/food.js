import express from 'express';
import {
  createFoodItem,
  getFoodItems,
  getFoodItem,
  updateFoodItem,
  deleteFoodItem,
  toggleAvailability,
  getMenuByRestaurant
} from '../controllers/foodController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(getFoodItems)
  .post(protect, authorize('admin'), createFoodItem);

router.get('/menu/:restaurantId', getMenuByRestaurant);

router.route('/:id')
  .get(getFoodItem)
  .put(protect, authorize('admin'), updateFoodItem)
  .delete(protect, authorize('admin'), deleteFoodItem);

router.put('/:id/toggle-availability', protect, authorize('admin'), toggleAvailability);

export default router;
