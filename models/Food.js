const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Food = sequelize.define("Food", {
  Food_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Restaurant_ID: { type: DataTypes.INTEGER, allowNull: false },
  Category_ID: { type: DataTypes.INTEGER, allowNull: false },
  Name: { type: DataTypes.STRING(100), allowNull: false },
  Description: { type: DataTypes.STRING(255) },
  Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  imageURL: { type: DataTypes.STRING(255) },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: "Food",
  timestamps: false
});

module.exports = Food;