const bookList = document.querySelector(".bookList");
const form = document.querySelector("form");

const titleInput = document.querySelector(".title");
const genreInput = document.querySelector(".genre");
const yearInput = document.querySelector(".year");

const submitButton = document.querySelector(".addBook");

const ApiUrl = "/books";

let editingBook = null;

// create Boook Ele fun

const createBookElement = (book) => {
  const li = document.createElement("li");

  const bookText = document.createElement("span");

  bookText.textContent = `${book.title} - ${book.genre} - ${book.published_year}`;
  const editButton = document.createElement("button");
  editButton.innerText = "Edit";
  const deleteButton = document.createElement("button");
  deleteButton.classList.add("deleteBtn");
  deleteButton.innerText = "Delete";
  li.appendChild(bookText);
  li.appendChild(editButton);
  li.appendChild(deleteButton);
  bookList.appendChild(li);

  // DELETE fun

  deleteButton.addEventListener("click", () => {
    DeleteBook(book, li);
  });

  // EDIT fun

  editButton.addEventListener("click", () => {
    editingBook = book;
    titleInput.value = book.title;
    genreInput.value = book.genre;
    yearInput.value = book.published_year;

    submitButton.innerText = "Update Book";
  });

  return {
    li,
    bookText,
  };
};

// get BOOKS fun

const getBooks = async () => {
  try {
    const response = await fetch(ApiUrl);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    data.books.forEach((book) => {
      createBookElement(book);
    });
  } catch (error) {
    console.error(error);
  }
};

// form submit fun

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (editingBook) {
    await updateBook(editingBook);
  } else {
    await addBook();
  }
});

// add BOOK fun

async function addBook() {
  try {
    const response = await fetch(ApiUrl, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: titleInput.value,
        genre: genreInput.value,
        published_year: Number(yearInput.value),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    createBookElement(data.book);

    form.reset();
  } catch (error) {
    console.error(error);
  }
}

// Delete BOOK fun

async function DeleteBook(book, li) {
  try {
    const id = book.id;

    const response = await fetch(`${ApiUrl}/${id}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    li.remove();
  } catch (error) {
    console.error(error);
  }
}

// Put Book fun

async function updateBook(book) {
  try {
    const id = book.id;

    const response = await fetch(`${ApiUrl}/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        title: titleInput.value,
        genre: genreInput.value,
        published_year: Number(yearInput.value),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    const bookItems = bookList.querySelectorAll("li");

    bookItems.forEach((li) => {
      if (
        li.firstChild &&
        li.firstChild.textContent ===
          `${book.title} - ${book.genre} - ${book.published_year}`
      ) {
        li.firstChild.textContent = `${data.book.title} - ${data.book.genre} - ${data.book.published_year}`;
      }
    });

    book.title = data.book.title;
    book.genre = data.book.genre;
    book.published_year = data.book.published_year;

    form.reset();

    editingBook = null;

    submitButton.innerText = "Add Book";
  } catch (error) {
    console.error(error);
  }
}

getBooks();
