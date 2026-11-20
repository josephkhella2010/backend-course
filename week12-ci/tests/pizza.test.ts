import { describe, it, expect } from "vitest";
import { createPizza, calculatePizzaPrice, isValidPizza } from "../src/pizza.js";

describe("Pizza functions", () => {
  it("creates a pizza", () => {
    const pizza = createPizza("Margherita", 100, "medium");

    expect(pizza.name).toBe("Margherita");
    expect(pizza.price).toBe(100);
    expect(pizza.size).toBe("medium");
  });

  it("calculates the total price", () => {
    const pizza = createPizza("Pepperoni", 120, "large");

    expect(calculatePizzaPrice(pizza, 2)).toBe(240);
  });

  it("checks if a pizza is valid", () => {
    const pizza = createPizza("Margherita", 100, "medium");

    expect(isValidPizza(pizza)).toBe(true);
  });
});
