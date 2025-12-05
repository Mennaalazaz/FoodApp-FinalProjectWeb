const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const { verifyToken, isRestaurant } = require("../middleware/authMiddleware");

// ---------------- Orders Routes ----------------
router.get("/orders/:restaurantId", verifyToken, isRestaurant, dashboardController.getRestaurantOrders);

router.put("/order-status/:orderId", verifyToken, isRestaurant, dashboardController.updateOrderStatus);

router.get("/stats/:restaurantId", verifyToken, isRestaurant, dashboardController.getRestaurantStats);

module.exports = router;
