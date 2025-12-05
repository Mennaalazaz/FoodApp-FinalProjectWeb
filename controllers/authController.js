// Handles registration, login, and JWT authentication.
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

const register = async (req, res) => {
  const { username, email, password, phone, isRestaurant, restaurantName, address, logoURL } = req.body;

  try {
    // Check if email exists in User or Restaurant
    const existingUser = await User.findOne({ where: { email } });
    const existingRestaurant = await Restaurant.findOne({ where: { email } });

    if (existingUser || existingRestaurant) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (isRestaurant) {
      // Register as restaurant
      const restaurant = await Restaurant.create({
        name: restaurantName,
        email,
        password: hashedPassword,
        phone,
        address,
        logoURL,
        is_active: true
      });
      const token = jwt.sign({ id: restaurant.Restaurant_ID, email }, process.env.JWT_SECRET);
      return res.status(201).json({ type: "restaurant", restaurant, token });
    } else {
      // Register as normal user
      const user = await User.create({ username, email, password: hashedPassword, phone });
      const token = jwt.sign({ id: user.User_ID, email }, process.env.JWT_SECRET);
      return res.status(201).json({ type: "user", user, token });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if email belongs to a user
    let user = await User.findOne({ where: { email } });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.User_ID, email, type: "user" }, process.env.JWT_SECRET);
      return res.json({ type: "user", user, token });
    }

    // Check if email belongs to a restaurant
    let restaurant = await Restaurant.findOne({ where: { email } });
    if (restaurant) {
      const isMatch = await bcrypt.compare(password, restaurant.password);
      if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });
      const token = jwt.sign({ id: restaurant.Restaurant_ID, email, type: "restaurant" }, process.env.JWT_SECRET);
      return res.json({ type: "restaurant", restaurant, token });
    }

    return res.status(400).json({ message: "Email not found" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { register, login };

