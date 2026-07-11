import { test, expect } from "../src/fixtures/pagefixtures";
import { CsvHelper } from "../src/utils/CsvHelper";
import { ExcelHelper } from "../src/utils/ExcelHelper";
import { JsonHelper } from "../src/utils/JsonHelper";

test.setTimeout(70_000);

test.beforeEach(async ({ loginPage }) => {
  // This will run before each test in this file, we can use this to perform any setup actions like navigating to the login page before each test.
  await loginPage.goToLoginPage();
});

test("@smoke Login page title test", async ({ loginPage }) => {
  //page is the default fixture provided by playwright which will create a new browser context and a new page for each test and it will also close the browser after the test is done.

  const pageTitle = await loginPage.getPageTitle();
  console.log(`Login page title: ${pageTitle}`);
  expect(pageTitle).toBe("Account Login");
});

test("ForgetPassword link exist test", async ({ loginPage }) => {
  //let isForgetPwdLinkExist = await loginPage.isForgetPwdLinkExist();
  //expect(isForgetPwdLinkExist).toBe(true);
  expect(await loginPage.isForgetPwdLinkExist()).toBeTruthy();
});

test("user is able to login to specific environment test", async ({ loginPage, homePage }) => {
  //await loginPage.doLogin("pwtestbatch@open.com", "pw123");
  await loginPage.doLogin(process.env.OC_USERNAME!, process.env.OC_PASSWORD!);
  //await loginPage.waitForTimeoutTemp(); // Wait for the page to load after login
  expect.soft(await loginPage.getPageTitle()).toBe("My Account");
  expect.soft(await homePage.isLogoutLinkExist()).toBeTruthy();
});

let csvTestData = CsvHelper.readCsv("src/data/loginData.csv");
for (let row of csvTestData) {
  test(`invalid login test with ${row.username} and ${row.password} using csv data`, async ({ loginPage }) => {
    await loginPage.doLogin(row.username, row.password);
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
  });
}

let excelTestData = ExcelHelper.readExcel("src/data/OpenCartTestDataExcel.xlsx", "login");
for (let row of excelTestData) {
  test(`invalid login test with ${row.username} using excel data`, async ({ loginPage }) => {
    await loginPage.doLogin(row.username, row.password);
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
  });
}

let jsonTestData = JsonHelper.readJson("src/data/loginDataJson.json");
for (let row of jsonTestData) {
  test(`invalid login test with ${row.username} using json data`, async ({ loginPage }) => {
    await loginPage.doLogin(row.username, row.password);
    expect(await loginPage.isInvalidLoginErrorDisplayed()).toBeTruthy();
  });
}

//common test

test("comp logo exists on product page", async ({ basePage }) => {
  expect(await basePage.isLogoVisible()).toBeTruthy();
});

test("footer exist on product page", async ({ basePage }) => {
  expect(await basePage.getPageFootersCount()).toBe(16);
});
