import { test, expect } from "../src/fixtures/pagefixtures";
import { CsvHelper } from "../src/utils/CsvHelper";
import { ExcelHelper } from "../src/utils/ExcelHelper";
import { JsonHelper } from "../src/utils/JsonHelper";

test.beforeEach(async ({ registrationPage }) => {
  // This will run before each test in this file, we can use this to perform any setup actions like navigating to the login page before each test.
  await registrationPage.goToRegistrationPage();
});

test("Registration page title test", async ({ registrationPage }) => {
  const pageTitle = await registrationPage.getRegistrationPageTitle();
  console.log(`Registration page title: ${pageTitle}`);
  expect(pageTitle).toBe("Register Account");
});

let csvTestData = CsvHelper.readCsv("src/data/registrationData.csv");
for (let row of csvTestData) {
  test(`registration test with ${row.firstName} ${row.lastName} using csv data`, async ({ registrationPage }) => {
    const subscribe = row.subscribe.toLowerCase() === "yes" || row.subscribe.toLowerCase() === "true";

    await registrationPage.doRegistration(
      row.firstName,
      row.lastName,
      row.email.replace("@", `+${Date.now()}@`),
      row.telephone,
      row.password,
      row.password,
      subscribe,
    );
    expect(await registrationPage.isAccountCreated()).toBeTruthy();
  });
}

let excelTestData = ExcelHelper.readExcel("src/data/RegistrationTestDataExcel.xlsx", "register");
for (let row of excelTestData) {
  test(`registration test with ${row.firstName} ${row.lastName} using excel data`, async ({ registrationPage }) => {
    const subscribe = row.subscribe.toLowerCase() === "yes" || row.subscribe.toLowerCase() === "true";

    await registrationPage.doRegistration(
      row.firstName,
      row.lastName,
      row.email.replace("@", `+${Date.now()}@`),
      row.telephone,
      row.password,
      row.password,
      subscribe,
    );
    expect(await registrationPage.isAccountCreated()).toBeTruthy();
  });
}

let jsonTestData = JsonHelper.readJson("src/data/registrationDataJson.json");
for (let row of jsonTestData) {
  test(`registration test with ${row.firstName} ${row.lastName} using json data`, async ({ registrationPage }) => {
    const subscribe = row.subscribe.toLowerCase() === "yes" || row.subscribe.toLowerCase() === "true";

    await registrationPage.doRegistration(
      row.firstName,
      row.lastName,
      row.email.replace("@", `+${Date.now()}@`),
      row.telephone,
      row.password,
      row.password,
      subscribe,
    );
    expect(await registrationPage.isAccountCreated()).toBeTruthy();
  });
}
