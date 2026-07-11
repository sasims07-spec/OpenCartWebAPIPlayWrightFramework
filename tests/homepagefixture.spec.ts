import { test, expect } from "../src/fixtures/pagefixtures";
test.setTimeout(70_000);

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goToLoginPage();
  await loginPage.doLogin("pwtestbatch@open.com", "pw123");
});

test("@smoke Home page title test", async ({ homePage }) => {
  const homePageTitle = await homePage.getPageTitle();
  console.log(`Home page title: ${homePageTitle}`);
  expect(homePageTitle).toBe("My Account");
});

test("Logout link exist test", async ({ homePage }) => {
  expect(await homePage.isLogoutLinkExist()).toBeTruthy();
});

test("Home page headers exist test", async ({ homePage }) => {
  const allHeaders = await homePage.getHomePageHeaders();
  console.log(`Home page headers: ${allHeaders}`);
  //expect(allHeaders.length).toBeGreaterThan(0);
  expect.soft(allHeaders).toHaveLength(4);
  expect(allHeaders).toEqual(["My Account", "My Orders", "My Affiliate Account", "Newsletter"]);
});
