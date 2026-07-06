import { test, expect } from "@playwright/test";
import { HomePage } from "../src/pages/homePage";
import { LoginPage } from "../src/pages/loginPage";

let homePage: HomePage;
let loginPage: LoginPage; // declaring at the global level so that it can be accessed in all the tests in this file.

test.beforeEach(async ({ page }) => {
  // This will run before each test in this file, we can use this to perform any setup actions like navigating to the login page before each test.
  loginPage = new LoginPage(page);
  await loginPage.goToLoginPage();
  await loginPage.doLogin("pwtestbatch@open.com", "pw123");
  homePage = new HomePage(page);
});

test("Home page title test", async () => {
  const homePageTitle = await homePage.getPageTitle();
  console.log(`Home page title: ${homePageTitle}`);
  expect(homePageTitle).toBe("My Account");
});

test("Logout link exist test", async () => {
  expect(await homePage.isLogoutLinkExist()).toBeTruthy();
});

test("Home page headers exist test", async () => {
  const allHeaders = await homePage.getHomePageHeaders();
  console.log(`Home page headers: ${allHeaders}`);
  //expect(allHeaders.length).toBeGreaterThan(0);
  expect.soft(allHeaders).toHaveLength(4);
  expect(allHeaders).toEqual(["My Account", "My Orders", "My Affiliate Account", "Newsletter"]);
});
