import { describe, it, expect } from "vitest";
import {
  addBook,
  getAvailableBooks,
  borrowBook,
  type Book,
} from "../library.js";

const books: Book[] = [
  {
    title: "Book A",
    author: "Author A",
    available: true,
  },
  {
    title: "Book B",
    author: "Author B",
    available: false,
  },
];

describe("Library functions", () => {
  it("adds a book", () => {
    const result = addBook(books, {
      title: "Book C",
      author: "Author C",
      available: true,
    });

    expect(result).toHaveLength(3);
  });

  it("returns only available books", () => {
    const result = getAvailableBooks(books);

    expect(result).toHaveLength(1);
    expect(result[0]?.title).toBe("Book A");
  });

  it("marks a borrowed book as unavailable", () => {
    const result = borrowBook(books, "Book A");

    expect(result[0]?.available).toBe(false);
  });
});
