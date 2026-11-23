import { Sequelize } from "sequelize";

export const sequelize = new Sequelize("library", "admin", "root", {
  host: "localhost",
  port: 5441,
  dialect: "postgres",
  logging: false,
});
