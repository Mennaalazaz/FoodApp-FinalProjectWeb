const express = require('express');
const router = express.Router();
const {  listRestaurants } = require('../controllers/restaurantController');

router.get('/', listRestaurants);

module.exports = router;
