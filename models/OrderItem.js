const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Order_Item = sequelize.define("Order_Item", {
  Order_Item_ID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  Order_ID: { type: DataTypes.INTEGER, allowNull: false },
  Food_ID: { type: DataTypes.INTEGER, allowNull: false },
  Quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  Price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  Subtotal: { type: DataTypes.DECIMAL(10, 2) ,
    get() {
      return this.getDataValue('Subtotal');
    },
    set(value) {
      // Do nothing, let the DB handle it
    }
  } 
}, {
  tableName: "Order_Item",
  timestamps: false
});

module.exports = Order_Item;
