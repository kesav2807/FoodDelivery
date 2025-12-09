import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import FoodItem from '../models/FoodItem.js';

const updateRating = async (targetType, targetId) => {
  const reviews = await Review.find({ targetType, [targetType === 'restaurant' ? 'restaurant' : 'foodItem']: targetId });
  
  if (reviews.length === 0) return;

  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  
  const Model = targetType === 'restaurant' ? Restaurant : FoodItem;
  await Model.findByIdAndUpdate(targetId, {
    rating: Math.round(avgRating * 10) / 10,
    totalRatings: reviews.length
  });
};

export const createReview = async (req, res) => {
  try {
    const { targetType, restaurantId, foodItemId, rating, comment, orderId } = req.body;

    const reviewData = {
      user: req.user.id,
      targetType,
      rating,
      comment,
      order: orderId
    };

    if (targetType === 'restaurant') {
      reviewData.restaurant = restaurantId;
    } else {
      reviewData.foodItem = foodItemId;
    }

    const existingReview = await Review.findOne({
      user: req.user.id,
      targetType,
      [targetType === 'restaurant' ? 'restaurant' : 'foodItem']: targetType === 'restaurant' ? restaurantId : foodItemId
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this item' });
    }

    const review = await Review.create(reviewData);
    await updateRating(targetType, targetType === 'restaurant' ? restaurantId : foodItemId);

    res.status(201).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviews = async (req, res) => {
  try {
    const { targetType, restaurantId, foodItemId } = req.query;
    let query = {};

    if (targetType) query.targetType = targetType;
    if (restaurantId) query.restaurant = restaurantId;
    if (foodItemId) query.foodItem = foodItemId;

    const reviews = await Review.find(query)
      .populate('user', 'name')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .populate('restaurant', 'name image')
      .populate('foodItem', 'name image')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;
    await review.save();

    const targetId = review.targetType === 'restaurant' ? review.restaurant : review.foodItem;
    await updateRating(review.targetType, targetId);

    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const targetType = review.targetType;
    const targetId = targetType === 'restaurant' ? review.restaurant : review.foodItem;

    await Review.findByIdAndDelete(req.params.id);
    await updateRating(targetType, targetId);

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
