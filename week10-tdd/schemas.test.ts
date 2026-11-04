import { describe, test, expect } from "vitest";
import {
  PizzaTypeSchema,
  PizzaSchema,
  AmountSchema,
  OrderIdSchema,
} from "./pizzashop";

describe("Pizza Schemas", () => {
  test("accepts margherita", () => {
    expect(PizzaTypeSchema.parse("margherita")).toBe("margherita");
  });

  test("rejects capitalized Margherita", () => {
    expect(() => PizzaTypeSchema.parse("Margherita")).toThrow();
  });

  test("accepts a valid pizza", () => {
    expect(
      PizzaSchema.parse({ type: "pepperoni", price: 120 })
    ).toEqual({ type: "pepperoni", price: 120 });
  });

  test("rejects a pizza with missing price", () => {
    expect(() => PizzaSchema.parse({ type: "pepperoni" })).toThrow();
  });

  test("rejects a string amount", () => {
    expect(() => AmountSchema.parse("100")).toThrow();
  });

  test("accepts order ID zero", () => {
    expect(OrderIdSchema.parse(0)).toBe(0);
  });
});