# Week 10 – TDD Answers

## Exercise 1 – Pizza Shop
Adding a new pizza type to the enum was not enough. I also had to add the pizza to the menu with its correct price. Otherwise, the application could not find the price for the new pizza.

## Exercise 2 – Error Messages
The test helped me find a spelling mistake in the error message. I changed "cutomer" to "customer". Tests are useful because they can detect small mistakes.

## Exercise 3 – Zod Schemas
`toEqual()` checks whether two objects have the same values and structure. `toBe()` checks whether two values are exactly the same reference (or primitive value).

## Exercise 4–6 – Library
I used Zod to validate book titles, books and loans. I wrote unit tests to check individual functions and integration tests to check how functions work together.

## Exercise 7 – Borrowing Limits
Basic members can borrow a maximum of 2 books, while premium members can borrow a maximum of 5 books.

`canBorrow()` checks whether a member is allowed to borrow more books. `borrowWithLimit()` checks the borrowing limit before trying to borrow a book.

If the member has reached the limit, the error is "Borrowing limit reached". If the member is allowed to borrow but the book has no copies available, the error is "No copies available".

## Exercise 8 – Returning Books
The integration test found a bug that the unit tests did not find. The `findLoan()` function returned a property called `id` instead of `loanId`.

Because of this, `markReturned()` received an invalid loan object.

Using an explicit return type (`: Loan`) helps TypeScript detect this kind of mistake earlier. The integration test also helped me find the problem because it tested the complete process.

## Exercise 9 – Borrowing Multiple Books
I created a shared `borrowLimit()` function for basic and premium memberships. I used it in `canBorrow()` and `borrowBooks()` to avoid repeating the same logic.

The tests helped verify that members cannot borrow more books than their membership allows, and that the number of requested books must be between 1 and 3.

## Test Coverage
I ran `npm run test:coverage`.

All 48 tests passed across 7 test files. The statement coverage was 92.2%, and the line coverage was 92%.

This shows that most of the code was executed during testing, but some lines still need additional tests.