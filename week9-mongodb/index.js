import dotenv from "dotenv";
dotenv.config();
import express from "express";
import "./db.js";
import Book from "./models/Book.js";
import Author from "./models/Author.js";
import Loan from "./models/Loan.js";

const app = express();

app.use(express.json());

// GET /books - filter, sort, and populate author
app.get("/books", async (req, res) => {
  try {
    const filter = {};

    // Filter by genre
    if (req.query.genre) {
      filter.genre = req.query.genre.toLowerCase();
    }

    // Find books and populate author details
    let query = Book.find(filter).populate("author");

    // Sort by publication year
    if (req.query.sort === "old") {
      query = query.sort({ publishedYear: 1 });
    } else if (req.query.sort === "recented") {
      query = query.sort({ publishedYear: -1 });
    }

    const books = await query;

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /books - create a book

app.post("/books", async (req, res) => {
  try {
    const { title, genre, publishedYear } = req.body;

    const newBook = {
      title,
      genre: typeof genre === "string" ? genre.toLowerCase() : genre,
      publishedYear,
    };

    const book = new Book(newBook);
    const savedBook = await book.save();

    res.status(201).json(savedBook);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

// GET /books/:id - get one book

app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(500).json({ error: error.message });
  }
});

// DELETE /books/:id - delete a book
app.delete("/books/:id", async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id);

    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({
      message: "Book deleted successfully",
      book: deletedBook,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /books/:id - update a book

app.put("/books/:id", async (req, res) => {
  try {
    const updateData = { ...req.body };
    const id = req.params.id;
    if (typeof updateData.genre === "string") {
      updateData.genre = updateData.genre.toLowerCase();
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json({
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});
// GET /authors - get all authors
app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.find();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /authors - create a new author
app.post("/authors", async (req, res) => {
  try {
    const author = new Author(req.body);
    const savedAuthor = await author.save();

    res.status(201).json(savedAuthor);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

// GET /authors/:id/books - get all books by an author
app.get("/authors/:id/books", async (req, res) => {
  try {
    const authorId = req.params.id;

    const books = await Book.find({ author: authorId }).populate("author");

    res.status(200).json({
      message: "get book for author  successfully",
      books,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /loans - create a new loan
app.post("/loans", async (req, res) => {
  try {
    const loan = new Loan(req.body);
    const savedLoan = await loan.save();

    res.status(201).json(savedLoan);
  } catch (error) {
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: error.message });
  }
});

// GET /loans - get all loans with book details
app.get("/loans", async (req, res) => {
  try {
    const loans = await Loan.find().populate("book");

    res.status(200).json(loans);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /loans/:id/return - return a borrowed book
app.put("/loans/:id/return", async (req, res) => {
  try {
    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      { returnDate: new Date() },
      { new: true, runValidators: true },
    ).populate("book");

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    res.status(200).json({
      message: "Book returned successfully",
      loan,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ error: "Loan not found" });
    }

    res.status(500).json({ error: error.message });
  }
});

// GET /books/stats/genres - count books by genre
app.get("/books/stats/genres", async (req, res) => {
  try {
    const stats = await Book.aggregate([
      {
        $group: {
          _id: "$genre",
          totalBooks: { $sum: 1 },
        },
      },
      {
        $sort: { totalBooks: -1 },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /loans/stats/borrowers - count loans by borrower
app.get("/loans/stats/borrowers", async (req, res) => {
  try {
    const stats = await Loan.aggregate([
      {
        $group: {
          _id: "$borrower",
          totalLoans: { $sum: 1 },
        },
      },
      {
        $sort: { totalLoans: -1 },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


//test route
app.get("/", (req, res) => {
  res.send("Library API is running!");
});

app.listen(process.env.PORT || 3006, () => {
  console.log("Server running on port localhost:3005");
});
