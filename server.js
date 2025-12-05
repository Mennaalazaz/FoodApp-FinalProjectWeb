const express = require('express');
const app = express();
const sequelize = require('./config/db');
const cors = require('cors');

// Enable CORS for all routes
app.use(cors());

// Middleware
app.use(express.json());
app.use(express.static('frontend'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/foods', require('./routes/foodRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/restaurants', require('./routes/restaurantRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/reports', require('./routes/reportsRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Start server
const PORT = process.env.PORT || 3000;
sequelize.sync().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
