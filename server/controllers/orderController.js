import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import FoodItem from '../models/FoodItem.js';

export const createOrder = async (req, res) => {
  try {
    console.log("📥 Body:", req.body);
    console.log("👤 User:", req.user.id);

    const { deliveryAddress, paymentMethod, specialInstructions } = req.body;

    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.foodItem')
      .populate('restaurant');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty' });
    }

    if (!cart.restaurant) {
      return res.status(400).json({ success: false, message: 'Restaurant missing' });
    }

    const order = await Order.create({
      user: req.user.id,
      restaurant: cart.restaurant._id,
      items: cart.items,
      deliveryAddress,
      paymentMethod,
      subtotal: cart.subtotal,
      discount: cart.discount || 0,
      deliveryFee: cart.deliveryFee || 0,
      total: cart.total,
      specialInstructions,
      statusHistory: [{ status: 'pending', note: 'Order placed' }]
    });

    cart.items = [];
    cart.restaurant = null;
    cart.discount = 0;
    await cart.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("❌ Order Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name image')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;

    console.log("🔍 Fetching order:", orderId);

    const order = await Order.findById(orderId)
      .populate({ path: 'restaurant', select: 'name phone address image', strictPopulate: false })
      .populate({ path: 'user', select: 'name email phone', strictPopulate: false })
      .populate({ path: 'deliveryPartner', select: 'name phone', strictPopulate: false })
      .populate({ path: 'items.foodItem', select: 'name image', strictPopulate: false });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (req.user.role === 'user' && order.user?._id?.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, order });

  } catch (error) {
    console.error("❌ Get order error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    console.log("📥 Admin fetching orders");

    const { status, restaurant, startDate, endDate } = req.query;
    let query = {};

    if (status) query.status = status;
    if (restaurant) query.restaurant = restaurant;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(query)
      .populate({ path: 'restaurant', select: 'name', strictPopulate: false })
      .populate({ path: 'user', select: 'name email phone', strictPopulate: false })
      .populate({ path: 'deliveryPartner', select: 'name phone', strictPopulate: false })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error("❌ Admin orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.status = status;
    order.statusHistory.push({ status, note });

    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.user.toString() !== req.user.id && req.user.role === 'user') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Cannot cancel order at this stage' });
    }

    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: req.body.reason || 'Cancelled by user' });
    await order.save();

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const assignDeliveryPartner = async (req, res) => {
  try {
    const { deliveryPartnerId } = req.body;
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        deliveryPartner: deliveryPartnerId,
        $push: { statusHistory: { status: 'assigned', note: 'Delivery partner assigned' } }
      },
      { new: true }
    ).populate('deliveryPartner', 'name phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({ deliveryPartner: req.user.id })
      .populate('restaurant', 'name address phone')
      .populate('user', 'name phone')
      .sort('-createdAt');

    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' },
          pendingOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] }
          }
        }
      }
    ]);

    const recentOrders = await Order.find()
      .populate('restaurant', 'name')
      .populate('user', 'name')
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      stats: stats[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0, pendingOrders: 0, deliveredOrders: 0 },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
