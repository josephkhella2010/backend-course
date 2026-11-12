### Exercise 1: SonarQube in Docker

## 1: What does `docker ps` show you? Which columns tell you that SonarQube is running, and on which port?**

The `docker ps` command shows all currently running Docker containers. The **STATUS** column shows that the SonarQube container is running. The **PORTS** column shows that port 9000 on my computer is mapped to port 9000 inside the container.

### Exercise 2: Your first scan

### 1: Did your project pass or fail the quality gate? How many issues did SonarQube find?**

My project is named `week11-sonarqube`. I ran the SonarQube analysis successfully using the JavaScript/TypeScript scanner.

SonarQube reported 1 open issue. The Security rating was B, while the Reliability and Maintainability ratings were A.

The Quality Gate status is: [Passed/Failed — check the Overview page].

# Exercise 3: Read before you fix

Issue 1: Web application technologies should not disclose version information

Rule name: typescript:S5689 – Web application technologies should not disclose version information.

File: server.ts

Line: 4 – const app = express();

What is wrong?

The Express application can disclose information about the technology it uses through the X-Powered-By HTTP response header. This header can reveal that the application uses Express. Giving away technology information can help attackers identify the framework and search for known vulnerabilities that might affect it.

What would compliant code look like?

const app = express();
app.disable("x-powered-by");

This disables the X-Powered-By header so that Express does not reveal this information in its responses.

Do I agree that this is a problem? Why?

Yes, I agree. An application should not reveal unnecessary technical information to users or potential attackers. Disabling this header is a simple security improvement. It does not prevent every attack, but it reduces information disclosure.

Issue 2: Array sorting should use a compare function

Rule name: "Array.prototype.sort()" and "Array.prototype.toSorted()" should use a compare function

File: server.ts

Line: The line containing numbers.sort() in the /numbers/sorted route.

What is wrong?

JavaScript's sort() method sorts values as strings by default when no compare function is provided. This can produce an incorrect result when sorting numbers. For example, the number 100 can be placed before 30 because JavaScript compares their text representations rather than their numerical values.

What would compliant code look like?

const numbers = [30, 5, 100, 2];
const sortedNumbers = numbers.sort((a, b) => a - b);

The compare function (a, b) => a - b tells JavaScript to sort the numbers in ascending numerical order.

Do I agree that this is a problem? Why?

Yes, I agree. Without a compare function, the result may not be in the numerical order that a developer expects. Using a compare function makes the intended behavior clear and prevents incorrect sorting.

Issue 3: Array.reduce() calls should include an initial value

Rule name: "Array.reduce()" calls should include an initial value

File: server.ts

Line: The line containing numbers.reduce() in the /numbers/total route.

What is wrong?

The reduce() method combines array elements into one result. If no initial value is provided, JavaScript uses the first array element as the starting value. This can cause an error if the array is empty and can make the calculation less predictable. Providing an initial value makes the starting point clear.

What would compliant code look like?

const numbers = [10, 20, 30];
const total = numbers.reduce(
  (sum, number) => sum + number,
  0
);

The value 0 is the initial value. The calculation starts at zero and adds each number to the total.

Do I agree that this is a problem? Why?

Yes, I agree. Providing an initial value makes the code safer, especially when the array might be empty. It also makes the intention of the calculation easier to understand.

Question 4 – Security, Reliability, and Maintainability

My SonarQube version groups issues by the quality they affect: Security, Reliability, and Maintainability.

1. Security

Security issues are problems that could make an application vulnerable to attacks or expose sensitive information.

Example from my project: Express can reveal information about the framework through the X-Powered-By response header. I fixed this by adding:

app.disable("x-powered-by");

2. Reliability

Reliability issues are problems that could cause bugs, incorrect results, or unexpected application behavior.

Example from my project: Using JavaScript's sort() without a compare function can sort numbers incorrectly. I fixed this by using:

numbers.sort((a, b) => a - b);

3. Maintainability

Maintainability issues make code harder to read, understand, change, or maintain in the future.

Example: Duplicated code makes a project harder to update because the same change may need to be made in several places. Creating reusable functions reduces duplication and makes the code easier to maintain.

Question 5 – SonarQube vs. Automated Tests vs. Sentry

SonarQube, automated tests, and Sentry all help developers find problems, but they find different kinds of problems.

1. SonarQube

SonarQube analyzes the source code and finds potential bugs, security weaknesses, and maintainability problems. It can detect suspicious code patterns without running the application.

What it finds that the others might not: Code-quality problems and certain security or reliability issues that are visible by inspecting the source code, even if no test currently exercises that code.

2. Automated Tests

Automated tests run parts of the application and check whether they behave as expected. They can find functional errors, such as an API returning the wrong result or a calculation producing an incorrect answer.

What they find that the others might not: Whether specific application features actually work correctly for the test inputs and expected results. SonarQube cannot prove that the application produces the correct output, and Sentry only reports errors that occur while the application is running and monitored.

3. Sentry

Sentry monitors an application while it is running. It collects real errors and exceptions, especially those that happen in production, and provides information that helps developers investigate them.

What it finds that the others might not: Errors that happen in real user environments, such as unexpected input, production configuration problems, or failures that were not covered by automated tests.

Conclusion

SonarQube checks the quality and structure of the source code, automated tests check whether the application behaves correctly, and Sentry monitors the running application and helps developers investigate real errors. They complement each other because no single tool can find every type of problem.