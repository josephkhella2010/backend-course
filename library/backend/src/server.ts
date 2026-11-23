import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { sequelize } from "./config/database.js";
import "./models/index.js";
import getBooks from "./routes/bookRoutes.js";
import authorRoutes from "./routes/authorRoutes.js";
import loanRoutes from "./routes/loanRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Library API is running!");
});

app.use("/api/books", getBooks);
app.use("/api/authors", authorRoutes);
app.use("/api/loans", loanRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connected successfully!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to PostgreSQL:", error);
  }
};

startServer();
