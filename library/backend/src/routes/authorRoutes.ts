import { Router } from "express";
import { z } from "zod";
import { Author } from "../models/Author.js";
import { authorSchema } from "../validation/schemas.js";

const router = Router();

// Get all authors
router.get("/", async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching authors" });
  }
});

// Add a new author with Zod validation
router.post("/", async (req, res) => {
  try {
    const result = authorSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: z.flattenError(result.error).fieldErrors,
      });
    }

    const author = await Author.create(result.data);

    res.status(201).json(author);
  } catch (error) {
    res.status(500).json({ message: "Error creating author" });
  }
});

export default router;
