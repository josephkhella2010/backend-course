### Exercise 1: SonarQube in Docker

## 1: What does `docker ps` show you? Which columns tell you that SonarQube is running, and on which port?**

The `docker ps` command shows all currently running Docker containers. The **STATUS** column shows that the SonarQube container is running. The **PORTS** column shows that port 9000 on my computer is mapped to port 9000 inside the container.

### Exercise 2: Your first scan

### 1: Did your project pass or fail the quality gate? How many issues did SonarQube find?**

My project is named `week11-sonarqube`. I ran the SonarQube analysis successfully using the JavaScript/TypeScript scanner.

SonarQube reported 1 open issue. The Security rating was B, while the Reliability and Maintainability ratings were A.

The Quality Gate status is: [Passed/Failed — check the Overview page].

# Exercise 3: Read before you fix

## Issue 1

- **Rule name:** Framework implicitly discloses version information by default.
- **File:** `server.ts`
- **Line:** 4
- **Category:** Security

**What is wrong?**

Express can disclose information about the framework through the HTTP response header `X-Powered-By`. This can help attackers identify which technology is used by the application.

**What would compliant code look like?**

```ts
const app = express();
app.disable("x-powered-by");
```

**Do I agree? Why?**

Yes, I agree. Hiding framework information makes it harder for attackers to identify the technology used by the application. It is a simple security improvement.

## Issue 2

- **Rule name:** To be completed from SonarQube.
- **File and line:** To be completed from SonarQube.

**What is wrong?**

To be completed using the "Why is this an issue?" explanation in SonarQube.

**What would compliant code look like?**

To be completed using the rule's recommended solution.

**Do I agree? Why?**

To be completed after reviewing the issue.

## Issue 3

- **Rule name:** To be completed from SonarQube.
- **File and line:** To be completed from SonarQube.

**What is wrong?**

To be completed using the "Why is this an issue?" explanation in SonarQube.

**What would compliant code look like?**

To be completed using the rule's recommended solution.

**Do I agree? Why?**

To be completed after reviewing the issue.

---

## Question 1: Explain the three groups your SonarQube uses, with an example.

**Security**

Security issues are problems that could make an application vulnerable to attacks or expose information. For example, Express revealing framework information through the `X-Powered-By` response header.

**Reliability**

Reliability issues are bugs that can cause an application to behave incorrectly or crash. For example, accessing a property of an undefined variable can cause a runtime error.

**Maintainability**

Maintainability issues make code harder to understand, change or maintain. For example, duplicated code or unnecessarily complicated functions.

## Question 2: What does SonarQube, your tests and Sentry each find?

**SonarQube**

SonarQube analyzes source code and identifies potential bugs, security vulnerabilities and maintainability problems. It can find problems without running the application.

**Tests**

Tests check whether the application behaves as expected. They can find functional problems, such as an API endpoint returning an incorrect result.

**Sentry**

Sentry monitors the application while it is running. It helps find real errors and exceptions and provides information that helps developers investigate them.

**Conclusion**

SonarQube checks code quality, tests verify application functionality, and Sentry monitors errors in a running application. Together, they help developers build more secure and reliable software.