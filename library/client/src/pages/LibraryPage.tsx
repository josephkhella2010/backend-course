import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import axios from "axios";
import { z } from "zod";
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

function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  // Remember which book is being edited
  const [editingId, setEditingId] = useState<number | null>(null);

  // Edit form values
  const [editForm, setEditForm] = useState<EditFormData>({
    title: "",
    genre: "",
    published_year: "",
    author_id: "",
  });

  // Edit form validation errors
  const [editErrors, setEditErrors] = useState<FormErrors>({});

  // Add form state
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [publishedYear, setPublishedYear] = useState("");
  const [authorId, setAuthorId] = useState("");

  // Add form validation errors
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

  // Load data when the page opens
  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, []);

  // Submit the add form
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
    }
  };

  // Start editing a book
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

  // Update edit form values
  const handleEditChange = (field: keyof EditFormData, value: string) => {
    setEditForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // Save edited book
  const handleSaveEdit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId === null) {
      return;
    }

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

  // Delete a book
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3015/api/books/${id}`);

      setBooks((previousBooks) =>
        previousBooks.filter((book) => book.id !== id),
      );
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Could not delete the book. It may have an active loan.");
    }
  };

  return (
    <div>
      <h1>Library</h1>

      <h2>{books.length} books in the library</h2>

      {books.map((book) => (
        <div key={book.id}>
          {editingId === book.id ? (
            // Show edit form for this book
            <form onSubmit={handleSaveEdit}>
              <h3>Edit book</h3>

              <div>
                <label>Title:</label>
                <br />
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(event) =>
                    handleEditChange("title", event.target.value)
                  }
                />
                {editErrors.title?.map((error, index) => (
                  <p key={index} style={{ color: "red" }}>
                    {error}
                  </p>
                ))}
              </div>

              <div>
                <label>Genre:</label>
                <br />
                <input
                  type="text"
                  value={editForm.genre}
                  onChange={(event) =>
                    handleEditChange("genre", event.target.value)
                  }
                />
                {editErrors.genre?.map((error, index) => (
                  <p key={index} style={{ color: "red" }}>
                    {error}
                  </p>
                ))}
              </div>

              <div>
                <label>Published year:</label>
                <br />
                <input
                  type="number"
                  value={editForm.published_year}
                  onChange={(event) =>
                    handleEditChange("published_year", event.target.value)
                  }
                />
                {editErrors.published_year?.map((error, index) => (
                  <p key={index} style={{ color: "red" }}>
                    {error}
                  </p>
                ))}
              </div>

              <div>
                <label>Author:</label>
                <br />
                <select
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
                  <p key={index} style={{ color: "red" }}>
                    {error}
                  </p>
                ))}
              </div>

              <br />

              <button type="submit">Save</button>
              <button type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            </form>
          ) : (
            // Show normal book information
            <>
              <p>
                {book.title} by {book.Author?.name} ({book.published_year})
              </p>

              <button type="button" onClick={() => handleEdit(book)}>
                Edit
              </button>

              <button type="button" onClick={() => handleDelete(book.id)}>
                Delete
              </button>
            </>
          )}
        </div>
      ))}

      <h2>Authors</h2>

      {authors.map((author) => (
        <p key={author.id}>{author.name}</p>
      ))}

      <hr />

      <h2>Add a new book</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          {errors.title?.map((error, index) => (
            <p key={index} style={{ color: "red" }}>
              {error}
            </p>
          ))}
        </div>

        <div>
          <label>Genre:</label>
          <br />
          <input
            type="text"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
          />
          {errors.genre?.map((error, index) => (
            <p key={index} style={{ color: "red" }}>
              {error}
            </p>
          ))}
        </div>

        <div>
          <label>Published year:</label>
          <br />
          <input
            type="number"
            value={publishedYear}
            onChange={(event) => setPublishedYear(event.target.value)}
          />
          {errors.published_year?.map((error, index) => (
            <p key={index} style={{ color: "red" }}>
              {error}
            </p>
          ))}
        </div>

        <div>
          <label>Author:</label>
          <br />
          <select
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
            <p key={index} style={{ color: "red" }}>
              {error}
            </p>
          ))}
        </div>

        <br />

        <button type="submit">Add book</button>
      </form>
    </div>
  );
}

export default LibraryPage;
