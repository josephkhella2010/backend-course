import { z } from "zod";

export const bookFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  genre: z.string().trim().min(1, "Genre is required"),
  published_year: z.coerce.number().int().max(new Date().getFullYear()),
  author_id: z.coerce.number().int().positive("Choose an author"),
});

