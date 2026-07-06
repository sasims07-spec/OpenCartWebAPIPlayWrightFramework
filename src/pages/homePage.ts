import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class HomePage extends BasePage {
  //Private variables declaration to store the locators
  // why we are using private because we don't want to access these variables outside this class and we are using readonly because we don't want to change the value of these variables once they are initialized in the constructor
  private readonly logoutLink: Locator;
  private readonly headers: Locator;

  //Constructor to initialize the locators
  //Whenever we create an object of this class we need to pass the page object as a parameter to the constructor and then we will initialize the locators using the page object.
  // Here we using the encapsulation concept of OOPs to hide the implementation details of the locators(private in the above initialization) and we are providing a public method to interact with the login page.
  constructor(page: Page) {
    super(page); // calling the constructor of the basePage class to initialize the page object in the basePage class
    this.logoutLink = page.getByRole("link", { name: "Logout" });
    this.headers = page.getByRole("heading", { level: 2 }); //if html tag is h2 then level will be 2 and if it is h1 then level will be 1 and so on.
  }

  async isLogoutLinkExist(): Promise<boolean> {
    return await this.logoutLink.isVisible();
  }

  async getHomePageHeaders(): Promise<string[]> {
    return await this.headers.allInnerTexts(); //all() will return an array of locators and then we can use allInnerTexts() to get the text of all the locators in the array and it will return an array of strings.
  }

  async doSearch(searchKey: string): Promise<void> {
    console.log(`Searching for: ${searchKey}`);
    await this.searchBox.fill(searchKey);
    await this.searchIcon.click();
  }
}
