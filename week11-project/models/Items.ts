import { DataTypes } from "sequelize";
import sequelize from "../config/connect";

const Item = sequelize.define(
  "Item",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "items",
    timestamps: true,
  },
);

export default Item;
