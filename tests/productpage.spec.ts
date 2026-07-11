import { test, expect } from "../src/fixtures/pagefixtures";

test.beforeEach(async ({ loginPage }) => {
  await loginPage.goToLoginPage();
  await loginPage.doLogin(process.env.OC_USERNAME!, process.env.OC_PASSWORD!);
});

test("comp logo exists on product page", async ({ basePage }) => {
  expect(await basePage.isLogoVisible()).toBeTruthy();
});

test("@smoke footer exist on product page", async ({ basePage }) => {
  expect(await basePage.getPageFootersCount()).toBe(16);
});

test("verify product images count", async ({ homePage, searchResultsPage, productInfoPage }) => {
  await homePage.doSearch("macbook");
  await searchResultsPage.selectProduct("MacBook Pro");
  await productInfoPage.expectProductImagesCount(4);
});

test("verify product Information/Data", async ({ homePage, searchResultsPage, productInfoPage }) => {
  await homePage.doSearch("macbook");
  await searchResultsPage.selectProduct("MacBook Pro");
  let actualProductInfoMap = await productInfoPage.getProductInfo();
  // Calls a page object method that scrapes product details into a
  // Map (key-value pairs, e.g. 'Brand' -> 'Apple')
  console.log("Actual Product Details: ", actualProductInfoMap);
  expect.soft(actualProductInfoMap.get("ProductHeader")).toBe("MacBook Pro");
  expect.soft(actualProductInfoMap.get("Brand")).toBe("Apple");
  expect.soft(actualProductInfoMap.get("Product Code")).toBe("Product 18");
  expect.soft(actualProductInfoMap.get("Reward Points")).toBe("800");
  expect.soft(actualProductInfoMap.get("ProductPrice")).toBe("$2,000.00");
  expect.soft(actualProductInfoMap.get("ExTaxPrice")).toBe("$2,000.00");
});

test("add to cart test", async ({ homePage, searchResultsPage, productInfoPage }) => {
  await homePage.doSearch("macbook");
  await searchResultsPage.selectProduct("MacBook Pro");
  await productInfoPage.fillProductQuantity(2);
  await productInfoPage.productAddToCart();
  expect(await productInfoPage.isAddToCartSuccessMessageVisible()).toBeTruthy();
});
