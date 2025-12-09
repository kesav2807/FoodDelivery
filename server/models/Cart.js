import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
  foodItem: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  quantity: { type: Number, required: true, min: 1 },
  customizations: [{
    name: String,
    selectedOption: {
      label: String,
      price: Number
    }
  }],
  itemTotal: { type: Number, required: true }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  items: [cartItemSchema],
  subtotal: { type: Number, default: 0 },
  couponApplied: { type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' },
  discount: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
}, { timestamps: true });

cartSchema.methods.calculateTotals = function() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.itemTotal, 0);
  this.total = this.subtotal - this.discount + this.deliveryFee;
  return this;
};

export default mongoose.model('Cart', cartSchema);
