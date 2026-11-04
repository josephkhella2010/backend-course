
import { describe, test, expect } from "vitest";
import { findBook,checkOutBook ,registerLoan,borrowBook} from "./library";


// findBook Tests
describe("findBook", () => {
  test("finds dune", () => {
    expect(findBook("dune")).toEqual({
      title: "dune",
      copiesAvailable: 3,
    });
  });

  test("finds foundation even with zero copies", () => {
    expect(findBook("foundation")).toEqual({
      title: "foundation",
      copiesAvailable: 0,
    });
  });

  test("throws for an unknown book", () => {
    expect(() => findBook("harry potter")).toThrow();
  });

  test("throws for a number", () => {
    expect(() => findBook(42)).toThrow();
  });
});

// checkOutBook Tests
describe("checkOutBook", () => {
  const dune = { title: "dune", copiesAvailable: 3 };

  test("returns a number", () => {
    expect(typeof checkOutBook(dune)).toBe("number");
  });

  test("returns a whole number", () => {
    expect(Number.isInteger(checkOutBook(dune))).toBe(true);
  });

  test("returns a number between 1000 and 9999", () => {
    const loanId = checkOutBook(dune);
    expect(loanId).toBeGreaterThanOrEqual(1000);
    expect(loanId).toBeLessThanOrEqual(9999);
  });

  test("throws when no copies are available", () => {
    expect(() =>
      checkOutBook({ title: "foundation", copiesAvailable: 0 })
    ).toThrow("No copies available");
  });

  test("throws when copiesAvailable is missing", () => {
    expect(() => checkOutBook({ title: "dune" })).toThrow();
  });
});

//register Loan Tests

describe("registerLoan", () => {
  test("registers a valid loan", () => {
    expect(registerLoan(1234, "dune", 7)).toEqual({
      loanId: 1234,
      title: "dune",
      memberId: 7,
    });
  });

  test("throws when memberId is zero", () => {
    expect(() => registerLoan(1234, "dune", 0)).toThrow();
  });

  test("throws for an invalid book title", () => {
    expect(() =>
      registerLoan(1234, "harry potter", 7)
    ).toThrow();
  });
});


// borrowBook tests

describe("Library Integration Tests", () => {
  test("borrows dune successfully", () => {
    const loan = borrowBook("dune", 7);

    expect(loan.title).toBe("dune");
    expect(loan.memberId).toBe(7);
  });

  test("generates a loan ID between 1000 and 9999", () => {
    const loan = borrowBook("dune", 7);

    expect(loan.loanId).toBeGreaterThanOrEqual(1000);
    expect(loan.loanId).toBeLessThanOrEqual(9999);
  });

  test("cannot borrow foundation when no copies are available", () => {
    expect(() => borrowBook("foundation", 7)).toThrow(
      "No copies available"
    );
  });

  test("throws for an invalid member ID", () => {
    expect(() => borrowBook("dune", -1)).toThrow();
  });
});