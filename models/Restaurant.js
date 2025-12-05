const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Restaurant = sequelize.define("Restaurant", {
  Restaurant_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  phone: { type: DataTypes.STRING(50), allowNull: false },
  address: { type: DataTypes.STRING(255) },
  logoURL: { type: DataTypes.STRING(255) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: "restaurant",
  timestamps: true
});

module.exports = Restaurant;
