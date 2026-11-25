import { z } from "zod";

// Schema for a complete dish
export const DishSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number().int().positive().max(1000),
  category: z.enum(["STARTER", "MAIN", "DESSERT"]),
  vegetarian: z.boolean(),
});

export type Dish = z.infer<typeof DishSchema>;

// Schema for creating a new dish
export const NewDishSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  price: z.number().int().positive().max(1000),
  category: z.enum(["STARTER", "MAIN", "DESSERT"]),
  vegetarian: z.boolean().optional().default(false),
});
