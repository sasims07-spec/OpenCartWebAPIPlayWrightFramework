import { test as baseTest } from "@playwright/test";
//This is a custom test fixture file where we can define our own fixtures and we can also override the existing fixtures provided by playwright like page, browser, context etc. and we can also create our own custom fixtures like loginPage, homePage etc. and we can use these fixtures in our test files to perform the actions on the pages.

import { LoginPage } from "../pages/loginPage";
import { HomePage } from "../pages/homePage";
import { RegistrationPage } from "../pages/registrationPage";
import { SearchResultsPage } from "../pages/searchResultsPage";
import { ProductInfoPage } from "../pages/ProductInfoPage";
import { BasePage } from "../pages/basePage";

//Define type of pagefixtures which will be used in the test files to access the loginPage and homePage fixtures.
type pagefixtures = {
  basePage: BasePage;
  loginPage: LoginPage;
  homePage: HomePage;
  registrationPage: RegistrationPage;
  searchResultsPage: SearchResultsPage;
  productInfoPage: ProductInfoPage;
};

//extend playwright baseTest
export const test = baseTest.extend<pagefixtures>({
  basePage: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },

  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  registrationPage: async ({ page }, use) => {
    const registrationPage = new RegistrationPage(page);
    await use(registrationPage);
  },

  searchResultsPage: async ({ page }, use) => {
    const searchResultsPage = new SearchResultsPage(page);
    await use(searchResultsPage);
  },

  productInfoPage: async ({ page }, use) => {
    const productInfoPage = new ProductInfoPage(page);
    await use(productInfoPage);
  },
});

export { expect } from "@playwright/test";
