const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define("Payment", {
  Payment_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Order_ID: { type: DataTypes.INTEGER, allowNull: false },
  Amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  Payment_method: {
    type: DataTypes.ENUM("cash", "credit_card", "debit_card")
  },
  Status: {
    type: DataTypes.ENUM("pending", "completed", "failed"),
    defaultValue: "pending"
  },
  Payment_Date: { type: DataTypes.DATE }
}, {
  tableName: "Payment",
  timestamps: false
});

module.exports = Payment;
