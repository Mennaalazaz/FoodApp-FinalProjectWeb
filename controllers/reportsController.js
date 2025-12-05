const { Op } = require("sequelize");
const { Order_Details, Order_Item, Food } = require("../models");

// -------------------------------------------------
// Helper: Best Seller Items
// -------------------------------------------------
const getMostOrderedItems = (orders) => {
  const itemCounts = {};

  orders.forEach(order => {
    order.Order_Items.forEach(item => {
      const itemName = item.Food.Name;
      itemCounts[itemName] = (itemCounts[itemName] || 0) + item.Quantity;
    });
  });

  return Object.entries(itemCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, quantity]) => ({ name, quantity }));
};

// -------------------------------------------------
// Helper: Date Range Generator
// -------------------------------------------------
const getDateRange = (type) => {
  const start = new Date();
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  if (type === "daily") {
    start.setHours(0, 0, 0, 0);
  } else if (type === "weekly") {
    start.setDate(start.getDate() - start.getDay()); // Start from Sunday
    start.setHours(0, 0, 0, 0);
  } else if (type === "monthly") {
    start.setDate(1); // first day of month
    start.setHours(0, 0, 0, 0);
  }

  return { start, end };
};

// -------------------------------------------------
// Helper: Build Report Metrics
// -------------------------------------------------
const buildReport = (orders) => {
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + Number(o.Price), 0);
  const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;
  const uniqueUsers = new Set(orders.map(o => o.User_ID)).size;

  return {
    totalOrders,
    totalSales,
    avgOrderValue,
    mostOrderedItems: getMostOrderedItems(orders),
    uniqueUsers,
  };
};

// -------------------------------------------------
// Generic Report Function
// -------------------------------------------------
const generateReport = async (req, res, type) => {
  try {
    const { restaurantId } = req.params;

    // FIXED: compare with req.user.id from JWT
    if (parseInt(restaurantId) !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    } // to ensure restaurant can only access its own reports

    // Get date range for report
    const { start, end } = getDateRange(type);

    const orders = await Order_Details.findAll({
      where: {
        Restaurant_ID: restaurantId,
        CreatedAt: { [Op.between]: [start, end] }
      },
      include: [
        { model: Order_Item, include: [{ model: Food }] }
      ],
      order: [["CreatedAt", "DESC"]]
    });

    const report = buildReport(orders);

    res.json(report);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// -------------------------------------------------
// Exposed Endpoints
// -------------------------------------------------
const dailyReport = (req, res) => generateReport(req, res, "daily");
const weeklyReport = (req, res) => generateReport(req, res, "weekly");
const monthlyReport = (req, res) => generateReport(req, res, "monthly");

module.exports = { dailyReport, weeklyReport, monthlyReport };
