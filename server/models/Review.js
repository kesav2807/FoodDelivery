import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetType: { type: String, enum: ['restaurant', 'food'], required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem' },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  images: [{ type: String }]
}, { timestamps: true });

reviewSchema.index({ user: 1, targetType: 1, restaurant: 1 }, { unique: true, sparse: true });
reviewSchema.index({ user: 1, targetType: 1, foodItem: 1 }, { unique: true, sparse: true });

export default mongoose.model('Review', reviewSchema);
