import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

//ENV=qa npx playwright test
const ENV = process.env.ENV || "qa"; // Set default environment to 'qa' if ENV variable is not set
dotenv.config({ path: `./config/.env.${ENV}` });

export default defineConfig({
  testDir: "./tests",
  timeout: 70_000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 4,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  /*reporter: "html",*/
  //Now we have the following 3 reporters configured in our project, the first one is list reporter which will show the test results in the console in a list format,
  //the second one is html reporter which will generate an html report of the test results in the my-html-report folder and it will not open the report automatically after the tests are done
  // and the third one is allure-playwright reporter which will generate an allure report of the test results in the allure-results folder and it will also include the suite title in the report.
  reporter: [
    ["list"],
    ["html", { outputFolder: "reports/my-html-report", open: "never" }],
    [
      "allure-playwright",
      {
        outputFolder: "allure-results",
        suiteTitle: true,
      },
    ],
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: process.env.BASE_URL,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "on-first-retry",
    headless: false,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },

    /*{
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },

    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    }, */

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
