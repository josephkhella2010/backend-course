import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    genre: {
      type: String,
      enum: {
        values: ["fantasy", "action", "drama", "romantic"],
        message: "Genre must be fantasy, action, drama, or romantic",
      },
    },

    publishedYear: {
      type: Number,
      min: [0, "Published year cannot be negative"],
      max: [new Date().getFullYear(), "Published year cannot be in the future"],
    },
    // add author to books schema
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  },
  {
    timestamps: true,
  },
);

const Book = mongoose.model("Book", bookSchema);

export default Book;
