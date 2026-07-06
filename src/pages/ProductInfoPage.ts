import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class ProductInfoPage extends BasePage {
  private readonly header: Locator;
  private readonly productImages: Locator;
  private readonly productMetaData: Locator;
  private readonly productPricing: Locator;
  private readonly productQuantity: Locator;
  private readonly addToCartButton: Locator;
  private readonly addcartSuccessMessage: Locator;
  private readonly shoppingCartLink: Locator;

  private map: Map<string, string | number>; // Key-value storage

  constructor(page: Page) {
    super(page); // Call BasePage constructor
    this.header = page.getByRole("heading", { level: 1 });
    this.productImages = page.locator("div#content li img");
    this.productMetaData = page.locator("div#content ul.list-unstyled:nth-of-type(1) li");
    this.productPricing = page.locator("div#content ul.list-unstyled:nth-of-type(2) li");
    this.map = new Map<string, string | number>();
    this.productQuantity = page.getByRole("textbox", { name: "Qty" });
    this.addToCartButton = page.getByRole("button", { name: "Add to Cart" });
    this.addcartSuccessMessage = page.locator(".alert.alert-success.alert-dismissible");
    this.shoppingCartLink = page.getByText("shopping cart", { exact: true });
  }

  async getProductHeader(): Promise<string> {
    return await this.header.innerText();
  }

  async getProductImagesCount(): Promise<number> {
    await this.productImages.first().waitFor({ state: "visible" });
    return await this.productImages.count();
  }

  async expectProductImagesCount(expected: number): Promise<void> {
    await expect(this.productImages).toHaveCount(expected);
  }

  async getProductInfo(): Promise<Map<string, string | number>> {
    this.map.set("ProductHeader", await this.getProductHeader());
    this.map.set("ProductImages", await this.getProductImagesCount());
    await this.getProductMetaData();
    await this.getProductPricingData();
    return this.map;
  }

  private async getProductMetaData(): Promise<void> {
    let metData = await this.productMetaData.allInnerTexts();
    for (let data of metData) {
      let meta = data.split(":");
      let metaKey = meta[0].trim();
      let metaVal = meta[1].trim();
      this.map.set(metaKey, metaVal);
    }
  }

  private async getProductPricingData(): Promise<void> {
    let priceData = await this.productPricing.allInnerTexts();
    let productPrice = priceData[0].trim();
    let exTaxPrice = priceData[1].split(":")[1].trim();
    this.map.set("ProductPrice", productPrice);
    this.map.set("ExTaxPrice", exTaxPrice);
  }

  async fillProductQuantity(quantity: number): Promise<void> {
    await this.productQuantity.fill(quantity.toString());
  }

  async productAddToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async isAddToCartSuccessMessageVisible(): Promise<boolean> {
    await this.addcartSuccessMessage.waitFor({ state: "visible" });
    return await this.addcartSuccessMessage.isVisible();
  }

  async navigateToShoppingCart(): Promise<void> {
    await this.shoppingCartLink.click();
  }
}
