# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: loginpagefixture.spec.ts >> ForgetPassword link exist test
- Location: tests/loginpagefixture.spec.ts:21:1

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { test, expect } from "../src/fixtures/pagefixtures";
  2  | import { CsvHelper } from "../src/utils/CsvHelper";
  3  | import { ExcelHelper } from "../src/utils/ExcelHelper";
  4  | import { JsonHelper } from "../src/utils/JsonHelper";
  5  | 
  6  | test.setTimeout(70_000);
  7  | 
  8  | test.beforeEach(async ({ loginPage }) => {
  9  |   // This will run before each test in this file, we can use this to perform any setup actions like navigating to the login page before each test.
  10 |   await loginPage.goToLoginPage();
  11 | });
  12 | 
  13 | test("@smoke Login page title test", async ({ loginPage }) => {
  14 |   //page is the default fixture provided by playwright which will create a new browser context and a new page for each test and it will also close the browser after the test is done.
  15 | 
  16 |   const pageTitle = await loginPage.getPageTitle();
  17 |   console.log(`Login page title: ${pageTitle}`);
  18 |   expect(pageTitle).toBe("Account Login");
  19 | });
  20 | 
  21 | test("ForgetPassword link exist test", async ({ loginPage }) => {
  22 |   //let isForgetPwdLinkExist = await loginPage.isForgetPwdLinkExist();
  23 |   //expect(isForgetPwdLinkExist).toBe(true);
> 24 |   expect(await loginPage.isForgetPwdLinkExist()).toBeTruthy();
     |                                                  ^ Error: expect(received).toBeTruthy()
  25 | });
  26 | 
  27 | test("user is able to login to specific environment test", async ({ loginPage, homePage }) => {
  28 |   //await loginPage.doLogin("pwtestbatch@open.com", "pw123");
  29 |   await loginPage.doLogin(process.env.OC_USERNAME!, process.env.OC_PASSWORD!);
  30 |   //await loginPage.waitForTimeoutTemp(); // Wait for the page to load after login
  31 |   expect.soft(await loginPage.getPageTitle()).toBe("My Account");
  32 |   expect.soft(await homePage.isLogoutLinkExist()).toBeTruthy();
  33 | });
  34 | 
  35 | let csvTestData = CsvHelper.readCsv("src/data/loginData.csv");
  36 | for (let row of csvTestData) {
  37 |   test(`invalid login test with ${row.username} and ${row.password} using csv data`, async ({ loginPage }) => {
  38 |     await loginPage.doLogin(row.username, row.password);
  39 |     expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
  40 |   });
  41 | }
  42 | 
  43 | let excelTestData = ExcelHelper.readExcel("src/data/OpenCartTestDataExcel.xlsx", "login");
  44 | for (let row of excelTestData) {
  45 |   test(`invalid login test with ${row.username} using excel data`, async ({ loginPage }) => {
  46 |     await loginPage.doLogin(row.username, row.password);
  47 |     expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
  48 |   });
  49 | }
  50 | 
  51 | let jsonTestData = JsonHelper.readJson("src/data/loginDataJson.json");
  52 | for (let row of jsonTestData) {
  53 |   test(`invalid login test with ${row.username} using json data`, async ({ loginPage }) => {
  54 |     await loginPage.doLogin(row.username, row.password);
  55 |     expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
  56 |   });
  57 | }
  58 | 
  59 | //common test
  60 | 
  61 | test("comp logo exists on product page", async ({ basePage }) => {
  62 |   expect(await basePage.isLogoVisible()).toBeTruthy();
  63 | });
  64 | 
  65 | test("footer exist on product page", async ({ basePage }) => {
  66 |   expect(await basePage.getPageFootersCount()).toBe(16);
  67 | });
  68 | 
```