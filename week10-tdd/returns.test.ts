
import { describe, test, expect } from "vitest";
import { borrowLimit, findLoan, markReturned } from "./returns";

describe("Returns Unit Tests", () => {
  test("findLoan finds the loan's title and member", () => {
    const loan = findLoan(1001);
    expect(loan.title).toBe("dune");
    expect(loan.memberId).toBe(7);
  });

  test("findLoan throws for an unknown loan", () => {
    expect(() => findLoan(9999)).toThrow("Loan not found");
  });

  test("markReturned marks a loan as returned", () => {
    const result = markReturned({
      loanId: 1001,
      title: "dune",
      memberId: 7,
    });

    expect(result.returned).toBe(true);
  });
  test("basic membership has a borrowing limit of 2", () => {
  expect(borrowLimit("basic")).toBe(2);
});

test("premium membership has a borrowing limit of 5", () => {
  expect(borrowLimit("premium")).toBe(5);
});
});
