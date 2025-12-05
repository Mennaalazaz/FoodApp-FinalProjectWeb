const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order_Details = sequelize.define("Order_Details", {
  Order_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  User_ID: { type: DataTypes.INTEGER, allowNull: false },
  Restaurant_ID: { type: DataTypes.INTEGER, allowNull: false },
  Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  Payment_Method: {
    type: DataTypes.ENUM("cash", "credit_card", "debit_card"),
    defaultValue: "cash"
  },
  status: {
    type: DataTypes.ENUM("pending", "confirmed", "preparing", "ready", "delivered", "cancelled"),
    defaultValue: "pending"
  },
  address: { type: DataTypes.STRING, allowNull: true },
  CreatedAt: { type: DataTypes.DATE },
  UpdatedAt: { type: DataTypes.DATE }
}, {
  tableName: "order_details",
  timestamps: true,
  createdAt: "CreatedAt",
  updatedAt: "UpdatedAt"
});

module.exports = Order_Details;
