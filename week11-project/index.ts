import dotenv from "dotenv";
dotenv.config();
import "./instrument.js";
import express from "express";
import { ZodError, z } from "zod";
import * as Sentry from "@sentry/node";
import sequelize from "./config/connect.ts";
import { reportError } from "./utils/reportError.ts";
import Item from "./models/Items.ts";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;

// zod schema

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

if (process.env.NODE_ENV !== "production") {
  app.get("/debug-sentry", (req, res) => {
    throw new Error("My first Sentry error!");
  });
}

////////////////////////////////////////////////////

// GET /items route
app.get("/items", async (req, res) => {
  Sentry.addBreadcrumb({
    message: "Fetch items route",
    level: "info",
  });

  //Sentry.setTag("feature", "items");
  try {
    const items = await Item.findAll();

    res.status(200).json(items);
  } catch (error) {
    // Sentry.captureException(error);
    reportError(error, "items");

    res.status(500).json({
      message: "Could not get items",
    });
  }
});

// Post/item

app.post("/items", async (req, res) => {
  Sentry.addBreadcrumb({
    message: "Create item route",
    level: "info",
  });
  //Sentry.setTag("feature", "items");

  try {
    const validatedData = itemSchema.parse(req.body);
    const item = await Item.create({
      name: validatedData.name,
    });

    res.status(201).json(item);
  } catch (error) {
    //Sentry.captureException(error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: error.issues,
      });
    }

    reportError(error, "items");

    res.status(500).json({
      message: "Could not create item",
    });
  }
});

// Get Items By Id
app.get("/items/:id", async (req, res) => {
  Sentry.addBreadcrumb({
    message: "Fetch item by ID route",
    level: "info",
  });

  //Sentry.setTag("feature", "items");

  try {
    const id = z.number().int().positive().parse(Number(req.params.id));
    const item = await Item.findByPk(id);
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }
    res.status(200).json(item);

    /*  res.status(200).json({
      name: (item.get("name") as string).toUpperCase(),
    }); */
  } catch (error) {
    //Sentry.captureException(error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid item ID",
        errors: error.issues,
      });
    }
    reportError(error, "items");

    res.status(500).json({
      message: "Could not get item",
    });
  }
});

// Update Items By Id

app.put("/items/:id", async (req, res) => {
  Sentry.addBreadcrumb({
    message: "Update item route",
    level: "info",
  });

  //Sentry.setTag("feature", "items");
  try {
    const id = z.number().int().positive().parse(Number(req.params.id));
    const item = await Item.findByPk(id);
    const validatedData = itemSchema.parse(req.body);
    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    await item.update({
      name: validatedData.name,
    });

    res.status(200).json(item);
  } catch (error) {
    // Sentry.captureException(error);
    if (error instanceof ZodError) {
      return res.status(400).json({
        message: "Invalid request body",
        errors: error.issues,
      });
    }
    reportError(error, "items");

    res.status(500).json({
      message: "Could not update item",
    });
  }
});

// Delete Items By Id
app.delete("/items/:id", async (req, res) => {
  Sentry.addBreadcrumb({
    message: "Delete item route",
    level: "info",
  });

  //Sentry.setTag("feature", "items");
  try {
    const id = z.number().int().positive().parse(Number(req.params.id));
    const item = await Item.findByPk(id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    await item.destroy();

    res.status(200).json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    //Sentry.captureException(error);
    reportError(error, "items");

    res.status(500).json({
      message: "Could not delete item",
    });
  }
});

////////////////////////////////////////////////////

Sentry.setupExpressErrorHandler(app);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    await sequelize.sync();
    console.log("Database tables synchronized!");
  } catch (error) {
    console.error("Database connection failed:", error);
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
