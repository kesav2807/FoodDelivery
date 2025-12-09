import express from 'express';
import {
  createReview,
  getReviews,
  getMyReviews,
  updateReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getReviews);
router.get('/my-reviews', protect, getMyReviews);

router.post('/', protect, createReview);

router.route('/:id')
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;
