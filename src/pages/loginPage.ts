import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class LoginPage extends BasePage {
  //Private variables declaration to store the locators
  // why we are using private because we don't want to access these variables outside this class and we are using readonly because we don't want to change the value of these variables once they are initialized in the constructor
  private readonly emailID: Locator; // type of the variable is Locator .
  private readonly password: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly logo: Locator;
  private readonly loginErrorMessage: Locator;

  //Constructor to initialize the locators
  //Whenever we create an object of this class we need to pass the page object as a parameter to the constructor and then we will initialize the locators using the page object.
  // Here we using the encapsulation concept of OOPs to hide the implementation details of the locators(private in the above initialization) and we are providing a public method to interact with the login page.
  constructor(page: Page) {
    super(page); // calling the constructor of the basePage class to initialize the page object in the basePage class
    this.emailID = page.getByRole("textbox", { name: "E-Mail Address" });
    this.password = page.getByRole("textbox", { name: "Password" });
    this.loginButton = page.getByRole("button", { name: "Login" });
    this.forgotPasswordLink = page.getByRole("link", { name: "Forgotten Password" }).first();
    this.logo = page.getByAltText("navaneenopencart");
    this.loginErrorMessage = page.locator(".alert.alert-danger.alert-dismissible");
  }

  //Public method to perform login action
  //public page actions(methods)/behaviour to interact with the login page
  async goToLoginPage(): Promise<void> {
    await this.page.goto("/opencart/index.php?route=account/login");
  }
  async getLoginPageTitle(): Promise<string> {
    return await this.page.title();
  }
  async isForgetPwdLinkExist(): Promise<boolean> {
    return await this.forgotPasswordLink.isVisible();
  }

  async doLogin(username: string, password: string): Promise<void> {
    console.log(`User creds: ${username} : ${password}`);
    await this.emailID.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
  async isInvalidLoginErrorDisplayed(): Promise<boolean> {
    return await this.loginErrorMessage.isVisible();
  }

  async waitForTimeoutTemp(): Promise<void> {
    await this.page.waitForTimeout(2000);
  }
}
