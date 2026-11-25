import request from "supertest";
import { createMenuApp } from "../src/menu";
import { DishSchema } from "../validation/menuSchema";
import type { Express } from "express";

describe("Menu API", () => {
  let app: Express;

  beforeEach(() => {
    app = createMenuApp();
  });

  // ==================================
  // E1 - READ MENU
  // ==================================

  test("GET /api/menu returns 4 dishes", async () => {
    const response = await request(app).get("/api/menu");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(4);

    response.body.forEach((dish: unknown) => {
      expect(DishSchema.safeParse(dish).success).toBe(true);
    });
  });

  test("GET /api/menu/4 returns Cloudberry Parfait", async () => {
    const response = await request(app).get("/api/menu/4");

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Cloudberry Parfait");
    expect(response.body.price).toBe(125);

    expect(DishSchema.safeParse(response.body).success).toBe(true);
  });

  test.each(["99", "abc", "0"])(
    "GET /api/menu/%s returns 404 for unknown dish",
    async (id) => {
      const response = await request(app).get(`/api/menu/${id}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Dish not found");
    },
  );

  // ==================================
  // E2 - ADD A DISH
  // ==================================

  test("POST creates a new valid dish", async () => {
    const newDish = {
      name: "Swedish Apple Cake",
      price: 95,
      category: "DESSERT",
      vegetarian: true,
    };

    const response = await request(app).post("/api/menu").send(newDish);

    expect(response.status).toBe(201);
    expect(response.body.id).toBe(5);
    expect(response.body.name).toBe("Swedish Apple Cake");
    expect(response.body.price).toBe(95);
    expect(response.body.vegetarian).toBe(true);

    expect(DishSchema.safeParse(response.body).success).toBe(true);
  });

  test("GET menu returns 5 dishes after adding a new dish", async () => {
    await request(app).post("/api/menu").send({
      name: "Swedish Apple Cake",
      price: 95,
      category: "DESSERT",
    });

    const response = await request(app).get("/api/menu");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(5);
  });

  test("vegetarian defaults to false when not provided", async () => {
    const response = await request(app).post("/api/menu").send({
      name: "Tomato Soup",
      price: 85,
      category: "STARTER",
    });

    expect(response.status).toBe(201);
    expect(response.body.vegetarian).toBe(false);
  });

  test.each([
    {
      name: "Soup",
      price: -10,
      category: "MAIN",
      field: "price",
    },
    {
      name: "Soup",
      price: 0,
      category: "MAIN",
      field: "price",
    },
    {
      name: "Soup",
      price: 1001,
      category: "MAIN",
      field: "price",
    },
    {
      name: "Soup",
      price: 10.5,
      category: "MAIN",
      field: "price",
    },
    {
      name: "Soup",
      price: "210",
      category: "MAIN",
      field: "price",
    },
    {
      name: "Soup",
      price: 100,
      category: "INVALID",
      field: "category",
    },
    {
      name: "Soup",
      price: 100,
      category: "MAIN",
      vegetarian: "yes",
      field: "vegetarian",
    },
  ])("POST rejects invalid dish data in $field", async ({ field, ...dish }) => {
    const response = await request(app).post("/api/menu").send(dish);

    expect(response.status).toBe(400);
    expect(response.body.issues[field]).toBeDefined();
  });

  test("POST rejects an empty name", async () => {
    const response = await request(app).post("/api/menu").send({
      name: "",
      price: 100,
      category: "MAIN",
    });

    expect(response.status).toBe(400);
    expect(response.body.issues.name).toBeDefined();
  });

  test("POST rejects a name containing only spaces", async () => {
    const response = await request(app).post("/api/menu").send({
      name: "   ",
      price: 100,
      category: "MAIN",
    });

    expect(response.status).toBe(400);
    expect(response.body.issues.name).toBeDefined();
  });

  // ==================================
  // E3 - FILTER MENU
  // ==================================

  test("GET menu filters by category MAIN", async () => {
    const response = await request(app).get("/api/menu?category=MAIN");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);

    response.body.forEach((dish: any) => {
      expect(dish.category).toBe("MAIN");
    });
  });

  test("GET menu filters vegetarian dishes", async () => {
    const response = await request(app).get("/api/menu?vegetarian=true");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    response.body.forEach((dish: any) => {
      expect(dish.vegetarian).toBe(true);
    });
  });

  test("GET menu filters non-vegetarian dishes", async () => {
    const response = await request(app).get("/api/menu?vegetarian=false");

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);

    response.body.forEach((dish: any) => {
      expect(dish.vegetarian).toBe(false);
    });
  });

  test("GET menu combines category and vegetarian filters", async () => {
    const response = await request(app).get(
      "/api/menu?category=MAIN&vegetarian=true",
    );

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe("Mushroom Risotto");
  });

  test("GET menu returns empty array when no dishes match", async () => {
    const response = await request(app).get(
      "/api/menu?category=STARTER&vegetarian=true",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  test("GET menu rejects invalid category filter", async () => {
    const response = await request(app).get("/api/menu?category=SNACK");

    expect(response.status).toBe(400);
    expect(response.body.issues.category).toBeDefined();
  });

  test("GET menu rejects invalid vegetarian filter", async () => {
    const response = await request(app).get("/api/menu?vegetarian=yes");

    expect(response.status).toBe(400);
    expect(response.body.issues.vegetarian).toBeDefined();
  });
});
