export interface Book {
  title: string;
  author: string;
  available: boolean;
}

export function addBook(books: Book[], book: Book): Book[] {
  return [...books, book];
}

export function getAvailableBooks(books: Book[]): Book[] {
  return books.filter((book) => book.available);
}

/* export function borrowBook(books: Book[], title: string): Book[] {
  return books.map((book) =>
    book.title === title ? { ...book, available: false } : book,
  );
} */

export function borrowBook(books: Book[], title: string): Book[] {
  const book = books.find((book) => book.title === title);

  if (!book) {
    throw new Error("Book not found");
  }

  if (!book.available) {
    throw new Error("Book is not available");
  }

  return books.map((book) =>
    book.title === title ? { ...book, available: false } : book,
  );
}
