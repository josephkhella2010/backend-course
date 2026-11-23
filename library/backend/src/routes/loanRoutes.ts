
import { Router } from "express";
import { Loan } from "../models/Loan.js";

const router = Router();

// Create a loan for a book
router.post("/", async (req, res) => {
  try {
    const { book_id } = req.body;

    const loan = await Loan.create({
      book_id,
    });

    res.status(201).json(loan);
  } catch (error) {
    console.error("Error creating loan:", error);
    res.status(500).json({ message: "Error creating loan" });
  }
});

export default router;
