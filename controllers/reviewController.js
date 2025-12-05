const { Order_Details, Order_Item, Food, Review } = require("../models");

//update order status
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        valid: validStatuses,
      });
    }

    const order = await Order_Details.findByPk(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Order status updated",
      status: order.status,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//get order status for a specific order
const getOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order_Details.findByPk(orderId, {
      include: [
        {
          model: Order_Item,
          include: [Food],
        },
      ],
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({
      orderId: order.Order_ID,
      status: order.status,
      items: order.Order_Items,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//adding a review
const addReview = async (req, res) => {
  try {
    const { userId, restaurantId, foodId, rating, comment } = req.body;

    if (!rating)
      return res.status(400).json({ message: "Rating is required" });

    const review = await Review.create({
      User_ID: userId,
      Restaurant_ID: restaurantId || null,
      Food_ID: foodId || null,
      Rating: rating,
      Comment: comment || "",
    });

    res.status(201).json({
      message: "Review added successfully",
      review,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// to get all the reviews for food or restaurant
const getReviews = async (req, res) => {
  try {
    const { id, type } = req.params; //type is food or restaurant

    let whereCondition = {};

    if (type === "food") whereCondition.Food_ID = id;
    else if (type === "restaurant") whereCondition.Restaurant_ID = id;
    else return res.status(400).json({ message: "Invalid type" });

    const reviews = await Review.findAll({ where: whereCondition });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  updateOrderStatus,
  getOrderStatus,
  addReview,
  getReviews,
};