import { test, expect } from "@playwright/test";
import { randomUUID } from "node:crypto";

let AUTH_TOKEN = { Authorization: "Bearer 7ac11ffb0d369a56e2d18bb98b39c48550c6235034ff9a03a12f0ef0cafae1b5" };

test("get user test", async ({ request }) => {
  let response = await request.get("https://gorest.co.in/public/v2/users/", {
    headers: AUTH_TOKEN,
  });

  let jsonBody = await response.json();
  console.log(jsonBody);

  console.log(`Response status: ${response.status()}`);
  console.log(`Response status text: ${response.statusText()}`);
  expect(response.status()).toBe(200);
});

test("Post user test", async ({ request }) => {
  //JS Object to send in the request body
  const id = randomUUID().slice(0, 8);
  let testData = {
    name: `Test User New ${id}`,
    email: `testuser${id}@example.com`,
    gender: "female",
    status: "active",
  };

  //JS Object to JSON: Serilization
  let response = await request.post("https://gorest.co.in/public/v2/users", {
    headers: AUTH_TOKEN,
    data: testData,
  });

  let jsonBody = await response.json();
  console.log(jsonBody);
  console.log(`Response status: ${response.status()}`);
  console.log(`Response status text: ${response.statusText()}`);
  expect(response.status()).toBe(201);
});

test("Update user test", async ({ request }) => {
  let testData = {
    name: "Test User New 6a88a0eb",
    email: "testuser6a88a0eb@example.com",
    gender: "female",
    status: "Inactive",
  };

  //JS Object to JSON: Serilization
  let response = await request.put("https://gorest.co.in/public/v2/users/8517378", {
    headers: AUTH_TOKEN,
    data: testData,
  });

  let jsonBody = await response.json();
  console.log(jsonBody);
  console.log(`Response status: ${response.status()}`);
  console.log(`Response status text: ${response.statusText()}`);
  expect(response.status()).toBe(200);
});

test("Delete user test", async ({ request }) => {
  //JS Object to send in the request body

  //JS Object to JSON: Serilization
  let response = await request.delete("https://gorest.co.in/public/v2/users/8517329", {
    headers: AUTH_TOKEN,
  });

  console.log(`Response status: ${response.status()}`);
  console.log(`Response status text: ${response.statusText()}`);
  expect(response.status()).toBe(204);
});
