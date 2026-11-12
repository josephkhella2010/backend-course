import { beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    item: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("../prismaFolder/db.js", () => ({
  default: prismaMock,
}));

import app from "../app.js";

describe("Items API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // GET all items
  it("GET /items - returns all items", async () => {
    prismaMock.item.findMany.mockResolvedValue([
      { id: 1, name: "Chemistry book" },
    ]);

    const response = await request(app).get("/items");

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe("Chemistry book");
  });

  it("GET /items - returns 500 when database request fails", async () => {
    prismaMock.item.findMany.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/items");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to fetch items");
  });

  // GET item by ID
  it("GET /items/:id - returns one item", async () => {
    prismaMock.item.findUnique.mockResolvedValue({
      id: 1,
      name: "Chemistry book",
    });

    const response = await request(app).get("/items/1");

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("Chemistry book");
  });

  it("GET /items/:id - rejects an invalid ID", async () => {
    const response = await request(app).get("/items/abc");

    expect(response.status).toBe(400);
  });

  it("GET /items/:id - returns 404 when item does not exist", async () => {
    prismaMock.item.findUnique.mockResolvedValue(null);

    const response = await request(app).get("/items/999");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Item not found");
  });

  it("GET /items/:id - returns 500 when database request fails", async () => {
    prismaMock.item.findUnique.mockRejectedValue(new Error("Database error"));

    const response = await request(app).get("/items/1");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Internal server error");
  });

  // POST item
  it("POST /items - creates an item", async () => {
    prismaMock.item.create.mockResolvedValue({
      id: 2,
      name: "Biology book",
    });

    const response = await request(app)
      .post("/items")
      .send({ name: "Biology book" });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe("Biology book");
  });

  it("POST /items - rejects invalid data", async () => {
    const response = await request(app).post("/items").send({ name: "" });

    expect(response.status).toBe(400);
  });

  it("POST /items - returns 500 when database request fails", async () => {
    prismaMock.item.create.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/items")
      .send({ name: "Biology book" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to create item");
  });

  // PUT item
  it("PUT /items/:id - updates an item", async () => {
    prismaMock.item.findUnique.mockResolvedValue({
      id: 1,
      name: "Old name",
    });

    prismaMock.item.update.mockResolvedValue({
      id: 1,
      name: "New name",
    });

    const response = await request(app)
      .put("/items/1")
      .send({ name: "New name" });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe("New name");
  });

  it("PUT /items/:id - rejects an invalid ID", async () => {
    const response = await request(app)
      .put("/items/abc")
      .send({ name: "New name" });

    expect(response.status).toBe(400);
  });

  it("PUT /items/:id - rejects invalid item data", async () => {
    const response = await request(app).put("/items/1").send({ name: "" });

    expect(response.status).toBe(400);
  });

  it("PUT /items/:id - returns 404 when item does not exist", async () => {
    prismaMock.item.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .put("/items/999")
      .send({ name: "New name" });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Item not found");
  });

  it("PUT /items/:id - returns 500 when database request fails", async () => {
    prismaMock.item.findUnique.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .put("/items/1")
      .send({ name: "New name" });

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to update item");
  });

  // DELETE item
  it("DELETE /items/:id - deletes an item", async () => {
    prismaMock.item.findUnique.mockResolvedValue({
      id: 1,
      name: "Chemistry book",
    });

    prismaMock.item.delete.mockResolvedValue({
      id: 1,
      name: "Chemistry book",
    });

    const response = await request(app).delete("/items/1");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Item deleted successfully");
  });

  it("DELETE /items/:id - rejects an invalid ID", async () => {
    const response = await request(app).delete("/items/abc");

    expect(response.status).toBe(400);
  });

  it("DELETE /items/:id - returns 404 when item does not exist", async () => {
    prismaMock.item.findUnique.mockResolvedValue(null);

    const response = await request(app).delete("/items/999");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Item not found");
  });

  it("DELETE /items/:id - returns 500 when database request fails", async () => {
    prismaMock.item.findUnique.mockRejectedValue(new Error("Database error"));

    const response = await request(app).delete("/items/1");

    expect(response.status).toBe(500);
    expect(response.body.error).toBe("Failed to delete item");
  });
});
