import express from "express";
import pool from "./db.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.static("public"));
const PORT = process.env.PORT;

// get all books route

app.get("/books", async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM books");

    return res.status(200).json({
      message: "Successfully got books",
      books: results.rows,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// add book route

app.post("/books", async (req, res) => {
  try {
    const { title, genre, published_year } = req.body;

    const results = await pool.query(
      `INSERT INTO books (title, genre, published_year)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, genre, published_year],
    );
    return res
      .status(201)
      .json({ message: "sucessfully add  book", book: results.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// delete book route by id

app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const results = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id],
    );

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res
      .status(201)
      .json({ message: "sucessfully add  book", book: results.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// update  book route by id

app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { title, genre, published_year } = req.body;

    const results = await pool.query(
      `UPDATE books
       SET title = $1, genre = $2, published_year = $3
       WHERE id = $4
       RETURNING *`,
      [title, genre, published_year, id],
    );
    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }
    return res
      .status(200)
      .json({ message: "sucessfully updated book", book: results.rows[0] });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

console.log("Node process is still running...");
