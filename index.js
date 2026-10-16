import "dotenv/config";
import express from "express";
import pool from "./db.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

const PORT = process.env.PORT || 3005;

// Get all books route
app.get("/books", async (req, res) => {
  try {
    const results = await pool.query("SELECT * FROM books");

    return res.status(200).json({
      message: "Successfully retrieved books",
      books: results.rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get one book by ID route
app.get("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        message: "Invalid book ID. ID must be a positive integer",
      });
    }

    const results = await pool.query("SELECT * FROM books WHERE id = $1", [id]);

    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json({
      message: "Successfully retrieved book",
      book: results.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Add book route
app.post("/books", async (req, res) => {
  try {
    const { title, genre, published_year } = req.body;

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Title is required and must be a non-empty string",
      });
    }

    const results = await pool.query(
      `INSERT INTO books (title, genre, published_year)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title.trim(), genre ?? null, published_year ?? null],
    );

    return res.status(201).json({
      message: "Book successfully added",
      book: results.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Delete book route by ID
app.delete("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        message: "Invalid book ID. ID must be a positive integer",
      });
    }

    const results = await pool.query(
      "DELETE FROM books WHERE id = $1 RETURNING *",
      [id],
    );

    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json({
      message: "Book deleted",
      book: results.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Update book route by ID
app.put("/books/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, genre, published_year } = req.body;

    if (!/^[1-9]\d*$/.test(id)) {
      return res.status(400).json({
        message: "Invalid book ID. ID must be a positive integer",
      });
    }

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        message: "Title is required and must be a non-empty string",
      });
    }

    const results = await pool.query(
      `UPDATE books
       SET title = $1, genre = $2, published_year = $3
       WHERE id = $4
       RETURNING *`,
      [title.trim(), genre ?? null, published_year ?? null, id],
    );

    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json({
      message: "Book successfully updated",
      book: results.rows[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
