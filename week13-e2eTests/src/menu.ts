import express, { Request, Response } from "express";
import { Dish, NewDishSchema } from "../validation/menuSchema";

export function createMenuApp() {
  const app = express();

  app.use(express.json());

  // Initial menu data
  const menu: Dish[] = [
    {
      id: 1,
      name: "Toast Skagen",
      price: 145,
      category: "STARTER",
      vegetarian: false,
    },
    {
      id: 2,
      name: "Grilled Arctic Char",
      price: 295,
      category: "MAIN",
      vegetarian: false,
    },
    {
      id: 3,
      name: "Mushroom Risotto",
      price: 245,
      category: "MAIN",
      vegetarian: true,
    },
    {
      id: 4,
      name: "Cloudberry Parfait",
      price: 125,
      category: "DESSERT",
      vegetarian: true,
    },
  ];

  // GET all dishes with optional filters
  app.get("/api/menu", (req: Request, res: Response) => {
    let filteredMenu = [...menu];

    const category = req.query.category;
    const vegetarian = req.query.vegetarian;

    // Validate category filter
    if (
      category !== undefined &&
      (typeof category !== "string" ||
        !["STARTER", "MAIN", "DESSERT"].includes(category))
    ) {
      return res.status(400).json({
        issues: {
          category: ["Invalid category"],
        },
      });
    }

    // Validate vegetarian filter
    if (
      vegetarian !== undefined &&
      vegetarian !== "true" &&
      vegetarian !== "false"
    ) {
      return res.status(400).json({
        issues: {
          vegetarian: ["Must be true or false"],
        },
      });
    }

    if (typeof category === "string") {
      filteredMenu = filteredMenu.filter((dish) => dish.category === category);
    }

    if (vegetarian === "true") {
      filteredMenu = filteredMenu.filter((dish) => dish.vegetarian === true);
    }

    if (vegetarian === "false") {
      filteredMenu = filteredMenu.filter((dish) => dish.vegetarian === false);
    }

    return res.status(200).json(filteredMenu);
  });

  // GET one dish by ID
  app.get("/api/menu/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const dish = menu.find((item) => item.id === id);

    if (!dish) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    return res.status(200).json(dish);
  });

  // POST a new dish
  app.post("/api/menu", (req: Request, res: Response) => {
    const result = NewDishSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        issues: result.error.flatten().fieldErrors,
      });
    }

    const newDish: Dish = {
      id: Math.max(0, ...menu.map((dish) => dish.id)) + 1,
      ...result.data,
    };

    menu.push(newDish);

    return res.status(201).json(newDish);
  });

  return app;
}

export default createMenuApp;
