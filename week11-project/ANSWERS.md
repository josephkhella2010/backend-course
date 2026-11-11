# Exercise 1: Install the Alarm System

## Question 1: Why must `instrument.js` be imported before everything else?

**Answer:**

`instrument.js` must be imported first so that Sentry is initialised before the rest of the application loads. This allows Sentry to monitor the application from the beginning and capture errors properly.

## Question 2: Why do we keep the DSN in `.env` instead of in the code?

**Answer:**

We keep the DSN in `.env` to separate configuration from source code. This makes it easier to use different settings for development and production and prevents the configuration from being exposed in the source code shared through Git.

# Exercise 2: Your First Error Report

### Question: You didn't add any extra information to this error yourself. List everything Sentry recorded anyway.

**Answer:**

Sentry automatically collected the following information:

1. **Error message:** My first Sentry error!
2. **Error level:** Error.
3. **Handled:** No.
4. **Transaction:** GET /debug-sentry.
5. **URL:** http://localhost:3003/debug-sentry.
6. **Node.js version:** v22.16.0.
7. **Operating system:** Windows 10.0.26300.
8. **Environment:** Production.
9. **Browser:** Chrome 157.
10. **Architecture:** x64.
11. **Timezone:** Europe/Stockholm.
12. **Locale:** en-US.
13. **Server name:** DESKTOP-RN2LVO1.
14. **Trace ID:** 3e75dbc14e154be68f04caafdb51fb53.
15. **Stack trace:** The file name and line number where the error occurred.
16. **Additional system information:** Memory usage, available memory, CPU description, processor count and boot time.

Sentry collected this information automatically without me having to add it manually.

### Exercise 3 – Middleware Order

### Question: What happened when the handler was above the routes, and why? (Think about the order in which Express runs middleware.)

When I moved `Sentry.setupExpressErrorHandler(app)` above my route, Sentry still received the error. My Sentry dashboard showed 2 events.

This demonstrates that my current Sentry setup was still capturing the exception, even with the error handler above the route. Express processes middleware in registration order, and Sentry's Express error handler should normally be placed after the routes so it can handle errors passed through Express's error-handling chain.

I moved the Sentry error handler back below my routes to restore the recommended order.

### Exercise 4 – Catch the errors you already catch

### 1. Why didn't the errors inside your try/catch reach themselves?

The errors inside try/catch did not automatically reach Sentry because the catch block handled them locally. Express's global error handler could not catch them either. We needed to call Sentry.captureException(error) inside the catch block to send the errors to Sentry.

### 2. Several requests failed for the same reason. Did Sentry show them as separate issues, or group them? Why is that useful?

Sentry grouped the errors into one issue because they had the same underlying cause. Each failed request appeared as a separate event within that issue.

This is useful because it prevents duplicate issues, reduces clutter, and helps developers identify and fix the root cause more easily



### Exercise 5: Breadcrumbs and tags

## Question: Explain the difference between a breadcrumb and a tag in your own words. Give one example of when each one would help your team.

### A breadcrumb:

is a note that shows what was happening in the application before an error occurred. It helps the team understand the steps that led to the problem.

Example: If a user tries to delete an item and an error occurs, the breadcrumb "Delete item route" helps the team understand which action was being performed.

### A tag:

is a label that helps organize and filter errors in Sentry. It makes it easier for the team to find errors related to a specific feature.

Example: The tag feature:items helps the team find all errors related to the items feature.

### The main difference:

Breadcrumbs show what happened before an error, while tags help categorize and search for errors.

### Exercise 6: One helper instead of copy-paste

### question: You now send each error to Sentry. What does each tool give you that the other doesn't?
Sentry provides error monitoring, stack traces, breadcrumbs, tags, and error history. The reportError helper provides reusable, centralized error-reporting code, so we don't have to repeat the same code in every route.

Together, they make error handling easier to manage and help developers find and fix problems faster.

### Exercise 7: Not every error belongs in Sentry

## 1. Why is it a problem if Sentry fills up with errors that aren't bugs? Think about what happens when you get 200 alert emails a day.

If Sentry fills up with errors that aren't real bugs, developers may receive too many alerts and become overwhelmed. This can cause alert fatigue, making them ignore or miss important alerts about serious problems. It also wastes time investigating errors that don't need fixing.


## 2. Name one other kind of error that shouldn't go to Sentry, and one that always should.

- Should NOT go to Sentry: A user entering an incorrect password when trying to log in. This is an expected user mistake, not a bug.
- Should go to Sentry: An unexpected database connection failure. This is a serious technical problem that developers need to investigate.

### Exercise 8: Development or production?

## 1. Why would a team want to see development and production errors separately?

A team would want to see development and production errors separately so they can distinguish errors found during testing from errors that affect real users. This helps developers focus on serious production problems, fix them faster, and avoid confusion from test errors.

## 2. What could go wrong if /debug-sentry were left open in production?

If /debug-sentry were left open in production, anyone could trigger errors intentionally. This could create unnecessary Sentry alerts, make it harder to identify real problems, and potentially expose sensitive technical information about the application.

## Exercise 9: Be the detective

### Incident Report

### 1. What happened

A user requested an item with an ID that did not exist, for example `/items/999999`. The application tried to access the item's name even though the item was null. The user received a 500 Internal Server Error.

### 2. How Sentry helped

Sentry showed the error message: `Cannot read properties of null (reading 'get')`. The stack trace pointed to the line where the application tried to call `item.get("name")`. The breadcrumb `Fetch item by ID route` showed which route was being executed. The transaction `GET /items/999999` identified the ID that caused the error.

### 3. The fix

I added a Zod validation check using `z.number().int().positive()` to make sure the ID is a positive whole number. I also added a check to return 404 with the message `Item not found` when an item does not exist. Invalid IDs such as `abc` now return 400. These expected errors are not sent to Sentry.

### 4. Prevention

We could have caught this bug earlier by using TypeScript to identify that the item might be null. We could also use Zod validation, check that an item exists before accessing its properties, and test different cases, including valid IDs, missing IDs, and invalid IDs. These practices help prevent runtime errors before they reach Sentry.
