import sequelize from "./sequelize.js";
import Book from "./models/Book.js";
import Author from "./models/Author.js";
import Member from "./models/Member.js";
import Loan from "./models/Loan.js";

Author.hasMany(Book, { foreignKey: "author_id" });
Book.belongsTo(Author, { foreignKey: "author_id" });

Member.belongsToMany(Book, {
  through: Loan,
  foreignKey: "member_id",
  otherKey: "book_id",
});

Book.belongsToMany(Member, {
  through: Loan,
  foreignKey: "book_id",
  otherKey: "member_id",
});

Member.hasMany(Loan, { foreignKey: "member_id" });
Loan.belongsTo(Member, { foreignKey: "member_id" });

Book.hasMany(Loan, { foreignKey: "book_id" });
Loan.belongsTo(Book, { foreignKey: "book_id" });

async function ConnectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connection established successfully");

    await sequelize.sync();
    console.log("Database tables synchronized successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
}

export default ConnectDB;
