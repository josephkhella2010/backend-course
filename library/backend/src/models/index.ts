import { Author } from "./Author.js";
import { Book } from "./Book.js";

Author.hasMany(Book, {
  foreignKey: "author_id",
});

Book.belongsTo(Author, {
  foreignKey: "author_id",
});
