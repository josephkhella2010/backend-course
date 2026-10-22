import dotenv from "dotenv";
import express from "express";
import ConnectDB from "./connectDB.js";
import Book from "./models/Book.js";
import Author from "./models/Author.js";
import Loan from "./models/Loan.js";
import Member from "./models/Member.js";

dotenv.config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3004;

// books Routes

// GET all books with their authors
app.get("/books", async (req, res) => {
  try {
    const books = await Book.findAll({
      include: Author,
    });

    res.status(200).json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// GET one book by ID with Author
app.get("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id, {
      include: Author,
    });

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Failed to fetch book" });
  }
});

// POST a new book
app.post("/books", async (req, res) => {
  try {
    const { title, author_id, published_year } = req.body;

    const book = await Book.create({
      title,
      author_id,
      published_year,
    });

    res.status(201).json(book);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({
      error: "Failed to create book",
      details: error.message,
    });
  }
});

// PUT — update a book by ID
app.put("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    const { title, author_id, published_year } = req.body;

    await book.update({
      title,
      author_id,
      published_year,
    });

    res.status(200).json(book);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({
      error: "Failed to update book",
      details: error.message,
    });
  }
});

// DELETE a book by ID
app.delete("/books/:id", async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);

    if (!book) {
      return res.status(404).json({ error: "Book not found" });
    }

    await book.destroy();

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Failed to delete book" });
  }
});

// authours Routes

// GET all authors

app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.status(200).json(authors);
  } catch (error) {
    console.error("Error fetching authors:", error);
    res.status(500).json({ error: "Failed to fetch authors" });
  }
});

// POST - Create an author

app.post("/authors", async (req, res) => {
  try {
    const { name } = req.body;

    const author = await Author.create({ name });

    res.status(201).json(author);
  } catch (error) {
    console.error("Error creating author:", error);
    res.status(500).json({ error: "Failed to create author" });
  }
});

// GET an author with all their books

app.get("/authors/:id/books", async (req, res) => {
  try {
    const author = await Author.findByPk(req.params.id, {
      include: Book,
    });

    if (!author) {
      return res.status(404).json({ error: "Author not found" });
    }

    res.status(200).json(author);
  } catch (error) {
    console.error("Error fetching author's books:", error);
    res.status(500).json({ error: "Failed to fetch author's books" });
  }
});

// Loan Route

// create loan book

app.post("/loans", async (req, res) => {
  try {
    const { member_id, book_id } = req.body;

    const loan = await Loan.create({
      member_id,
      book_id,
    });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Member Routes

//create member

app.post("/members", async (req, res) => {
  try {
    const { name } = req.body;

    const member = await Member.create({ name });

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//the member's loans

app.get("/members/:id/loans", async (req, res) => {
  try {
    const member = await Member.findByPk(req.params.id, {
      include: {
        model: Book,
        through: { attributes: ["loan_date", "returned_at"] },
      },
    });

    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//

// Start server after connecting to the database
async function startServer() {
  try {
    await ConnectDB();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
  }
}

startServer();
