import { describe, it, expect } from "vitest";
import { itemIdSchema, createItemSchema } from "../utilities/zodSchema.js";

describe("Item ID schema", () => {
  it("should accept a positive integer", () => {
    expect(itemIdSchema.safeParse("1").success).toBe(true);
  });

  it("should reject a negative ID", () => {
    expect(itemIdSchema.safeParse("-1").success).toBe(false);
  });

  it("should reject a non-numeric ID", () => {
    expect(itemIdSchema.safeParse("abc").success).toBe(false);
  });
});

describe("Create item schema", () => {
  it("should accept a valid item", () => {
    expect(
      createItemSchema.safeParse({
        name: "Chemistry book",
      }).success,
    ).toBe(true);
  });

  it("should reject an empty name", () => {
    expect(
      createItemSchema.safeParse({
        name: "",
      }).success,
    ).toBe(false);
  });
});
