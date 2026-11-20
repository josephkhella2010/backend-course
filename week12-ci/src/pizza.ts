export interface Pizza {
  name: string;
  price: number;
  size: "small" | "medium" | "large";
}

export function createPizza(
  name: string,
  price: number,
  size: Pizza["size"],
): Pizza {
  return { name, price, size };
}

export function calculatePizzaPrice(pizza: Pizza, quantity: number): number {
  return pizza.price * quantity;
}

export function isValidPizza(pizza: Pizza): boolean {
  return pizza.name.trim().length > 0 && pizza.price > 0;
}
