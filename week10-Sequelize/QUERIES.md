# Week 10 – Sequelize Queries

## 1. Sequelize Query: Retrieve All Books

**Sequelize code:**

```javascript
const books = await Book.findAll();
```

**Equivalent SQL:**

```sql
SELECT * FROM books;
```

This retrieves all records from the `books` table.

## 2. Sequelize Query: Retrieve Books with Authors

**Sequelize code:**

```javascript
const books = await Book.findAll({
  include: Author,
});
```

**Equivalent SQL (simplified):**

```sql
SELECT
  books.*,
  authors.id AS author_id,
  authors.name AS author_name
FROM books
LEFT JOIN authors
  ON books.author_id = authors.id;
```

Sequelize may generate different column aliases and select additional columns depending on the model configuration. The SQL above illustrates the relationship and join.

## 3. Sequelize Query: Find a Member by ID

**Sequelize code:**

```javascript
const member = await Member.findByPk(1);
```

**Equivalent SQL:**

```sql
SELECT * FROM members
WHERE id = 1
LIMIT 1;
```

This retrieves the member whose primary key is `1`.

## 4. Sequelize Query: Retrieve a Member's Books and Loan Details

**Sequelize code:**

```javascript
const member = await Member.findByPk(1, {
  include: {
    model: Book,
    through: {
      attributes: ["loan_date", "returned_at"],
    },
  },
});
```

**Equivalent SQL (simplified):**

```sql
SELECT
  members.*,
  books.*,
  loans.loan_date,
  loans.returned_at
FROM members
LEFT JOIN loans
  ON members.id = loans.member_id
LEFT JOIN books
  ON loans.book_id = books.id
WHERE members.id = 1;
```

This retrieves a member, their associated books, and the loan dates stored in the `loans` table.

## 5. Manual SQL JOIN vs. Sequelize

A manual SQL JOIN explicitly specifies how database tables are connected. Sequelize can generate the necessary JOIN statements from model associations and the `include` option.

**Manual SQL example:**

```sql
SELECT
  members.name,
  books.title,
  loans.loan_date,
  loans.returned_at
FROM members
JOIN loans
  ON members.id = loans.member_id
JOIN books
  ON loans.book_id = books.id;
```

**Comparison:**

- **Manual SQL:** Gives direct control over the query and selected columns.
- **Sequelize:** Uses JavaScript models and associations to generate queries.
- **Both:** Can retrieve related records from multiple tables.
- **Result:** Sequelize can reduce repetitive SQL code, while manual SQL is useful for complex queries and precise control.

## 6. Conclusion

Sequelize provides a convenient way to query related data using model methods and associations. Manual SQL JOINs provide an alternative that makes the relationships between tables explicit. Both approaches can retrieve books, authors, members, and loan information from the same PostgreSQL database.
