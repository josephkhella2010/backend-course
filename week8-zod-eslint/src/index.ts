/* 

import "dotenv/config";
import express from "express";
import pool from "./db.js";
import { env } from "./env.js";

import {
  bookSchema,
  idParamSchema,
  bookPatchSchema,
  bookQuerySchema,
  authorSchema,
  memberSchema,
  loanSchema,
} from "./schemas.js";

import type { Book, Author, Member, Loan } from "./schemas.js";

import { validate } from "./middleware/validate.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }

  return "An unknown error occurred";
}

// GET all books
app.get("/books", validate(bookQuerySchema, "query"), async (_req, res) => {
  try {
    const { genre, sort, search, page, limit } = res.locals.validated.query;

    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (genre) {
      values.push(genre);
      conditions.push(`genre = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const offset = (page - 1) * limit;

    values.push(limit);
    const limitPlaceholder = `$${values.length}`;

    values.push(offset);
    const offsetPlaceholder = `$${values.length}`;

    const sql = `
        SELECT *
        FROM books
        ${whereClause}
        ORDER BY ${sort}
        LIMIT ${limitPlaceholder}
        OFFSET ${offsetPlaceholder}
      `;

    const results = await pool.query<Book>(sql, values);

    return res.status(200).json({
      message: "Successfully got books",
      books: results.rows,
      page,
      limit,
    });
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// GET one book
app.get("/books/:id", validate(idParamSchema, "params"), async (_req, res) => {
  try {
    const { id } = res.locals.validated.params;

    const results = await pool.query<Book>(
      "SELECT * FROM books WHERE id = $1",
      [id],
    );

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({
      message: "Successfully got book",
      book: results.rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// POST a book
app.post("/books", validate(bookSchema, "body"), async (_req, res) => {
  try {
    const book = res.locals.validated.body;

    const results = await pool.query<Book>(
      `INSERT INTO books (title, genre, published_year)
         VALUES ($1, $2, $3)
         RETURNING *`,
      [book.title, book.genre, book.published_year],
    );

    return res.status(201).json({
      message: "Successfully added book",
      book: results.rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// PUT a book
app.put(
  "/books/:id",
  validate(idParamSchema, "params"),
  validate(bookSchema, "body"),
  async (_req, res) => {
    try {
      const { id } = res.locals.validated.params;
      const book = res.locals.validated.body;

      const results = await pool.query<Book>(
        `UPDATE books
         SET title = $1, genre = $2, published_year = $3
         WHERE id = $4
         RETURNING *`,
        [book.title, book.genre, book.published_year, id],
      );

      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json({
        message: "Successfully updated book",
        book: results.rows[0],
      });
    } catch (err) {
      return res.status(500).json({
        message: getErrorMessage(err),
      });
    }
  },
);

// PATCH a book
app.patch(
  "/books/:id",
  validate(idParamSchema, "params"),
  validate(bookPatchSchema, "body"),
  async (_req, res) => {
    try {
      const { id } = res.locals.validated.params;
      const book = res.locals.validated.body;

      const results = await pool.query<Book>(
        `UPDATE books
         SET title = COALESCE($1, title),
             genre = COALESCE($2, genre),
             published_year = COALESCE($3, published_year)
         WHERE id = $4
         RETURNING *`,
        [
          book.title ?? null,
          book.genre ?? null,
          book.published_year ?? null,
          id,
        ],
      );

      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json({
        message: "Successfully patched book",
        book: results.rows[0],
      });
    } catch (err) {
      return res.status(500).json({
        message: getErrorMessage(err),
      });
    }
  },
);

// DELETE a book
app.delete(
  "/books/:id",
  validate(idParamSchema, "params"),
  async (_req, res) => {
    try {
      const { id } = res.locals.validated.params;

      const results = await pool.query<Book>(
        "DELETE FROM books WHERE id = $1 RETURNING *",
        [id],
      );

      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json({
        message: "Successfully deleted book",
        book: results.rows[0],
      });
    } catch (err) {
      return res.status(500).json({
        message: getErrorMessage(err),
      });
    }
  },
);

// GET all authors
app.get("/authors", async (_req, res) => {
  try {
    const results = await pool.query<Author>("SELECT * FROM authors");

    return res.status(200).json(results.rows);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// POST an author
app.post("/authors", validate(authorSchema, "body"), async (_req, res) => {
  try {
    const author = res.locals.validated.body;

    const results = await pool.query<Author>(
      `INSERT INTO authors (name)
         VALUES ($1)
         RETURNING *`,
      [author.name],
    );

    return res.status(201).json(results.rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// GET all members
app.get("/members", async (_req, res) => {
  try {
    const results = await pool.query<Member>("SELECT * FROM members");

    return res.status(200).json(results.rows);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// POST a member
app.post("/members", validate(memberSchema, "body"), async (_req, res) => {
  try {
    const member = res.locals.validated.body;

    const results = await pool.query<Member>(
      `INSERT INTO members (name, email)
         VALUES ($1, $2)
         RETURNING *`,
      [member.name, member.email],
    );

    return res.status(201).json(results.rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// GET all loans
app.get("/loans", async (_req, res) => {
  try {
    const results = await pool.query<Loan>("SELECT * FROM loans");

    return res.status(200).json(results.rows);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// POST a loan
app.post("/loans", validate(loanSchema, "body"), async (_req, res) => {
  try {
    const loan = res.locals.validated.body;

    const results = await pool.query<Loan>(
      `INSERT INTO loans (book_id, member_id)
         VALUES ($1, $2)
         RETURNING *`,
      [loan.book_id, loan.member_id],
    );

    return res.status(201).json(results.rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// Home route
app.get("/", (_req, res) => {
  return res.json({ message: "Hello world" });
});

// Start server
app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
 */

import "dotenv/config";
import express from "express";
import pool from "./db.js";
import { env } from "./env.js";

import {
  bookSchema,
  idParamSchema,
  bookPatchSchema,
  bookQuerySchema,
  authorSchema,
  memberSchema,
  loanSchema,
} from "./schemas.js";

import type { Book, Author, Member, Loan } from "./schemas.js";

import { validate, getValidated } from "./middleware/validate.js";

const app = express();

app.use(express.json());
app.use(express.static("public"));

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }

  return "An unknown error occurred";
}

// GET all books
app.get("/books", validate(bookQuerySchema, "query"), async (_req, res) => {
  try {
    const { genre, sort, search, page, limit } = getValidated(
      res,
      bookQuerySchema,
      "query",
    );

    const conditions: string[] = [];
    const values: (string | number)[] = [];

    if (genre) {
      values.push(genre);
      conditions.push(`genre = $${values.length}`);
    }

    if (search) {
      values.push(`%${search}%`);
      conditions.push(`title ILIKE $${values.length}`);
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const offset = (page - 1) * limit;

    values.push(limit);
    const limitPlaceholder = `$${values.length}`;

    values.push(offset);
    const offsetPlaceholder = `$${values.length}`;

    const sql = `
  SELECT *
  FROM books
  ${whereClause}
  ORDER BY ${sort}
  LIMIT ${limitPlaceholder}
  OFFSET ${offsetPlaceholder}
`;

    const results = await pool.query<Book>(sql, values);

    return res.status(200).json({
      message: "Successfully got books",
      books: results.rows,
      page,
      limit,
    });
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// GET one book
app.get("/books/:id", validate(idParamSchema, "params"), async (_req, res) => {
  try {
    const { id } = getValidated(res, idParamSchema, "params");

    const results = await pool.query<Book>(
      "SELECT * FROM books WHERE id = $1",
      [id],
    );

    if (results.rows.length === 0) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json({
      message: "Successfully got book",
      book: results.rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// POST a book
app.post("/books", validate(bookSchema, "body"), async (_req, res) => {
  try {
    const book = getValidated(res, bookSchema, "body");

    const results = await pool.query<Book>(
      `INSERT INTO books (title, genre, published_year)
   VALUES ($1, $2, $3)
   RETURNING *`,
      [book.title, book.genre, book.published_year],
    );

    return res.status(201).json({
      message: "Successfully added book",
      book: results.rows[0],
    });
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// PUT a book
app.put(
  "/books/:id",
  validate(idParamSchema, "params"),
  validate(bookSchema, "body"),
  async (_req, res) => {
    try {
      const { id } = getValidated(res, idParamSchema, "params");
      const book = getValidated(res, bookSchema, "body");

      const results = await pool.query<Book>(
        `UPDATE books
     SET title = $1, genre = $2, published_year = $3
     WHERE id = $4
     RETURNING *`,
        [book.title, book.genre, book.published_year, id],
      );

      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json({
        message: "Successfully updated book",
        book: results.rows[0],
      });
    } catch (err) {
      return res.status(500).json({
        message: getErrorMessage(err),
      });
    }
  },
);

// PATCH a book
app.patch(
  "/books/:id",
  validate(idParamSchema, "params"),
  validate(bookPatchSchema, "body"),
  async (_req, res) => {
    try {
      const { id } = getValidated(res, idParamSchema, "params");
      const book = getValidated(res, bookPatchSchema, "body");

      const results = await pool.query<Book>(
        `UPDATE books
     SET title = COALESCE($1, title),
         genre = COALESCE($2, genre),
         published_year = COALESCE($3, published_year)
     WHERE id = $4
     RETURNING *`,
        [
          book.title ?? null,
          book.genre ?? null,
          book.published_year ?? null,
          id,
        ],
      );

      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json({
        message: "Successfully patched book",
        book: results.rows[0],
      });
    } catch (err) {
      return res.status(500).json({
        message: getErrorMessage(err),
      });
    }
  },
);

// DELETE a book
app.delete(
  "/books/:id",
  validate(idParamSchema, "params"),
  async (_req, res) => {
    try {
      const { id } = getValidated(res, idParamSchema, "params");

      const results = await pool.query<Book>(
        "DELETE FROM books WHERE id = $1 RETURNING *",
        [id],
      );

      if (results.rows.length === 0) {
        return res.status(404).json({ message: "Book not found" });
      }

      return res.status(200).json({
        message: "Successfully deleted book",
        book: results.rows[0],
      });
    } catch (err) {
      return res.status(500).json({
        message: getErrorMessage(err),
      });
    }
  },
);

// GET all authors
app.get("/authors", async (_req, res) => {
  try {
    const results = await pool.query<Author>("SELECT * FROM authors");

    return res.status(200).json(results.rows);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// POST an author
app.post("/authors", validate(authorSchema, "body"), async (_req, res) => {
  try {
    const author = getValidated(res, authorSchema, "body");

    const results = await pool.query<Author>(
      `INSERT INTO authors (name)
   VALUES ($1)
   RETURNING *`,
      [author.name],
    );

    return res.status(201).json(results.rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// GET all members
app.get("/members", async (_req, res) => {
  try {
    const results = await pool.query<Member>("SELECT * FROM members");

    return res.status(200).json(results.rows);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// POST a member
app.post("/members", validate(memberSchema, "body"), async (_req, res) => {
  try {
    const member = getValidated(res, memberSchema, "body");

    const results = await pool.query<Member>(
      `INSERT INTO members (name, email)
   VALUES ($1, $2)
   RETURNING *`,
      [member.name, member.email],
    );

    return res.status(201).json(results.rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// GET all loans
app.get("/loans", async (_req, res) => {
  try {
    const results = await pool.query<Loan>("SELECT * FROM loans");

    return res.status(200).json(results.rows);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// POST a loan
app.post("/loans", validate(loanSchema, "body"), async (_req, res) => {
  try {
    const loan = getValidated(res, loanSchema, "body");

    const results = await pool.query<Loan>(
      `INSERT INTO loans (book_id, member_id)
   VALUES ($1, $2)
   RETURNING *`,
      [loan.book_id, loan.member_id],
    );

    return res.status(201).json(results.rows[0]);
  } catch (err) {
    return res.status(500).json({
      message: getErrorMessage(err),
    });
  }
});

// Home route
app.get("/", (_req, res) => {
  return res.json({ message: "Hello world" });
});

// Start server
app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
