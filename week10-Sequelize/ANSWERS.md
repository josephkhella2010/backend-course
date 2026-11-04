# Week 10 – Sequelize Answers

## Skill 1: Understanding the Database

### 1. What is Sequelize?

Sequelize is an Object-Relational Mapping (ORM) library for Node.js. It allows developers to interact with relational databases using JavaScript instead of writing SQL queries for every operation.

### 2. What is an ORM?

An ORM (Object-Relational Mapper) connects objects in application code to tables in a relational database. It allows developers to create, read, update, and delete database records using models and methods.

### 3. What is a Sequelize model?

A Sequelize model represents a database table. It defines the table's columns, data types, constraints, and other settings.

### 4. What is the purpose of `sequelize.authenticate()`?

`sequelize.authenticate()` checks whether Sequelize can successfully connect to the database. It is useful for verifying the database connection when the application starts.

### 5. What is the purpose of `sequelize.sync()`?

`sequelize.sync()` synchronizes registered Sequelize models with the database tables. It can create tables that do not exist. It does not automatically guarantee that every existing table will be migrated to match all model changes.

### 6. What is the difference between `findAll()`, `findByPk()`, and `create()`?

- `findAll()` retrieves records matching the query.
- `findByPk()` retrieves a record by its primary key.
- `create()` inserts a new record into the database.

## Skill 2: Connecting Sequelize

### 7. Why use Sequelize instead of writing SQL queries directly?

Sequelize provides model-based database operations, helps manage relationships between tables, supports validation, and reduces the amount of repetitive SQL code required in an application.

### 8. Why should database credentials be stored in environment variables?

Environment variables keep database credentials and configuration separate from application source code. This makes configuration easier across different environments and reduces the risk of accidentally committing credentials to version control.

## Skill 3: CRUD Operations

### 9. What does CRUD stand for?

CRUD stands for Create, Read, Update, and Delete.

- **Create:** Insert a new record.
- **Read:** Retrieve existing records.
- **Update:** Modify an existing record.
- **Delete:** Remove a record.

### 10. How are CRUD operations implemented using Sequelize?

Sequelize provides methods such as `create()`, `findAll()`, `findByPk()`, `update()`, and `destroy()` to perform CRUD operations on database models.

### 11. Why should an API return appropriate HTTP status codes?

HTTP status codes communicate the outcome of a request. For example, `200 OK` indicates success, `201 Created` indicates that a resource was created, `404 Not Found` means the requested resource could not be found, and `500 Internal Server Error` indicates an unexpected server-side error.

## Skill 4: Model Relationships

### 12. What is a one-to-many relationship?

A one-to-many relationship means one record in a table can be associated with multiple records in another table. In this project, one author can have many books. The `author_id` foreign key in the `books` table identifies each book's author.

The Sequelize association is:

```javascript
Author.hasMany(Book, { foreignKey: "author_id" });
Book.belongsTo(Author, { foreignKey: "author_id" });
```

### 13. What is a many-to-many relationship?

A many-to-many relationship means one record can be associated with multiple records in another table, and vice versa. In this project, a member can borrow many books, and a book can be borrowed by different members.

The `Loan` table acts as the junction table connecting members and books.

```javascript
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
```

### 14. Why is a junction table needed for the Member–Book relationship?

A junction table represents the relationship between members and books. The `Loan` table stores `member_id` and `book_id`, identifying who borrowed which book. It can also store information about the borrowing event, such as the loan date and return date.

### 15. Why is `loan_date` better stored in the `Loan` table instead of the `Member` or `Book` table?

The `loan_date` belongs in the `Loan` table because it describes a specific borrowing event. A member can borrow many books, and a book can be borrowed by different members at different times. Storing the date in `Loan` keeps each borrowing record and its date together.

### 16. What is the purpose of `returned_at`?

The `returned_at` column records when a book is returned. It can be `NULL` while the book has not yet been returned. This allows the application to distinguish active loans from completed loans.

### 17. What is a foreign key, and why is it important?

A foreign key is a column that references a key in another table. It helps maintain referential integrity by preventing records from referring to parent records that do not exist. For example, a loan's `member_id` must refer to an existing member.

### 18. What is eager loading in Sequelize?

Eager loading retrieves related records together with the main record by using the `include` option. For example:

```javascript
const books = await Book.findAll({
  include: Author,
});
```

This retrieves books together with their associated authors, rather than requiring a separate query for each author.

## Summary

This project uses Sequelize to connect a Node.js application to PostgreSQL, define models, perform CRUD operations, and represent relationships between authors, books, members, and loans. The `Loan` model links members and books and stores borrowing details such as `loan_date` and `returned_at`.
