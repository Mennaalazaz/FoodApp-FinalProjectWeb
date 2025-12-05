const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

// check if token is valid for all routes that require authentication
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ error: "Token missing" });

    const token = authHeader.split(" ")[1]; // Bearer TOKEN_HERE
    if (!token) return res.status(403).json({ error: "Token missing" });

    const secret = process.env.JWT_SECRET || "default_secret";
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });
      req.user = decoded; // contains { id, email, type }
      next();
    });
  } catch (err) {
    return res.status(500).json({ error: "Token verification failed" });
  }
};

// Only allow restaurants
const isRestaurant = (req, res, next) => {
  if (req.user.type !== "restaurant") return res.status(403).json({ error: "Not a restaurant" });
  next();
};

// Only allow normal users
const isUser = (req, res, next) => {
  if (req.user.type !== "user") return res.status(403).json({ error: "Not a user" });
  next();
};

const register = async (req, res) => {
  try {
    const { username, email, password, phone, location, type } = req.body;

    const userType = type || 'user'; // default to user

    if (!username || !email || !password || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (userType !== 'user') {
      return res.status(400).json({ error: "Only user registration is supported" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      location
    });
    const token = jwt.sign({ id: user.User_ID, email: user.email, type: 'user' }, process.env.JWT_SECRET || "default_secret");
    res.status(201).json({ message: "User registered successfully", token });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: "Email or username already exists" });
    } else {
      res.status(500).json({ error: "Registration failed" });
    }
  }
};

const login = async (req, res) => {
  try {
    const { email, password, type } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    let userOrRestaurant;
    let userType;

    // First check User table
    userOrRestaurant = await User.findOne({ where: { email } });
    if (userOrRestaurant) {
      userType = 'user';
    } else {
      // If not found in User, check Restaurant table
      userOrRestaurant = await Restaurant.findOne({ where: { email } });
      if (userOrRestaurant) {
        userType = 'restaurant';
      }
    }

    if (!userOrRestaurant) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // If type was provided and doesn't match, return error
    if (type && type !== userType) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, userOrRestaurant.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({
      id: userType === 'user' ? userOrRestaurant.User_ID : userOrRestaurant.Restaurant_ID,
      email: userOrRestaurant.email,
      type: userType
    }, process.env.JWT_SECRET || "default_secret");

    const response = { message: "Login successful", token, type: userType };
    // Include user/restaurant details in response
    if (userType === 'restaurant') {
      response.restaurant = {
        Restaurant_ID: userOrRestaurant.Restaurant_ID,
        name: userOrRestaurant.name,
        email: userOrRestaurant.email,
        phone: userOrRestaurant.phone,
        address: userOrRestaurant.address,
        logoURL: userOrRestaurant.logoURL
      };
    }

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { verifyToken, isRestaurant, isUser, register, login };
