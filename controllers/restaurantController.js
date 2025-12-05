const Restaurant = require('../models/Restaurant');

// List restaurants
exports.listRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll({ attributes: ['Restaurant_ID','name','address'] });
    res.json(restaurants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
