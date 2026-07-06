import { Page, Locator } from "@playwright/test";
import { BasePage } from "./basePage";

export class SearchResultsPage extends BasePage {
  private readonly searchResults: Locator;

  constructor(page: Page) {
    super(page);
    this.searchResults = page.locator("div.product-layout");
  }

  async getSearchResultsCount(): Promise<number> {
    return await this.searchResults.count();
  }

  async selectProduct(productName: string): Promise<void> {
    await this.page.getByRole("link", { name: productName, exact: true }).first().click();
  }
}
