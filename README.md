# cp_automation

Control Panel Automation uses Playwright framework to execute tests.

# Installing Playwright

Get started by installing Playwright using npm or yarn. Alternatively you can also get started and run your tests using the [VS Code Extension](https://playwright.dev/docs/getting-started-vscode).

NPM:

`npm init playwright@latest`

YARN:

`yarn create playwright`

Run the install command and select the following to get started:

- Choose between TypeScript or JavaScript (default is TypeScript)
- Name of your Tests folder (default is tests or e2e if you already have a tests folder in your project)
- Add a GitHub Actions workflow to easily run tests on CI

# Running the tests

### To run all tests:

`npx playwright test`

### To run the tests in headed mode:

`npx playwright test --headed`

### To run the tests in debug mode:

`npx playwright test --debug`

### To make the tests repeatable:

`npx playwright test --repeat-each X`
where X is the number of times you want to run it.

