import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  genre: z.string().trim().min(1, "Genre is required"),
  published_year: z.coerce.number().int().max(new Date().getFullYear()),
  author_id: z.coerce.number().int().positive("Choose an author"),
});

export const authorSchema = z.object({
  name: z.string().trim().min(1, "Author name is required"),
});

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const bookPatchSchema = bookSchema.partial();
