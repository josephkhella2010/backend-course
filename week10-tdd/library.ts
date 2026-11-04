
import { z } from "zod";

// Library catalogue
const catalogue = {
  dune: { title: "dune", copiesAvailable: 3 },
  neuromancer: { title: "neuromancer", copiesAvailable: 1 },
  foundation: { title: "foundation", copiesAvailable: 0 },
};

// Book Schemas
export const BookTitleSchema = z.enum([
  "dune",
  "neuromancer",
  "foundation",
]);

export const BookSchema = z.object({
  title: BookTitleSchema,
  copiesAvailable: z.number().int().nonnegative(),
});

export type Book = z.infer<typeof BookSchema>;


// Loan Schema 
export const LoanSchema = z.object({
  loanId: z.number().int().positive(),
  title: BookTitleSchema,
  memberId: z.number().int().positive(),
});

export type Loan = z.infer<typeof LoanSchema>;


export const registerLoan = (
  loanId: unknown,
  title: unknown,
  memberId: unknown
): Loan => {
  return LoanSchema.parse({ loanId, title, memberId });
};



// findBook by title Fun
export const findBook = (title: unknown): Book => {
  const validTitle = BookTitleSchema.parse(title);

  return BookSchema.parse(catalogue[validTitle]);
};


//chekoutBook Fun

export const checkOutBook = (book: unknown): number => {
  const validBook = BookSchema.parse(book);

  if (validBook.copiesAvailable === 0) {
    throw new Error("No copies available");
  }

  return Math.floor(Math.random() * 9000) + 1000;
};


// borrowBook Fun
export const borrowBook = (
  title: unknown,
  memberId: unknown
): Loan => {
  const book = findBook(title);
  const loanId = checkOutBook(book);

  return registerLoan(loanId, book.title, memberId);
};