

import { z } from "zod";

export const bookSchema = z.object({
  title: z
    .string()
    .min(1, { message: "A book needs a title" })
    .max(100, { message: "Title must be 100 characters or less" }),

  genre: z
    .string()
    .min(1, { message: "A book needs a genre" })
    .max(50, { message: "Genre must be 50 characters or less" }),

  published_year: z.coerce.number().int({
    message: "Published year must be a whole number",
  }),
});

export type Book = z.infer<typeof bookSchema>;

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const bookPatchSchema = bookSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be sent",
  });

export const bookQuerySchema = z.object({
  genre: z.string().optional(),

  sort: z.enum(["id", "title", "genre", "published_year"]).default("id"),

  search: z.string().optional(),

  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const authorSchema = z.object({
  name: z.string().min(2).max(50),
});

export type Author = z.infer<typeof authorSchema>;

export const memberSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.email().toLowerCase(),
});

export type Member = z.infer<typeof memberSchema>;

export const loanSchema = z.object({
  book_id: z.coerce.number().int().positive(),
  member_id: z.coerce.number().int().positive(),
});

export type Loan = z.infer<typeof loanSchema>;
