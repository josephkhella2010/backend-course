import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";

export const Loan = sequelize.define(
  "Loan",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
    },
  },
  {
    tableName: "loans",
    timestamps: false,
  },
);
