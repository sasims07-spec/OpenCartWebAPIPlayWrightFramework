import { test, expect } from "@playwright/test";
import { LoginPage } from "../src/pages/loginPage";
import { HomePage } from "../src/pages/homePage";

let loginPage: LoginPage;
let homePage: HomePage;

test.beforeEach(async ({ page }) => {
  // This will run before each test in this file, we can use this to perform any setup actions like navigating to the login page before each test.
  loginPage = new LoginPage(page);
  await loginPage.goToLoginPage();
  homePage = new HomePage(page);
});

test("Login page title test", async () => {
  //page is the default fixture provided by playwright which will create a new browser context and a new page for each test and it will also close the browser after the test is done.

  const pageTitle = await loginPage.getLoginPageTitle();
  console.log(`Login page title: ${pageTitle}`);
  expect(pageTitle).toBe("Account Login");
});

test("ForgetPassword link exist test", async () => {
  //let isForgetPwdLinkExist = await loginPage.isForgetPwdLinkExist();
  //expect(isForgetPwdLinkExist).toBe(true);
  expect(await loginPage.isForgetPwdLinkExist()).toBeTruthy();
});

test("user is able to login to app test", async () => {
  await loginPage.doLogin("pwtestbatch@open.com", "pw123");
  await loginPage.waitForTimeoutTemp(); // Wait for the page to load after login
  expect.soft(await loginPage.getLoginPageTitle()).toBe("My Account");
  expect.soft(await homePage.isLogoutLinkExist()).toBeTruthy();
});
