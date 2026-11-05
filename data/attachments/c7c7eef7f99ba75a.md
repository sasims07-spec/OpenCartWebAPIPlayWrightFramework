# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: registrationpagefixture.spec.ts >> registration test with Matt Barr using csv data
- Location: tests/registrationpagefixture.spec.ts:19:3

# Error details

```
Test timeout of 70000ms exceeded.
```

```
Error: locator.fill: Test timeout of 70000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: 'First Name' })

```

# Test source

```ts
  1  | import { Locator, Page } from "@playwright/test";
  2  | import { BasePage } from "./basePage";
  3  | 
  4  | export class RegistrationPage extends BasePage {
  5  |   private readonly firstName: Locator;
  6  |   private readonly lastName: Locator;
  7  |   private readonly emailID: Locator;
  8  |   private readonly telephone: Locator;
  9  |   private readonly password: Locator;
  10 |   private readonly confirmPassword: Locator;
  11 |   private readonly privacyPolicyCheckbox: Locator;
  12 |   private readonly continueButton: Locator;
  13 |   private readonly accountCreatedHeading: Locator;
  14 | 
  15 |   //Constructor to initialize the locators
  16 |   //Whenever we create an object of this class we need to pass the page object as a parameter to the constructor and then we will initialize the locators using the page object.
  17 |   // Here we using the encapsulation concept of OOPs to hide the implementation details of the locators(private in the above initialization) and we are providing a public method to interact with the login page.
  18 |   constructor(page: Page) {
  19 |     super(page); // calling the constructor of the basePage class to initialize the page object in the basePage class
  20 |     this.firstName = page.getByRole("textbox", { name: "First Name" });
  21 |     this.lastName = page.getByRole("textbox", { name: "Last Name" });
  22 |     this.emailID = page.getByRole("textbox", { name: "E-Mail" });
  23 |     this.telephone = page.getByRole("textbox", { name: "Telephone" });
  24 |     this.password = page.getByPlaceholder("Password", { exact: true });
  25 |     this.confirmPassword = page.getByPlaceholder("Password Confirm", {
  26 |       exact: true,
  27 |     });
  28 |     this.privacyPolicyCheckbox = page.locator('[name="agree"]');
  29 |     this.continueButton = page.getByRole("button", { name: "Continue" });
  30 |     this.accountCreatedHeading = page.getByRole("heading", {
  31 |       name: "Your Account Has Been Created!",
  32 |     });
  33 |   }
  34 | 
  35 |   //Public method to perform login action
  36 |   //public page actions(methods)/behaviour to interact with the login page
  37 |   async goToRegistrationPage(): Promise<void> {
  38 |     await this.page.goto("/opencart/index.php?route=account/register");
  39 |   }
  40 |   async getRegistrationPageTitle(): Promise<string> {
  41 |     return await this.page.title();
  42 |   }
  43 | 
  44 |   async doRegistration(
  45 |     firstName: string,
  46 |     lastName: string,
  47 |     email: string,
  48 |     telephone: string,
  49 |     password: string,
  50 |     confirmPassword: string,
  51 |     subscribe: boolean,
  52 |   ): Promise<void> {
  53 |     console.log(`User details: ${firstName} ${lastName} ${email} ${telephone} ${subscribe}`);
> 54 |     await this.firstName.fill(firstName);
     |                          ^ Error: locator.fill: Test timeout of 70000ms exceeded.
  55 |     await this.lastName.fill(lastName);
  56 |     await this.emailID.fill(email);
  57 |     await this.telephone.fill(telephone);
  58 |     await this.password.fill(password);
  59 |     await this.confirmPassword.fill(confirmPassword);
  60 |     await this.page.getByRole("radio", { name: subscribe ? "Yes" : "No" }).check();
  61 |     await this.privacyPolicyCheckbox.check();
  62 |     await this.continueButton.click();
  63 |   }
  64 | 
  65 |   async isAccountCreated(): Promise<boolean> {
  66 |     return await this.accountCreatedHeading.isVisible();
  67 |   }
  68 | }
  69 | 
```