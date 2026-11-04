
import { z } from "zod";
import { borrowBook } from "./library";
import type { Loan as LibraryLoan } from "./library";

// Members Schemas

export const MemberSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
  membership: z.enum(["basic", "premium"]),
  booksOnLoan: z.number().int().nonnegative(),
});


//Loan Schema 

export type Member = z.infer<typeof MemberSchema>;
export const LoanSchema = z.object({
  loanId: z.number().int().positive(),
  title: z.string().min(1),
  memberId: z.number().int().positive(),
});

export type Loan = z.infer<typeof LoanSchema>;

// Loan Arr
const activeLoans: Loan[] = [
  { loanId: 1001, title: "dune", memberId: 7 },
  { loanId: 1002, title: "neuromancer", memberId: 3 },
];

// borrow Book Fun

export const borrowLimit = (membership: unknown): number => {
  const validMembership = z.enum(["basic", "premium"]).parse(membership);
  return validMembership === "basic" ? 2 : 5;
};

// canBorrow Fun

export const canBorrow = (member: unknown): boolean => {
  const validMember = MemberSchema.parse(member);
  return validMember.booksOnLoan < borrowLimit(validMember.membership);
};

// borrowWithLimit Fun

export const borrowWithLimit = (
  title: unknown,
  member: unknown
): LibraryLoan => {
  const validMember = MemberSchema.parse(member);

  if (!canBorrow(validMember)) {
    throw new Error("Borrowing limit reached");
  }

  return borrowBook(title, validMember.id);
};



// find Loan Fun
export const findLoan = (loanId: unknown): Loan => {
  const id = z.number().int().positive().parse(loanId);
  const loan = activeLoans.find((l) => l.loanId === id);

  if (!loan) {
    throw new Error("Loan not found");
  }

  return {
    loanId: loan.loanId,
    title: loan.title,
    memberId: loan.memberId,
  };
};

// markReturned Fun
export const markReturned = (loan: unknown) => {
  const validLoan = LoanSchema.parse(loan);
  return { ...validLoan, returned: true };
};

// returnBook Fun

export const returnBook = (loanId: unknown) => {
  const loan = findLoan(loanId);
  return markReturned(loan);
};

// Borrow many books Fun

export const borrowBooks = (
  titles: unknown,
  member: unknown
): LibraryLoan[] => {
  const validTitles = z
    .array(z.enum(["dune", "neuromancer", "foundation"]))
    .min(1)
    .max(3)
    .parse(titles);

  const validMember = MemberSchema.parse(member);

  if (
    validMember.booksOnLoan + validTitles.length >
    borrowLimit(validMember.membership)
  ) {
    throw new Error("Borrowing limit reached");
  }

  return validTitles.map((title) => borrowBook(title, validMember.id));
};
