import { Locator, Page } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;

  // Common locators available across pages
  protected readonly logo: Locator;
  protected readonly searchBox: Locator;
  protected readonly searchIcon: Locator;
  protected readonly footerLinks: Locator;
  protected readonly currency: Locator;
  protected readonly cartButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page.getByAltText("naveenopencart");
    this.searchBox = page.getByPlaceholder("Search");
    this.searchIcon = page.locator("div#search button");
    this.currency = page.locator("form-currency");
    this.footerLinks = page.locator("footer a");
    this.cartButton = page.locator("div#cart button");
  }

  // Common visibility methods

  async isLogoVisible(): Promise<boolean> {
    return this.logo.isVisible();
  }

  async isSearchBoxVisible(): Promise<boolean> {
    return this.searchBox.isVisible();
  }

  async isCurrencyBoxVisible(): Promise<boolean> {
    return this.currency.isVisible();
  }

  async isCartButtonVisible(): Promise<boolean> {
    return this.cartButton.isVisible();
  }

  // Footer methods

  async getPageFootersCount(): Promise<number> {
    return this.footerLinks.count();
  }

  async getPageFooters(): Promise<string[]> {
    return this.footerLinks.allInnerTexts();
  }

  // Generic page methods

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentTitle(): Promise<string> {
    return this.page.title();
  }
}
