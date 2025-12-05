const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define("Category", {
  Category_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Name: { type: DataTypes.STRING(100), allowNull: false },
  CreatedAt: { type: DataTypes.DATE },
  UpdatedAt: { type: DataTypes.DATE }
}, {
  tableName: "category",
  timestamps: false
});

module.exports = Category;
