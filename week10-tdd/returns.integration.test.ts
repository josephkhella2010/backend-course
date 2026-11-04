
import { describe, test, expect } from "vitest";
import { borrowBooks, returnBook } from "./returns";

describe("Returns Integration Tests", () => {
  test("returnBook returns a loan successfully", () => {
    const result = returnBook(1001);

    expect(result.returned).toBe(true);
    expect(result.title).toBe("dune");
  });
  
test("premium member can borrow two books", () => {
  const loans = borrowBooks(
    ["dune", "neuromancer"],
    {
      id: 3,
      name: "Bob",
      membership: "premium",
      booksOnLoan: 0,
    }
  );

  expect(loans).toHaveLength(2);
  expect(loans[0].title).toBe("dune");
  expect(loans[1].title).toBe("neuromancer");
});

test("borrowing an empty array throws an error", () => {
  expect(() =>
    borrowBooks([], {
      id: 3,
      name: "Bob",
      membership: "premium",
      booksOnLoan: 0,
    })
  ).toThrow();
});

test("borrowing four books throws an error", () => {
  expect(() =>
    borrowBooks(
      ["dune", "neuromancer", "dune", "neuromancer"],
      {
        id: 3,
        name: "Bob",
        membership: "premium",
        booksOnLoan: 0,
      }
    )
  ).toThrow();
});

test("basic member cannot exceed the borrowing limit", () => {
  expect(() =>
    borrowBooks(["dune", "neuromancer"], {
      id: 1,
      name: "Alice",
      membership: "basic",
      booksOnLoan: 1,
    })
  ).toThrow("Borrowing limit reached");
});

});
