const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Review = sequelize.define("Review", {
  Review_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Rating: { type: DataTypes.INTEGER, allowNull: false },
  Comment: { type: DataTypes.TEXT },
  User_ID: { type: DataTypes.INTEGER, allowNull: false },
  Restaurant_ID: { type: DataTypes.INTEGER, allowNull: false },
  Food_ID: { type: DataTypes.INTEGER },
  CreatedAt: { type: DataTypes.DATE },
  UpdatedAt: { type: DataTypes.DATE }
}, {
  tableName: "Review",
  timestamps: false
});

module.exports = Review;
