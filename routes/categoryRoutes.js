const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { addCategory, listCategories } = require('../controllers/categoryController');

router.post('/', auth.verifyToken,  auth.isRestaurant, addCategory); //   allow only restaurants to add category
router.get('/', listCategories);

module.exports = router;
