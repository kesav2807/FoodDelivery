import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true },
  description: { type: String },
  discountType: { type: String, enum: ['percentage', 'flat'], required: true },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 },
  maxDiscount: { type: Number },
  validFrom: { type: Date, default: Date.now },
  validUntil: { type: Date, required: true },
  usageLimit: { type: Number },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  applicableRestaurants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' }]
}, { timestamps: true });

couponSchema.methods.isValid = function(orderAmount) {
  const now = new Date();
  if (!this.isActive) return { valid: false, message: 'Coupon is not active' };
  if (now < this.validFrom) return { valid: false, message: 'Coupon is not yet valid' };
  if (now > this.validUntil) return { valid: false, message: 'Coupon has expired' };
  if (this.usageLimit && this.usedCount >= this.usageLimit) return { valid: false, message: 'Coupon usage limit reached' };
  if (orderAmount < this.minOrderAmount) return { valid: false, message: `Minimum order amount is $${this.minOrderAmount}` };
  return { valid: true };
};

couponSchema.methods.calculateDiscount = function(orderAmount) {
  let discount = this.discountType === 'percentage' 
    ? (orderAmount * this.discountValue) / 100 
    : this.discountValue;
  if (this.maxDiscount && discount > this.maxDiscount) {
    discount = this.maxDiscount;
  }
  return discount;
};

export default mongoose.model('Coupon', couponSchema);
