import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String
  },
  phone: { type: String },
  email: { type: String },
  cuisine: [{ type: String }],
  categories: [{ type: String, enum: ['veg', 'non-veg', 'egg', 'vegan'] }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0 },
  deliveryTime: { type: String, default: '30-45 mins' },
  minOrderAmount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  openingHours: {
    open: { type: String, default: '09:00' },
    close: { type: String, default: '22:00' }
  }
}, { timestamps: true });

restaurantSchema.index({ name: 'text', 'address.city': 'text' });

export default mongoose.model('Restaurant', restaurantSchema);
