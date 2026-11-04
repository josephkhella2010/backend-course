import { describe, test, expect } from "vitest";
import {
  createPizza,
  orderPizza,
  sendOrder,
  chargeCustomer,
} from "./pizzashop";

describe("Pizza Shop Unit Tests", () => {
  test("createPizza returns correct type and price", () => {
    expect(createPizza("margherita")).toEqual({
      type: "margherita",
      price: 100,
    });
  });

  test("createPizza throws for unknown type", () => {
    expect(() => createPizza("hawaii")).toThrow();
  });

  test("createPizza returns vegetarian pizza", () => {
    expect(createPizza("vegetarian")).toEqual({
      type: "vegetarian",
      price: 110,
    });
  });

  test("sendOrder returns a numeric order id", () => {
    const id = sendOrder({ type: "pepperoni", price: 120 });

    expect(typeof id).toBe("number");
    expect(Number.isInteger(id)).toBe(true);
    expect(id).toBeGreaterThanOrEqual(0);
    expect(id).toBeLessThan(1000);
  });

  test("orderPizza returns true for a valid pizza", () => {
    expect(orderPizza("pepperoni")).toBe(true);
  });

  test("chargeCustomer returns true for a valid order", () => {
    expect(chargeCustomer(42, 100)).toBe(true);
  });

  test("chargeCustomer throws for undefined order ID", () => {
    expect(() => chargeCustomer(undefined, 100)).toThrow(
      "Cannot charge the customer without a valid order ID!"
    );
  });

  test("chargeCustomer throws for a negative order ID", () => {
    expect(() => chargeCustomer(-1, 100)).toThrow();
  });

  test("chargeCustomer throws for a decimal order ID", () => {
    expect(() => chargeCustomer(12.5, 100)).toThrow();
  });

  test("chargeCustomer throws for an amount of zero", () => {
    expect(() => chargeCustomer(42, 0)).toThrow();
  });
});