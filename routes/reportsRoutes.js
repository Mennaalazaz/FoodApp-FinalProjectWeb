const express = require("express");
const router = express.Router();

const reportController = require("../controllers/reportsController");
const { verifyToken, isRestaurant } = require("../middleware/authMiddleware");

// ---------------- Reporting Routes ----------------
router.get("/daily/:restaurantId", verifyToken, isRestaurant, reportController.dailyReport);
router.get("/weekly/:restaurantId", verifyToken, isRestaurant, reportController.weeklyReport);
router.get("/monthly/:restaurantId", verifyToken, isRestaurant, reportController.monthlyReport);

module.exports = router;
