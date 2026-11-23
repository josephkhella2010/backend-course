import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import { bookSchema } from "../validation/schemas.js";

export const Book = sequelize.define(
  "Book",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    genre: {
      type: DataTypes.STRING,
    },
    published_year: {
      type: DataTypes.INTEGER,
    },
    author_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "authors",
        key: "id",
      },
    },
  },
  {
    tableName: "books",
    timestamps: false,
  },
);
