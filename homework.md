# SQL Injection Homework — Week 9

## Exercise 1: Retrieve Hidden Data

**Lab:** SQL injection vulnerability in WHERE clause allowing retrieval of hidden data

**Status:** Solved

### 1. Payload used

```sql
' OR 1=1-- -
```

### 2. Query I think it produced

```sql
SELECT *
FROM products
WHERE category = '' OR 1=1-- -
AND released = 1;
```

### 3. Why it worked

`OR 1=1` is always true, and `--` comments out the rest of the SQL query, including the condition that hides unreleased products.

### Proof

PortSwigger displayed: "Congratulations, you solved the lab!"

#####################################################

## Exercise 2: SQL Injection Login Bypass

**Status:** Solved

### 1. Payload used

Username: `administrator'--`

Password: blank

### 2. Query I think it produced

```sql
SELECT * FROM users
WHERE username = 'administrator'--'
AND password = '';
```

### 3. Why it worked

The apostrophe closes the username string, and `--` comments out the rest of the query, removing the password check and allowing login as administrator.

### Proof

PortSwigger displayed: "Congratulations, you solved the lab!".

#####################################################

## Exercise 3: SQL Injection UNION Attack — Retrieving Data from Other Tables

**Lab URL:**  
https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-data-from-other-tables

**Request captured in Burp HTTP history:**
```http
GET /filter?category=Lifestyle HTTP/2
```

**Successful request payload:**
```sql
' UNION SELECT username, password FROM users-- -
```

**Steps completed:**
1. Opened the lab in Burp Suite's browser.
2. Clicked a product category to generate an HTTP request.
3. Found the request in Proxy → HTTP history.
4. Sent the request to Repeater.
5. Modified the `category` parameter with a `UNION SELECT` payload.
6. Clicked Send and inspected the HTTP response.
7. Retrieved usernames and passwords from the `users` table.
8. Used the administrator credentials to log in.

**What I learned:**
- `UNION SELECT` can retrieve data from another table when the column count and data types are compatible.
- Burp Repeater lets me modify requests and inspect server responses.
- Credentials returned by a SQL injection can demonstrate the impact of a database vulnerability.

**Result:** Data retrieved successfully. Confirm the lab shows **Solved** after logging in.


##############################################
## Exercise 4: SQL Injection UNION Attack — Determining the Number of Columns

**Lab URL:**  
https://portswigger.net/web-security/sql-injection/union-attacks/lab-determine-number-of-columns

**Request tested in Burp Repeater:**
```http
GET /filter?category=%27%20UNION%20SELECT%20NULL%2CNULL%2CNULL--%20- HTTP/2
```

**SQL injection payload:**
```sql
' UNION SELECT NULL,NULL,NULL-- -
```

**Steps completed:**
1. Opened the lab in Burp Suite's browser.
2. Clicked a product category to generate a request.
3. Found the request in Proxy → HTTP history.
4. Sent the request to Repeater.
5. Modified the `category` parameter with the SQL injection payload.
6. Clicked Send and inspected the HTTP response.

**What I learned:**
- A `UNION SELECT` query must return the same number of columns as the original query.
- Testing different numbers of `NULL` values helps determine the required column count.
- Three `NULL` values worked in this lab.

**Result:** Solved. The response displayed “Congratulations, you solved the lab!”


##############################################

##  Exercise 5: SQL injection UNION attack, finding a column containing text

**Status:** Solved

### Objective
Find which column in a SQL query's result can display text by using a `UNION SELECT` injection.

### Steps
1. Opened the lab and clicked the **Food & Drink** category.
2. Captured the category request in Burp Suite **HTTP history**.
3. Sent the request to **Repeater**.
4. Tested three `NULL` values to confirm the query had three columns.
5. Tested the required string, `YbV3sA`, in different column positions.
6. Found that the second column accepted text.
7. Resent the successful payload and confirmed the lab displayed **Solved**.

### Successful payload
```sql
' UNION SELECT NULL,'YbV3sA',NULL-- -
```

### Result
The response displayed `YbV3sA` in the results table, and the lab confirmed successful completion.

### What I learned
- A `UNION SELECT` attack can combine results from an injected query with the original query.
- The number of selected columns must match the original query's column count.
- The data types of corresponding columns must be compatible.
- Testing `NULL` values helps identify the column count, while testing a string identifies a column that accepts text.
- Burp Suite Repeater lets me modify and resend HTTP requests to test payloads.

##############################################
##############################################


# Exercise 6: SQL Injection UNION Attack — Retrieving Multiple Values in a Single Column

## Lab Information

- **Platform:** PortSwigger Web Security Academy
- **Lab Name:** SQL injection UNION attack, retrieving multiple values in a single column
- **Lab URL:** https://portswigger.net/web-security/sql-injection/union-attacks/lab-retrieve-multiple-values-in-single-column
- **Tool Used:** Burp Suite
- **Difficulty:** Practitioner
- **Status:** Solved

## 1. Objective

The objective of this exercise was to use a SQL injection UNION attack to retrieve multiple values from a database in a single column.

Sometimes a UNION-based SQL injection can return results only when the injected query has the correct number of columns and the values match the data types of the original query. This exercise demonstrates how to concatenate multiple values into one column.

## 2. Tools and Environment

- PortSwigger Web Security Academy lab environment
- Burp Suite Proxy
- Burp Suite Repeater
- Web browser

## 3. Step 1 — Capture the Request

1. Opened the lab URL in the browser.
2. Clicked the **Accessories** product category.
3. Opened **Burp Suite → Proxy → HTTP history**.
4. Located the request for the category filter.
5. Sent the request to **Repeater** to test SQL injection payloads.

The original request used the category filter:

```http
GET /filter?category=Accessories
```

## 4. Step 2 — Determine the Number of Columns

To determine how many columns the original SQL query returned, I tested UNION queries with different numbers of `NULL` values.

Three-column test:

```sql
' UNION SELECT NULL,NULL,NULL-- -
```

This returned an error.

Two-column test:

```sql
' UNION SELECT NULL,NULL-- -
```

This returned an HTTP 200 OK response.

**Conclusion:** The original query returned two columns.

## 5. Step 3 — Retrieve Multiple Values in One Column

I used the following SQL injection payload in Burp Repeater:

```sql
' UNION SELECT NULL,username||'~'||password FROM users-- -
```

The payload returned the username and password together in a single output column.

## 6. Step 4 — Explanation of the Payload

| Payload component | Explanation |
|---|---|
| `'` | Closes the original string value in the SQL query. |
| `UNION SELECT` | Combines the results of the original query with results from another query. |
| `NULL` | Supplies a value for the first column. |
| `username` | Retrieves the username from the users table. |
| `||'~'||` | Concatenates the username, a separator, and the password. |
| `password` | Retrieves the password value from the users table. |
| `FROM users` | Specifies the table from which to retrieve data. |
| `-- -` | Comments out the remaining portion of the original SQL query. |

The `||` operator performs string concatenation in the SQL dialect used by this lab.

## 7. Step 5 — Analyze the Response

After sending the payload, the server returned a successful response containing usernames and passwords combined into one column.

The values appeared in this format:

```text
username~password
```

For example:

```text
administrator~[retrieved password]
```

The tilde (`~`) acted as a separator, making it possible to distinguish the username from the password.

## 8. Step 6 — Complete the Lab

1. Located the administrator entry in the response.
2. Identified the password portion after the `~` separator.
3. Opened the lab's login page.
4. Entered `administrator` as the username.
5. Entered the retrieved password.
6. Clicked **Log in**.
7. Confirmed that the lab displayed **Solved**.

**Final result: Lab completed successfully.**

## 9. What I Learned

- How to use Burp Suite Repeater to test SQL injection payloads.
- How to determine the number of columns in a SQL query.
- Why the number of columns in a UNION query must match the original query.
- How to concatenate multiple database values into a single output column.
- How to interpret the results returned by a SQL injection test.
- How to use retrieved data to verify the impact of a SQL injection vulnerability in an authorized lab.

## 10. Security Recommendations

To prevent SQL injection vulnerabilities:

1. Use parameterized queries or prepared statements.
2. Avoid constructing SQL queries by directly concatenating untrusted user input.
3. Validate inputs appropriately, without relying on validation as the only defense.
4. Apply least-privilege permissions to database accounts.
5. Avoid exposing database errors or sensitive information to users.
6. Store passwords using a strong, salted password-hashing algorithm rather than plaintext.

## 11. Conclusion

In this exercise, I successfully completed a UNION-based SQL injection attack that retrieved multiple values in a single column. I determined that the original query contained two columns and used SQL string concatenation to combine usernames and passwords into one output value.

This exercise demonstrated how SQL injection can expose sensitive database information and why parameterized queries are essential for secure web application development.


##############################################
##############################################

## Exercise 7 — SQL Injection: Querying Database Type and Version on MySQL and Microsoft

**Lab URL:** https://portswigger.net/web-security/sql-injection/examining-the-database/lab-querying-database-version-mysql-microsoft

**Status:** Solved

### Objective
Use SQL injection to retrieve the database's type and version through the product category filter.

### Tools Used
- Burp Suite
- HTTP history
- Repeater
- Web browser

### Procedure
1. Opened the lab and selected a product category.
2. Used Burp Suite's HTTP history to locate the category-filter request.
3. Sent the request to Repeater.
4. Modified the `category` parameter to inject a SQL `UNION SELECT` query.
5. Used MySQL's `@@version` variable to retrieve the database version.

### Payload
```sql
' UNION SELECT @@version,NULL#
```

### Explanation
- `'` closes the original SQL string.
- `UNION SELECT` combines the original query's results with the injected query.
- `@@version` retrieves the MySQL database version.
- `NULL` supplies the second column because the original query expects two columns.
- `#` starts a MySQL comment, causing the remainder of the original query to be ignored.

### Result
The response displayed the database version:

```text
8.0.42-0ubuntu0.20.04.1
```

The lab confirmed successful completion.

### What I Learned
- Database-specific syntax can help identify the database management system.
- MySQL's `@@version` variable reveals the server version.
- `UNION SELECT` requires the same number of columns as the original query, with compatible data types.
- SQL injection can expose database metadata when user input is incorporated into SQL queries unsafely.

### Prevention
Use parameterized queries or prepared statements rather than concatenating user input into SQL statements. Restrict database permissions and avoid exposing database errors or sensitive metadata to users.


##############################################
##############################################

# Exercise 8: Blind SQL Injection with Conditional Responses

## Objective
Understand how blind SQL injection works when the application does not display database query results directly, but its response changes depending on whether an SQL condition is true or false.

## Lab
[Blind SQL injection with conditional responses](https://portswigger.net/web-security/sql-injection/blind/lab-conditional-responses)

## 1. Identify the injection point
The vulnerable parameter was the `TrackingId` cookie. By modifying this cookie with SQL conditions, I tested whether the application was vulnerable to blind SQL injection.

## 2. Test true and false conditions

**True condition:**
```sql
' AND 1=1-- -
```

Result: The response displayed `Welcome back!`.

**False condition:**
```sql
' AND 1=2-- -
```

Result: The `Welcome back!` message disappeared.

These results demonstrated that the application responded differently depending on whether the injected SQL condition was true or false.

## 3. Test for the administrator's password
I used a SQL `SUBSTRING()` condition to check individual characters of the administrator's password.

Example:
```sql
' AND (SELECT SUBSTRING(password,1,1)
FROM users
WHERE username='administrator')='a'-- -
```

The query tests whether the first character of the administrator's password is `a`.

- If `Welcome back!` appears, the condition is true.
- If the message does not appear, the condition is false.

By testing different characters and changing the position in `SUBSTRING(password,1,1)`, the password can be recovered one character at a time. Burp Suite Intruder can automate testing candidate characters.

## 4. Tools used
- Burp Suite Proxy — to capture the HTTP request.
- Burp Suite Repeater — to modify the `TrackingId` cookie and test SQL conditions.
- Burp Suite Intruder — to automate character testing.

## 5. How the vulnerability works
Blind SQL injection occurs when an application is vulnerable to SQL injection but does not directly display the results of the injected query. Instead, an attacker infers information from differences in the application's behavior, such as whether a message appears in the response.

## 6. Conclusion
I confirmed the conditional behavior by comparing true and false SQL conditions. This demonstrated how blind SQL injection can be used to infer information from a database. The administrator's password must then be recovered and used to log in to complete the lab.

**Completion status:** The lab is complete only after recovering the administrator's password, logging in as `administrator`, and seeing the lab marked **Solved**.


##############################################
##############################################

# Exercise 9: Defending Against SQL Injection

## Vulnerable Code (`vulnerable.ts`)
User input is concatenated directly into SQL, allowing an attacker to change the query.

```typescript
const result = await pool.query(
  `SELECT name, description FROM products
   WHERE category = '${req.query.category}'
   AND released = 1`,
);
```

## Secure Code (`secure.ts`)
Use Zod to validate input and `$1` to parameterize the query.

```typescript
const schema = z.object({
  category: z.enum(["Gifts", "Clothing", "Accessories"]),
});

const parsed = schema.safeParse(req.query);
if (!parsed.success) throw new Error("Invalid category");

const result = await pool.query(
  `SELECT name, description FROM products
   WHERE category = $1 AND released = 1`,
  [parsed.data.category],
);
```

## Security Explanation
- **Parameterized queries:** `$1` treats user input as data, not SQL syntax.
- **Zod validation:** Rejects categories outside the allowed list.
- **Whitelist:** Dynamic column names and `ORDER BY` choices must use predefined allowed values because SQL parameters cannot represent identifiers.

## Bonus Test
Test the Lab 1 payload:

```sql
' OR 1=1-- -
```

The secure version should reject it through Zod validation. A parameterized query also prevents the payload from being executed as SQL.

## Conclusion
Parameterized queries, input validation, and whitelisting help prevent SQL injection.