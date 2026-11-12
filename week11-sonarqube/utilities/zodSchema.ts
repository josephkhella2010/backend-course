import { z } from "zod";

export const itemIdSchema = z.coerce.number().int().positive();
export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
});
