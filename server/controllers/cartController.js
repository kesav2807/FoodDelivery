import Cart from '../models/Cart.js';
import FoodItem from '../models/FoodItem.js';
import Coupon from '../models/Coupon.js';

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id })
      .populate('items.foodItem')
      .populate('restaurant', 'name deliveryFee');
    
    if (!cart) {
      cart = await Cart.create({ user: req.user.id, items: [] });
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { foodItemId, quantity, customizations } = req.body;
    
    const foodItem = await FoodItem.findById(foodItemId).populate('restaurant');
    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    if (!foodItem.isAvailable) {
      return res.status(400).json({ success: false, message: 'Food item is not available' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [], restaurant: foodItem.restaurant._id });
    }

    if (cart.restaurant && cart.restaurant.toString() !== foodItem.restaurant._id.toString() && cart.items.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot add items from different restaurants. Clear cart first.' 
      });
    }

    cart.restaurant = foodItem.restaurant._id;
    cart.deliveryFee = foodItem.restaurant.deliveryFee || 0;

    let customizationPrice = 0;
    if (customizations && customizations.length > 0) {
      customizations.forEach(c => {
        if (c.selectedOption && c.selectedOption.price) {
          customizationPrice += c.selectedOption.price;
        }
      });
    }

    const itemTotal = (foodItem.price + customizationPrice) * quantity;

    const existingItemIndex = cart.items.findIndex(
      item => item.foodItem.toString() === foodItemId && 
      JSON.stringify(item.customizations) === JSON.stringify(customizations)
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
      cart.items[existingItemIndex].itemTotal += itemTotal;
    } else {
      cart.items.push({
        foodItem: foodItemId,
        quantity,
        customizations,
        itemTotal
      });
    }

    cart.calculateTotals();
    await cart.save();

    cart = await Cart.findById(cart._id)
      .populate('items.foodItem')
      .populate('restaurant', 'name deliveryFee');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const { itemId } = req.params;

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    const foodItem = await FoodItem.findById(item.foodItem);
    let customizationPrice = 0;
    if (item.customizations) {
      item.customizations.forEach(c => {
        if (c.selectedOption && c.selectedOption.price) {
          customizationPrice += c.selectedOption.price;
        }
      });
    }

    item.quantity = quantity;
    item.itemTotal = (foodItem.price + customizationPrice) * quantity;

    cart.calculateTotals();
    await cart.save();

    cart = await Cart.findById(cart._id)
      .populate('items.foodItem')
      .populate('restaurant', 'name deliveryFee');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(req.params.itemId);
    
    if (cart.items.length === 0) {
      cart.restaurant = null;
      cart.couponApplied = null;
      cart.discount = 0;
    }

    cart.calculateTotals();
    await cart.save();

    cart = await Cart.findById(cart._id)
      .populate('items.foodItem')
      .populate('restaurant', 'name deliveryFee');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.items = [];
      cart.restaurant = null;
      cart.couponApplied = null;
      cart.discount = 0;
      cart.calculateTotals();
      await cart.save();
    }

    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    const validation = coupon.isValid(cart.subtotal);
    if (!validation.valid) {
      return res.status(400).json({ success: false, message: validation.message });
    }

    cart.couponApplied = coupon._id;
    cart.discount = coupon.calculateDiscount(cart.subtotal);
    cart.calculateTotals();
    await cart.save();

    cart = await Cart.findById(cart._id)
      .populate('items.foodItem')
      .populate('restaurant', 'name deliveryFee')
      .populate('couponApplied', 'code discountType discountValue');

    res.status(200).json({ success: true, cart, message: 'Coupon applied successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeCoupon = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    if (cart) {
      cart.couponApplied = null;
      cart.discount = 0;
      cart.calculateTotals();
      await cart.save();
    }

    cart = await Cart.findById(cart._id)
      .populate('items.foodItem')
      .populate('restaurant', 'name deliveryFee');

    res.status(200).json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
