import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { z } from "zod";
import { createUseStyles } from "react-jss";
import { bookFormSchema } from "../validation/schemas";

type Book = {
  id: number;
  title: string;
  genre: string;
  published_year: number;
  author_id: number;
  Author?: {
    name: string;
  };
};

type Author = {
  id: number;
  name: string;
};

type Loan = {
  id: number;
  book_id: number;
};

type FormErrors = {
  title?: string[];
  genre?: string[];
  published_year?: string[];
  author_id?: string[];
};

type EditFormData = {
  title: string;
  genre: string;
  published_year: string;
  author_id: string;
};

const useStyles = createUseStyles({
  page: {
    minHeight: "100vh",
    background: "#f1f5f9",
    fontFamily: "Arial, sans-serif",
    color: "#1e293b",
  },

  header: {
    background: "#172554",
    color: "white",
    padding: "28px 40px",
    boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
  },

  headerContent: {
    maxWidth: 1100,
    margin: "0 auto",
  },

  logo: {
    margin: 0,
    fontSize: 30,
    fontWeight: 700,
    color: "white",
  },

  subtitle: {
    color: "#bfdbfe",
    marginTop: 8,
    marginBottom: 0,
  },

  container: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "35px 24px",
  },

  sectionTitle: {
    fontSize: 24,
    marginBottom: 20,
    color: "#172554",
  },

  bookGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 20,
  },

  bookCard: {
    background: "white",
    padding: 22,
    borderRadius: 14,
    boxShadow: "0 3px 12px rgba(15,23,42,0.07)",
    border: "1px solid #e2e8f0",
  },

  bookTitle: {
    fontSize: 19,
    fontWeight: 700,
    marginTop: 0,
    marginBottom: 10,
    color: "#172554",
  },

  bookInfo: {
    color: "#64748b",
    fontSize: 14,
    margin: "7px 0",
    textTransform: "capitalize",
  },

  status: {
    display: "inline-block",
    padding: "6px 11px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 700,
    margin: "10px 0",
  },

  available: {
    background: "#dcfce7",
    color: "#166534",
  },

  borrowed: {
    background: "#fee2e2",
    color: "#991b1b",
  },

  buttonGroup: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 16,
  },

  button: {
    border: "none",
    borderRadius: 7,
    padding: "10px 13px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: 13,
    transition: "background 0.2s",
    "&:hover": {
      opacity: 0.85,
    },
  },

  editButton: {
    background: "#dbeafe",
    color: "#1d4ed8",
  },

  deleteButton: {
    background: "#fee2e2",
    color: "#b91c1c",
  },

  addLoanButton: {
    background: "#16a34a",
    color: "white",
  },

  deleteLoanButton: {
    background: "#ea580c",
    color: "white",
  },

  formCard: {
    background: "white",
    padding: 28,
    borderRadius: 14,
    boxShadow: "0 3px 12px rgba(15,23,42,0.07)",
    border: "1px solid #e2e8f0",
    marginTop: 35,
  },

  formGroup: {
    marginBottom: 18,
  },

  label: {
    display: "block",
    fontWeight: 600,
    marginBottom: 8,
    color: "#334155",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: 12,
    border: "1px solid #cbd5e1",
    borderRadius: 7,
    fontSize: 15,
    outline: "none",
    "&:focus": {
      borderColor: "#2563eb",
      boxShadow: "0 0 0 3px rgba(37,99,235,0.12)",
    },
  },

  primaryButton: {
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: 7,
    padding: "12px 20px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    "&:hover": {
      background: "#1d4ed8",
    },
  },

  secondaryButton: {
    background: "#e2e8f0",
    color: "#334155",
    border: "none",
    borderRadius: 7,
    padding: "12px 20px",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },

  error: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 5,
  },

  authorList: {
    display: "flex",
    flexWrap: "wrap",
    gap: 10,
  },

  authorItem: {
    background: "white",
    border: "1px solid #e2e8f0",
    borderRadius: 8,
    padding: "10px 16px",
    color: "#475569",
  },

  count: {
    color: "#64748b",
    marginBottom: 20,
  },

  empty: {
    background: "white",
    borderRadius: 12,
    padding: 25,
    color: "#64748b",
    textAlign: "center",
  },
});

function LibraryPage() {
  const classes = useStyles();

  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editForm, setEditForm] = useState<EditFormData>({
    title: "",
    genre: "",
    published_year: "",
    author_id: "",
  });

  const [editErrors, setEditErrors] = useState<FormErrors>({});

  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [authorId, setAuthorId] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});

  // Fetch books
  const fetchBooks = async () => {
    const response = await axios.get("http://localhost:3015/api/books");
    setBooks(response.data);
  };

  // Fetch authors
  const fetchAuthors = async () => {
    const response = await axios.get("http://localhost:3015/api/authors");
    setAuthors(response.data);
  };

  // Fetch loans
  const fetchLoans = async () => {
    const response = await axios.get("http://localhost:3015/api/loans");
    setLoans(response.data);
  };

  // Load data when page opens
  useEffect(() => {
    fetchBooks();
    fetchAuthors();
    fetchLoans();
  }, []);

  // Add book
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = bookFormSchema.safeParse({
      title,
      genre,
      published_year: publishedYear,
      author_id: authorId,
    });

    if (!result.success) {
      setErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    try {
      await axios.post("http://localhost:3015/api/books", result.data);
      await fetchBooks();

      setTitle("");
      setGenre("");
      setPublishedYear("");
      setAuthorId("");
      setErrors({});
    } catch (error) {
      console.error("Error adding book:", error);
      alert("Could not add the book.");
    }
  };

  // Start editing
  const handleEdit = (book: Book) => {
    setEditingId(book.id);

    setEditForm({
      title: book.title,
      genre: book.genre,
      published_year: String(book.published_year),
      author_id: String(book.author_id),
    });

    setEditErrors({});
  };

  // Change edit form
  const handleEditChange = (field: keyof EditFormData, value: string) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Save edited book
  const handleSaveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId === null) return;

    const result = bookFormSchema.safeParse(editForm);

    if (!result.success) {
      setEditErrors(z.flattenError(result.error).fieldErrors);
      return;
    }

    try {
      await axios.put(
        `http://localhost:3015/api/books/${editingId}`,
        result.data,
      );

      await fetchBooks();

      setEditingId(null);
      setEditErrors({});
    } catch (error) {
      console.error("Error updating book:", error);
      alert("Could not update the book.");
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditErrors({});
  };

  // Delete book
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3015/api/books/${id}`);
      await fetchBooks();
      await fetchLoans();
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Could not delete the book. It may have an active loan.");
    }
  };

  // Add loan
  const handleAddLoan = async (bookId: number) => {
    try {
      await axios.post("http://localhost:3015/api/loans", {
        book_id: bookId,
      });

      await fetchLoans();
      alert("Loan created successfully!");
    } catch (error) {
      console.error("Error creating loan:", error);
      alert("Could not create the loan.");
    }
  };

  // Delete loan
  const handleDeleteLoan = async (loanId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this loan?",
    );

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:3015/api/loans/${loanId}`);
      await fetchLoans();
      alert("Loan deleted successfully!");
    } catch (error) {
      console.error("Error deleting loan:", error);
      alert("Could not delete the loan.");
    }
  };

  return (
    <div className={classes.page}>
      <header className={classes.header}>
        <div className={classes.headerContent}>
          <h1 className={classes.logo}>📚 My Library</h1>
          <p className={classes.subtitle}>
            Manage your books, authors and loans
          </p>
        </div>
      </header>

      <main className={classes.container}>
        <h2 className={classes.sectionTitle}>Library collection</h2>

        <p className={classes.count}>
          {books.length} books · {authors.length} authors · {loans.length} loans
        </p>

        {books.length === 0 ? (
          <div className={classes.empty}>No books in the library yet.</div>
        ) : (
          <div className={classes.bookGrid}>
            {books.map((book) => {
              const bookLoan = loans.find((loan) => loan.book_id === book.id);

              return (
                <div className={classes.bookCard} key={book.id}>
                  {editingId === book.id ? (
                    <form onSubmit={handleSaveEdit}>
                      <h3>Edit book</h3>

                      <div className={classes.formGroup}>
                        <label className={classes.label}>Title</label>
                        <input
                          className={classes.input}
                          type="text"
                          value={editForm.title}
                          onChange={(event) =>
                            handleEditChange("title", event.target.value)
                          }
                        />
                        {editErrors.title?.map((error, index) => (
                          <p className={classes.error} key={index}>
                            {error}
                          </p>
                        ))}
                      </div>

                      <div className={classes.formGroup}>
                        <label className={classes.label}>Genre</label>
                        <input
                          className={classes.input}
                          type="text"
                          value={editForm.genre}
                          onChange={(event) =>
                            handleEditChange("genre", event.target.value)
                          }
                        />
                        {editErrors.genre?.map((error, index) => (
                          <p className={classes.error} key={index}>
                            {error}
                          </p>
                        ))}
                      </div>

                      <div className={classes.formGroup}>
                        <label className={classes.label}>Published year</label>
                        <input
                          className={classes.input}
                          type="number"
                          value={editForm.published_year}
                          onChange={(event) =>
                            handleEditChange(
                              "published_year",
                              event.target.value,
                            )
                          }
                        />
                        {editErrors.published_year?.map((error, index) => (
                          <p className={classes.error} key={index}>
                            {error}
                          </p>
                        ))}
                      </div>

                      <div className={classes.formGroup}>
                        <label className={classes.label}>Author</label>
                        <select
                          className={classes.input}
                          value={editForm.author_id}
                          onChange={(event) =>
                            handleEditChange("author_id", event.target.value)
                          }
                        >
                          <option value="">Choose an author</option>
                          {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                              {author.name}
                            </option>
                          ))}
                        </select>
                        {editErrors.author_id?.map((error, index) => (
                          <p className={classes.error} key={index}>
                            {error}
                          </p>
                        ))}
                      </div>

                      <div className={classes.buttonGroup}>
                        <button className={classes.primaryButton} type="submit">
                          Save
                        </button>
                        <button
                          className={classes.secondaryButton}
                          type="button"
                          onClick={handleCancelEdit}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <h3 className={classes.bookTitle}>{book.title}</h3>

                      <p className={classes.bookInfo}>
                        ✍️ {book.Author?.name || "Unknown author"}
                      </p>

                      <p className={classes.bookInfo}>📖 {book.genre}</p>

                      <p className={classes.bookInfo}>
                        📅 Published: {book.published_year}
                      </p>

                      <span
                        className={`${classes.status} ${
                          bookLoan ? classes.borrowed : classes.available
                        }`}
                      >
                        {bookLoan ? "Borrowed" : "Available"}
                      </span>

                      <div className={classes.buttonGroup}>
                        <button
                          className={`${classes.button} ${classes.editButton}`}
                          type="button"
                          onClick={() => handleEdit(book)}
                        >
                          Edit
                        </button>

                        <button
                          className={`${classes.button} ${classes.deleteButton}`}
                          type="button"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete book
                        </button>

                        {bookLoan ? (
                          <button
                            className={`${classes.button} ${classes.deleteLoanButton}`}
                            type="button"
                            onClick={() => handleDeleteLoan(bookLoan.id)}
                          >
                            Delete loan
                          </button>
                        ) : (
                          <button
                            className={`${classes.button} ${classes.addLoanButton}`}
                            type="button"
                            onClick={() => handleAddLoan(book.id)}
                          >
                            + Add loan
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <section className={classes.formCard}>
          <h2 className={classes.sectionTitle}>Add a new book</h2>

          <form onSubmit={handleSubmit}>
            <div className={classes.formGroup}>
              <label className={classes.label}>Title</label>
              <input
                className={classes.input}
                type="text"
                placeholder="Enter book title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
              {errors.title?.map((error, index) => (
                <p className={classes.error} key={index}>
                  {error}
                </p>
              ))}
            </div>

            <div className={classes.formGroup}>
              <label className={classes.label}>Genre</label>
              <input
                className={classes.input}
                type="text"
                placeholder="Enter book genre"
                value={genre}
                onChange={(event) => setGenre(event.target.value)}
              />
              {errors.genre?.map((error, index) => (
                <p className={classes.error} key={index}>
                  {error}
                </p>
              ))}
            </div>

            <div className={classes.formGroup}>
              <label className={classes.label}>Published year</label>
              <input
                className={classes.input}
                type="number"
                placeholder="Enter publication year"
                value={publishedYear}
                onChange={(event) => setPublishedYear(event.target.value)}
              />
              {errors.published_year?.map((error, index) => (
                <p className={classes.error} key={index}>
                  {error}
                </p>
              ))}
            </div>

            <div className={classes.formGroup}>
              <label className={classes.label}>Author</label>
              <select
                className={classes.input}
                value={authorId}
                onChange={(event) => setAuthorId(event.target.value)}
              >
                <option value="">Choose an author</option>
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </select>
              {errors.author_id?.map((error, index) => (
                <p className={classes.error} key={index}>
                  {error}
                </p>
              ))}
            </div>

            <button className={classes.primaryButton} type="submit">
              + Add book
            </button>
          </form>
        </section>

        <section className={classes.formCard}>
          <h2 className={classes.sectionTitle}>Our authors</h2>

          <div className={classes.authorList}>
            {authors.map((author) => (
              <div className={classes.authorItem} key={author.id}>
                ✍️ {author.name}
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default LibraryPage;
