const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/authMiddleware');

//Order Status
router.put('/:orderId/status', auth.verifyToken, reviewController.updateOrderStatus);
router.get('/:orderId/status', auth.verifyToken, reviewController.getOrderStatus);

//Reviews
router.post('/reviews', auth.verifyToken, reviewController.addReview);
router.get('/reviews/:type/:id', reviewController.getReviews);

module.exports = router;