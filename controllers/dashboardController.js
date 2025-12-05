const { Op } = require("sequelize");
const { Order_Details, Order_Item, Food, User } = require("../models");

// ===========================================================
// GET ALL ORDERS FOR RESTAURANT
// ===========================================================
const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (parseInt(restaurantId) !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order_Details.findAll({
      where: { Restaurant_ID: restaurantId },
      order: [["CreatedAt", "DESC"]],
      include: [
        {
          model: Order_Item,
          include: [{ model: Food }]
        },
        {
          model: User,
          attributes: ["User_ID", "username", "email", "phone", "location"]
        }
      ]
    });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================================================
// UPDATE ORDER STATUS
// ===========================================================
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order_Details.findOne({ where: { Order_ID: orderId } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.Restaurant_ID !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Validate status
    const validStatuses = ["pending", "confirmed", "preparing", "ready", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===========================================================
// GET RESTAURANT STATISTICS
// ===========================================================
const getRestaurantStats = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (parseInt(restaurantId) !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const orders = await Order_Details.findAll({
      where: { Restaurant_ID: restaurantId },
      include: [
        {
          model: Order_Item,
          include: [{ model: Food }]
        }
      ]
    });

    const totalOrders = orders.length;
    const totalSales = orders.reduce((sum, o) => sum + Number(o.Price), 0);
    const uniqueUsers = new Set(orders.map(o => o.User_ID)).size;

    const itemCounts = {};
    orders.forEach(order => {
      order.Order_Items.forEach(item => {
        const name = item.Food.Name;
        itemCounts[name] = (itemCounts[name] || 0) + item.Quantity;
      });
    });

    const bestSeller = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, qty]) => ({ name, quantity: qty }));

    res.json({
      totalOrders,
      totalSales,
      uniqueUsers,
      bestSeller
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getRestaurantOrders,
  updateOrderStatus,
  getRestaurantStats
};
