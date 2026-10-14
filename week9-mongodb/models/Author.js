import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },

    birthYear: {
      type: Number,
      min: [0, "Birth year cannot be negative"],
      max: [new Date().getFullYear(), "Birth year cannot be in the future"],
    },
  },
  {
    timestamps: true,
  },
);

const Author = mongoose.model("Author", authorSchema);

export default Author;
