# Exercise 1: Your first workflow


## Question: What do on, runs-on, strategy.matrix and steps do? Why did nothing happen when you only pushed the branch?

### Answer:
- on: Defines which events trigger the workflow, such as a push or pull request.
- runs-on: Specifies the operating system used to run the workflow, for example ubuntu-latest.
- strategy.matrix: Runs the same job with different configurations, such as different Node.js versions.
- steps: Lists the tasks performed by the workflow, such as installing dependencies and running tests.
Nothing happened when I first pushed because the workflow was configured to run only on the main branch, but I pushed to week12/ci. I fixed this by changing the branch filter to week12/ci.

# Exercise 2: Read the report.