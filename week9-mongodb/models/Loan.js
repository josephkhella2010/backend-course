import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: [true, "Book is required"],
    },

    borrower: {
      type: String,
      required: [true, "Borrower name is required"],
      trim: true,
    },

    loanDate: {
      type: Date,
      default: Date.now,
    },

    returnDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
