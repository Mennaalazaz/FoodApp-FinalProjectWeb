const sequelize = require("../config/db");

const User = require("./User");
const Restaurant = require("./Restaurant");
const Order_Details = require("./Order_Details");
const Category = require("./Category");
const Food = require("./Food");
const Order_Item = require("./OrderItem");
const Payment = require("./Payment");
const Review = require("./Review");

// ========== ASSOCIATIONS ==========

// User → Order Details
User.hasMany(Order_Details, { foreignKey: "User_ID" });
Order_Details.belongsTo(User, { foreignKey: "User_ID" });

// Restaurant → Order Details
Restaurant.hasMany(Order_Details, { foreignKey: "Restaurant_ID" });
Order_Details.belongsTo(Restaurant, { foreignKey: "Restaurant_ID" });

// Category → Food
Category.hasMany(Food, { foreignKey: "Category_ID" });
Food.belongsTo(Category, { foreignKey: "Category_ID" });

// Restaurant → Food
Restaurant.hasMany(Food, { foreignKey: "Restaurant_ID" });
Food.belongsTo(Restaurant, { foreignKey: "Restaurant_ID" });

// Order Details → Order Items
Order_Details.hasMany(Order_Item, { foreignKey: "Order_ID" });
Order_Item.belongsTo(Order_Details, { foreignKey: "Order_ID" });

// Food → Order Items
Food.hasMany(Order_Item, { foreignKey: "Food_ID" });
Order_Item.belongsTo(Food, { foreignKey: "Food_ID" });

// Order → Payment
Order_Details.hasOne(Payment, { foreignKey: "Order_ID" });
Payment.belongsTo(Order_Details, { foreignKey: "Order_ID" });

// User → Review
User.hasMany(Review, { foreignKey: "User_ID" });
Review.belongsTo(User, { foreignKey: "User_ID" });

// Restaurant → Review
Restaurant.hasMany(Review, { foreignKey: "Restaurant_ID" });
Review.belongsTo(Restaurant, { foreignKey: "Restaurant_ID" });

// Food → Review
Food.hasMany(Review, { foreignKey: "Food_ID" });
Review.belongsTo(Food, { foreignKey: "Food_ID" });

module.exports = {
  sequelize,
  User,
  Restaurant,
  Order_Details,
  Category,
  Food,
  Order_Item,
  Payment,
  Review
};
