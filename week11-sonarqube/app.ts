import "dotenv/config";
import express from "express";
import { z } from "zod";
import { connectDB } from "./prismaFolder/db.js";
import { itemIdSchema } from "./utilities/zodSchema.js";
import { createItemSchema } from "./utilities/zodSchema.js";
import prisma from "./prismaFolder/db.js";
const app = express();

// variables

const PORT = process.env.PORT || 3006;

// Fix issue 1: Do not disclose Express version information
app.disable("x-powered-by");

app.use(express.json());

/* app.get("/", (req, res) => {
  res.send("Week 11 SonarQube server is running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is healthy",
  });
});

// Fix issue 2: Use a compare function for numeric sorting
app.get("/numbers/sorted", (req, res) => {
  const numbers = [30, 5, 100, 2];
  const sortedNumbers = numbers.sort((a, b) => a - b);

  res.json(sortedNumbers);
});

// Fix issue 3: Include an initial value in reduce()
app.get("/numbers/total", (req, res) => {
  const numbers = [10, 20, 30];
  const total = numbers.reduce(
    (sum, number) => sum + number,
    0
  );

  res.json({ total });
}); */

// get items using prisma

app.get("/items", async (req, res) => {
  try {
    const items = await prisma.item.findMany();
    res.json(items);
  } catch (error) {
    console.error("Failed to fetch items:", error);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// get items by id  using prisma
app.get("/items/:id", async (req, res) => {
  try {
    const validation = itemIdSchema.safeParse(req.params.id);

    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid item ID",
        details: validation.error.issues,
      });
    }

    const item = await prisma.item.findUnique({
      where: { id: validation.data },
    });

    if (!item) {
      return res.status(404).json({
        error: "Item not found",
      });
    }

    return res.json(item);
  } catch (error) {
    console.error("Failed to fetch item:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});
// post items by id  using prisma

app.post("/items", async (req, res) => {
  try {
    const validation = createItemSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: "Invalid item data",
        details: validation.error.issues,
      });
    }

    const item = await prisma.item.create({
      data: validation.data,
    });

    return res.status(201).json(item);
  } catch (error) {
    console.error("Failed to create item:", error);
    return res.status(500).json({
      error: "Failed to create item",
    });
  }
});

// update items by id  using prisma

app.put("/items/:id", async (req, res) => {
  try {
    const idValidation = itemIdSchema.safeParse(req.params.id);

    if (!idValidation.success) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const bodyValidation = createItemSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return res.status(400).json({
        error: "Invalid item data",
        details: bodyValidation.error.issues,
      });
    }

    const existingItem = await prisma.item.findUnique({
      where: { id: idValidation.data },
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    // Update the item
    const updatedItem = await prisma.item.update({
      where: { id: idValidation.data },
      data: bodyValidation.data,
    });

    return res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Failed to update item:", error);
    return res.status(500).json({ error: "Failed to update item" });
  }
});

// delete items by id  using prisma

app.delete("/items/:id", async (req, res) => {
  try {
    const validation = itemIdSchema.safeParse(req.params.id);

    if (!validation.success) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const existingItem = await prisma.item.findUnique({
      where: { id: validation.data },
    });

    if (!existingItem) {
      return res.status(404).json({ error: "Item not found" });
    }

    await prisma.item.delete({
      where: { id: validation.data },
    });

    return res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete item:", error);
    return res.status(500).json({ error: "Failed to delete item" });
  }
});

export default app;