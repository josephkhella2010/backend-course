interface ProductType {
  id: number;
  name: string;
  price: number;
  tags: string[];
}

const products: ProductType[] = [
  {
    id: 1,
    name: "Laptop",
    price: 1100,
    tags: ["electronics", "computer", "work"],
  },
  {
    id: 2,
    name: "Headphones",
    price: 890,
    tags: ["electronics"],
  },
  {
    id: 3,
    name: "Backpack",
    price: 590,
    tags: ["bags", "travel", "school", "work"],
  },
  {
    id: 4,
    name: "Keyboard",
    price: 750,
    tags: ["electronics", "computer", "gaming", "work"],
  },
  {
    id: 5,
    name: "Coffee Mug",
    price: 1500,
    tags: ["work"],
  },
];

const filteredByPrice: ProductType[] = products.filter(
  (item) => item.price < 1000,
);
console.log("filteredByPrice", filteredByPrice);

const workProducts: string[] = products
  .filter((item) => item.tags.includes("work"))
  .map((item) => item.name);

console.log("Work products:", workProducts);

//Challenge (optional) Filter + Map + Join
const expensiveProducts: string = products
  .filter((item) => item.tags.length > 1)
  .map((item) => `${item.name} -  ${item.price}`)
  .join(" , ");

console.log("expensiveProducts", expensiveProducts);
