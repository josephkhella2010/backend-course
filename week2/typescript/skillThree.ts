///Book Interface

interface BookType {
  title: string;
  author: string;
  pages: number;
}

const book: BookType = {
  title: "Harry Potter",
  author: "King",
  pages: 320,
};
console.log("Title", book.title);

/// Nested & Optional Properties

interface AddressType {
  city: string;
  postalCode?: string;
}

interface PersonType {
  name: string;
  age: number;
  address: AddressType;
}

const personOne: PersonType = {
  name: "John",
  age: 30,
  address: {
    city: "sweden",
  },
};
const personTwo: PersonType = {
  name: "John",
  age: 30,
  address: {
    city: "Italy",
    postalCode: "176545",
  },
};

console.log("city", personOne.address.city, personTwo.address.city);

///// Challenge (optional) Interface with a Typed Function

interface MovieType {
  id: number;
  title: string;
  rating: number;
  genres: string[];
}

const movies: MovieType[] = [
  {
    id: 1,
    title: "Inception",
    rating: 8.8,
    genres: ["Sci-Fi", "Thriller"],
  },
  {
    id: 2,
    title: "The Dark Knight",
    rating: 9.0,
    genres: ["Action", "Crime", "Drama"],
  },
  {
    id: 3,
    title: "Interstellar",
    rating: 8.7,
    genres: ["Sci-Fi", "Adventure"],
  },
  {
    id: 4,
    title: "The Lion King",
    rating: 8.5,
    genres: ["Animation", "Adventure", "Drama"],
  },
];

const getMoviesByGenre = (movies: MovieType[], genre: string): MovieType[] => {
  const filteredMovies = movies.filter((film) =>
    film.genres.some(
      (genreName) => genreName.toLowerCase() === genre.toLowerCase(),
    ),
  );
  return filteredMovies;
};

console.log("getMoviesByGenre", getMoviesByGenre(movies, "SCI-Fi"));

const getMoviesByGenreTwo = (
  movies: MovieType[],
  genre: string,
): MovieType[] => {
  const moviesWithLowercaseGenres = movies
    .map((film) => {
      const genresToLowerCase = film.genres.map((type) => type.toLowerCase());

      return {
        ...film,
        genres: genresToLowerCase,
      };
    })
    .filter((it) => it.genres.includes(genre.toLowerCase()));

  return moviesWithLowercaseGenres;
};

console.log("getMoviesByGenreTwo", getMoviesByGenreTwo(movies, "SCI-Fi"));
