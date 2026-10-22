import { DataTypes } from "sequelize";
import sequelize from "../sequelize.js";

const Book = sequelize.define(
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
    author_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    published_year: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "books",
    timestamps: false,
  },
);

export default Book;
