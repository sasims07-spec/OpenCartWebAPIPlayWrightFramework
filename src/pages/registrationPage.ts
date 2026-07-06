import { Locator, Page } from "@playwright/test";
import { BasePage } from "./basePage";

export class RegistrationPage extends BasePage {
  private readonly firstName: Locator;
  private readonly lastName: Locator;
  private readonly emailID: Locator;
  private readonly telephone: Locator;
  private readonly password: Locator;
  private readonly confirmPassword: Locator;
  private readonly privacyPolicyCheckbox: Locator;
  private readonly continueButton: Locator;
  private readonly accountCreatedHeading: Locator;

  //Constructor to initialize the locators
  //Whenever we create an object of this class we need to pass the page object as a parameter to the constructor and then we will initialize the locators using the page object.
  // Here we using the encapsulation concept of OOPs to hide the implementation details of the locators(private in the above initialization) and we are providing a public method to interact with the login page.
  constructor(page: Page) {
    super(page); // calling the constructor of the basePage class to initialize the page object in the basePage class
    this.firstName = page.getByRole("textbox", { name: "First Name" });
    this.lastName = page.getByRole("textbox", { name: "Last Name" });
    this.emailID = page.getByRole("textbox", { name: "E-Mail" });
    this.telephone = page.getByRole("textbox", { name: "Telephone" });
    this.password = page.getByPlaceholder("Password", { exact: true });
    this.confirmPassword = page.getByPlaceholder("Password Confirm", {
      exact: true,
    });
    this.privacyPolicyCheckbox = page.locator('[name="agree"]');
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.accountCreatedHeading = page.getByRole("heading", {
      name: "Your Account Has Been Created!",
    });
  }

  //Public method to perform login action
  //public page actions(methods)/behaviour to interact with the login page
  async goToRegistrationPage(): Promise<void> {
    await this.page.goto("/opencart/index.php?route=account/register");
  }
  async getRegistrationPageTitle(): Promise<string> {
    return await this.page.title();
  }

  async doRegistration(
    firstName: string,
    lastName: string,
    email: string,
    telephone: string,
    password: string,
    confirmPassword: string,
    subscribe: boolean,
  ): Promise<void> {
    console.log(`User details: ${firstName} ${lastName} ${email} ${telephone} ${subscribe}`);
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.emailID.fill(email);
    await this.telephone.fill(telephone);
    await this.password.fill(password);
    await this.confirmPassword.fill(confirmPassword);
    await this.page.getByRole("radio", { name: subscribe ? "Yes" : "No" }).check();
    await this.privacyPolicyCheckbox.check();
    await this.continueButton.click();
  }

  async isAccountCreated(): Promise<boolean> {
    return await this.accountCreatedHeading.isVisible();
  }
}
