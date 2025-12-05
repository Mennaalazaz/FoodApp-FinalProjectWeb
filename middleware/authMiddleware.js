const jwt = require('jsonwebtoken');

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

module.exports = { verifyToken, isRestaurant, isUser };
