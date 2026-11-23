import { Router } from "express";
import { z } from "zod";
import { Book } from "../models/Book.js";
import { Author } from "../models/Author.js";
import { bookSchema, idParamSchema } from "../validation/schemas.js";

const router = Router();

// Get all books with author names
router.get("/", async (req, res) => {
  try {
    const books = await Book.findAll({
      include: [{ model: Author, attributes: ["name"] }],
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Add a new book
router.post("/", async (req, res) => {
  try {
    const result = bookSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: z.flattenError(result.error).fieldErrors,
      });
    }

    const book = await Book.create(result.data);

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Error creating book" });
  }
});

// Update all fields of a book (PUT)
router.put("/:id", async (req, res) => {
  try {
    // Validate the ID
    const idResult = idParamSchema.safeParse(req.params);

    if (!idResult.success) {
      return res.status(400).json({
        errors: z.flattenError(idResult.error).fieldErrors,
      });
    }

    // Validate all book fields
    const bodyResult = bookSchema.safeParse(req.body);

    if (!bodyResult.success) {
      return res.status(400).json({
        errors: z.flattenError(bodyResult.error).fieldErrors,
      });
    }

    const id = idResult.data.id;

    // Find the book
    const book = await Book.findByPk(id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Update all fields
    await book.update(bodyResult.data);

    // Return updated book with author
    const updatedBook = await Book.findByPk(id, {
      include: [{ model: Author, attributes: ["name"] }],
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ message: "Error updating book" });
  }
});

// Delete a book
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Book.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting book" });
  }
});

export default router;
