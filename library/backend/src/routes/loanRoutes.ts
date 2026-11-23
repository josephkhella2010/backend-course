import { Router } from "express";
import { Loan } from "../models/Loan.js";

const router = Router();
// Get all loans
router.get("/", async (req, res) => {
  try {
    const loans = await Loan.findAll();
    res.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ message: "Error fetching loans" });
  }
});

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
// Delete a loan
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Loan.destroy({
      where: { id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.json({ message: "Loan deleted successfully" });
  } catch (error) {
    console.error("Error deleting loan:", error);
    res.status(500).json({ message: "Error deleting loan" });
  }
});

export default router;
