import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  category: { 
    type: String, 
    enum: ['starters', 'main-course', 'desserts', 'drinks', 'sides', 'combos'],
    required: true 
  },
  foodType: { 
    type: String, 
    enum: ['veg', 'non-veg', 'egg', 'vegan'],
    required: true 
  },
  isAvailable: { type: Boolean, default: true },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  preparationTime: { type: String, default: '15-20 mins' },
  customizations: [{
    name: String,
    options: [{
      label: String,
      price: Number
    }]
  }]
}, { timestamps: true });

foodItemSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('FoodItem', foodItemSchema);
