# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: homepagefixture.spec.ts >> Logout link exist test
- Location: tests/homepagefixture.spec.ts:15:1

# Error details

```
Test timeout of 70000ms exceeded while running "beforeEach" hook.
```

```
Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
Call log:
  - navigating to "https://naveenautomationlabs.com/opencart/index.php?route=account/login", waiting until "load"

```

# Test source

```ts
  1  | import { Locator, Page } from "@playwright/test";
  2  | import { BasePage } from "./basePage";
  3  | 
  4  | export class LoginPage extends BasePage {
  5  |   //Private variables declaration to store the locators
  6  |   // why we are using private because we don't want to access these variables outside this class and we are using readonly because we don't want to change the value of these variables once they are initialized in the constructor
  7  |   private readonly emailID: Locator; // type of the variable is Locator .
  8  |   private readonly password: Locator;
  9  |   private readonly loginButton: Locator;
  10 |   private readonly forgotPasswordLink: Locator;
  11 |   private readonly logo: Locator;
  12 |   private readonly loginErrorMessage: Locator;
  13 | 
  14 |   //Constructor to initialize the locators
  15 |   //Whenever we create an object of this class we need to pass the page object as a parameter to the constructor and then we will initialize the locators using the page object.
  16 |   // Here we using the encapsulation concept of OOPs to hide the implementation details of the locators(private in the above initialization) and we are providing a public method to interact with the login page.
  17 |   constructor(page: Page) {
  18 |     super(page); // calling the constructor of the basePage class to initialize the page object in the basePage class
  19 |     this.emailID = page.getByRole("textbox", { name: "E-Mail Address" });
  20 |     this.password = page.getByRole("textbox", { name: "Password" });
  21 |     this.loginButton = page.getByRole("button", { name: "Login" });
  22 |     this.forgotPasswordLink = page.getByRole("link", { name: "Forgotten Password" }).first();
  23 |     this.logo = page.getByAltText("navaneenopencart");
  24 |     this.loginErrorMessage = page.locator(".alert.alert-danger.alert-dismissible");
  25 |   }
  26 | 
  27 |   //Public method to perform login action
  28 |   //public page actions(methods)/behaviour to interact with the login page
  29 |   async goToLoginPage(): Promise<void> {
> 30 |     await this.page.goto("/opencart/index.php?route=account/login");
     |                     ^ Error: page.goto: net::ERR_ABORTED; maybe frame was detached?
  31 |   }
  32 |   async getLoginPageTitle(): Promise<string> {
  33 |     return await this.page.title();
  34 |   }
  35 |   async isForgetPwdLinkExist(): Promise<boolean> {
  36 |     return await this.forgotPasswordLink.isVisible();
  37 |   }
  38 | 
  39 |   async doLogin(username: string, password: string): Promise<void> {
  40 |     console.log(`User creds: ${username} : ${password}`);
  41 |     await this.emailID.fill(username);
  42 |     await this.password.fill(password);
  43 |     await this.loginButton.click();
  44 |   }
  45 |   async isInvalidLoginErrorDisplayed(): Promise<boolean> {
  46 |     return await this.loginErrorMessage.isVisible();
  47 |   }
  48 | 
  49 |   async waitForTimeoutTemp(): Promise<void> {
  50 |     await this.page.waitForTimeout(2000);
  51 |   }
  52 | }
  53 | 
```