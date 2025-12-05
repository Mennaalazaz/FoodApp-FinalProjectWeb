const { Order_Details, Order_Item, Food } = require("../models");

const placeOrder = async (req, res) => {
  const { address, payment_method, items, total } = req.body;
  const userId = req.user.id;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Get restaurantId from the first food item and validate all items are from the same restaurant
    const firstFood = await Food.findByPk(items[0].food_id);
    if (!firstFood) {
      return res.status(400).json({
        message: `Food ID ${items[0].food_id} not found`,
      });
    }
    const restaurantId = firstFood.Restaurant_ID;

    // Calculate total price and validate all items are from the same restaurant
    let totalPrice = 0;
    for (let item of items) {
      const food = await Food.findByPk(item.food_id);
      if (!food)
        return res.status(400).json({
          message: `Food ID ${item.food_id} not found`,
        });

      if (food.Restaurant_ID !== restaurantId) {
        return res.status(400).json({
          message: `All items must be from the same restaurant. Item ${item.food_id} is from a different restaurant.`,
        });
      }

      totalPrice += food.Price * item.quantity;
    }

    // Map frontend payment methods to backend enum values
    let mappedPaymentMethod = payment_method;
    if (payment_method === "card") {
      mappedPaymentMethod = "credit_card";
    } else if (payment_method === "wallet") {
      mappedPaymentMethod = "cash"; // Assuming wallet defaults to cash
    }

    // Create order
    const order = await Order_Details.create({
      User_ID: userId,
      Restaurant_ID: restaurantId,
      Price: totalPrice,
      Payment_Method: mappedPaymentMethod || "cash",
      status: "pending",
      address: address,
    });

    // Create each order item
    for (let item of items) {
      const food = await Food.findByPk(item.food_id);

      await Order_Item.create({
        Order_ID: order.Order_ID,
        Food_ID: food.Food_ID,
        Quantity: item.quantity,
        Price: food.Price,
        Subtotal: food.Price * item.quantity,
      });
    }

    return res.status(201).json({
      message: "Order placed successfully",
      orderId: order.Order_ID,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getUserOrders = async (req, res) => {
  const userId = req.params.user_id;

  try {
    const orders = await Order_Details.findAll({
      where: { User_ID: userId },
      include: [
        {
          model: Order_Item,
          include: [Food],
        },
      ],
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const getOrdersByRestaurant = async (req, res) => {
  const restaurantId = req.params.id;
  try {
    const orders = await Order_Details.findAll({
      where: { Restaurant_ID: restaurantId },
      include: [
        {
          model: Order_Item,
          include: [Food],
        },
      ],
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  } 
};

const getOrderStatus = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order_Details.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ status: order.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const simulateOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const userId = req.user.id;

  try {
    const order = await Order_Details.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.User_ID !== userId) {
      return res.status(403).json({ message: "You can only update your own orders" });
    }

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated for simulation", status: order.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { placeOrder, getUserOrders, getOrdersByRestaurant, getOrderStatus, simulateOrderStatus };
