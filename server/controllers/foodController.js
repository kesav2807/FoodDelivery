import FoodItem from '../models/FoodItem.js';

export const createFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.create(req.body);
    res.status(201).json({ success: true, foodItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFoodItems = async (req, res) => {
  try {
    const { restaurant, category, foodType, search, isAvailable, minPrice, maxPrice } = req.query;
    let query = {};

    if (restaurant) query.restaurant = restaurant;
    if (category) query.category = category;
    if (foodType) query.foodType = { $in: foodType.split(',') };
    if (isAvailable !== undefined) query.isAvailable = isAvailable === 'true';
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const foodItems = await FoodItem.find(query).populate('restaurant', 'name');
    res.status(200).json({ success: true, count: foodItems.length, foodItems });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id).populate('restaurant');
    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.status(200).json({ success: true, foodItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.status(200).json({ success: true, foodItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    res.status(200).json({ success: true, message: 'Food item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const toggleAvailability = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ success: false, message: 'Food item not found' });
    }
    foodItem.isAvailable = !foodItem.isAvailable;
    await foodItem.save();
    res.status(200).json({ success: true, foodItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMenuByRestaurant = async (req, res) => {
  try {
    const foodItems = await FoodItem.find({ restaurant: req.params.restaurantId, isAvailable: true });
    
    const menu = foodItems.reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

    res.status(200).json({ success: true, menu });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
