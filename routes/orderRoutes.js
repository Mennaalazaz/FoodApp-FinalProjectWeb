const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// Customer
router.get('/user/:user_id', auth.verifyToken, auth.isUser, orderController.getUserOrders);
router.post('/place', auth.verifyToken, auth.isUser, orderController.placeOrder);
router.get('/status/:orderId', auth.verifyToken, auth.isUser, orderController.getOrderStatus);
router.put('/simulate-status/:orderId', auth.verifyToken, auth.isUser, orderController.simulateOrderStatus);

// Admin / Restaurant
router.get('/restaurant/:id', auth.verifyToken, auth.isRestaurant, orderController.getOrdersByRestaurant);
module.exports = router;
