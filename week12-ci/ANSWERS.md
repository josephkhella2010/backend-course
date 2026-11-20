# Exercise 1: Your first workflow

## Question: What do on, runs-on, strategy.matrix and steps do? Why did nothing happen when you only pushed the branch?

### Answer:

- on: Defines which events trigger the workflow, such as a push or pull request.
- runs-on: Specifies the operating system used to run the workflow, for example ubuntu-latest.
- strategy.matrix: Runs the same job with different configurations, such as different Node.js versions.
- steps: Lists the tasks performed by the workflow, such as installing dependencies and running tests.
  Nothing happened when I first pushed because the workflow was configured to run only on the main branch, but I pushed to week12/ci. I fixed this by changing the branch filter to week12/ci.

# Exercise 2: Read the report.

## Question: Why can a test pass on your laptop but fail in CI? Think of why the video's first run failed.

- Answer: A test can pass on my laptop but fail in CI because the environments may be different. My laptop might have dependencies or files that are missing in CI, or the Node.js versions may be different. CI starts with a clean environment, so it can reveal problems that were not visible on my laptop.

# Exercise 3: Red on purpose

## Question: Why is a red cross on the pull request better than one after merging?

- Answer: It is better because CI detects errors before the code is merged into the main branch. This allows developers to fix problems early and prevents broken code from affecting the project.

Take a screenshot of the successful Actions run for your assignment. Is the newest run green?

# Exercise 4: Check types in CI

## Question: Would this step have caught the possibly null bug from Week 11, Exercise 9?

- Answer: Yes, if TypeScript's strict null checking is enabled. The typecheck step can detect when a value might be null or undefined before the code runs. This helps catch errors early.

# Exercise 5: Pick your Node versions

## Question: What's the difference between npm ci and npm install, and why does CI use npm ci?

- Answer: npm install installs dependencies and can update package-lock.json when necessary. npm ci installs the exact dependency versions recorded in the lockfile without changing it. CI uses npm ci because it provides clean, consistent and reproducible installations.

# Exercise 6: Protect week12/ci

## Question: What does branch protection do that CI alone can't?

- Answer: CI automatically runs tests and checks the code to see if there are errors. Branch protection adds rules that prevent changes from being merged into a protected branch unless certain conditions are met, such as opening a pull request and passing all required CI checks.

# Exercise 7: Fix the broken workflow.

### Question: Which bug was the most dangerous, and why?

- Answer: The most dangerous bug was the wrong branch filter (master instead of week12/ci). This could prevent the workflow from running on pull requests targeting week12/ci. As a result, code could be merged without being tested by this workflow, giving a false sense of security.
