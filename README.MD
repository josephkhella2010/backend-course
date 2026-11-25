# End-to-End Tests for Three Sundsgården APIs

## Project Description

This project contains end-to-end tests for three Sundsgården APIs:

- **Menu API** – Reading, filtering and adding dishes.
- **Table Bookings API** – Creating, updating and cancelling table bookings.
- **Staff Shifts API** – Authentication, permissions and shift management.

The tests use Jest and Supertest.

## Installation

Install the project dependencies:

```bash
npm install
```

## Run the Tests

Run all tests with:

```bash
npm test
```

All tests should pass before submission.

## Test Files

The project contains three test files:

- `tests/menu.test.ts`
- `tests/bookings.test.ts`
- `tests/shifts.test.ts`

Each test creates a fresh application and checks both successful and unsuccessful requests.

## H3 – Bug Hunt

The H3 task requires testing the Staff Shifts API against the assignment specification, identifying bugs, fixing them and explaining the fixes.

The following two behaviours were implemented and tested against the assignment requirements:

### Bug 1 – Incorrect Pagination Total

**Expected behaviour:** The pagination response must report the number of shifts matching the selected status filter, not the total number of shifts in the database.

**Fix:** Calculate `total` after applying the status filter and before applying pagination.

### Bug 2 – Invalid Shift Times

**Expected behaviour:** A shift's end time must be later than its start time. Equal times and an end time before the start time must be rejected.

**Fix:** Validate the start and end times when creating a shift and return HTTP 400 when the end time is not later than the start time.

**Note:** The original starter implementation was unavailable during development. These behaviours were implemented and tested against the assignment specification, but the two examples above have not been verified as bugs in the original starter code.

## Technologies Used

- TypeScript
- Node.js
- Express
- Jest
- Supertest
- Zod

## Conclusion

The purpose of this project is to verify API behaviour using end-to-end tests, including successful requests, validation errors, authentication, permissions and business rules.

The current test run passes all 98 tests across the three test suites.
