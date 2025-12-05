const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const { addFood, listFoodsByRestaurant, listFoodsByCategory, getFoodDetails } = require('../controllers/foodController');

router.post('/', auth.verifyToken, auth.isRestaurant, addFood); // only restaurants can add food

router.get('/restaurant/:restaurant_id', listFoodsByRestaurant);

router.get('/category/:category_id', listFoodsByCategory);

router.get('/details/:food_id', getFoodDetails);

module.exports = router;
