import { test, expect, APIRequestContext } from "@playwright/test";
import { randomUUID } from "node:crypto";

let AUTH_TOKEN = { Authorization: "Bearer 7ac11ffb0d369a56e2d18bb98b39c48550c6235034ff9a03a12f0ef0cafae1b5" };

async function createUser(request: APIRequestContext): Promise<number> {
  const id = randomUUID().slice(0, 8);
  const response = await request.post("https://gorest.co.in/public/v2/users", {
    headers: AUTH_TOKEN,
    data: {
      name: `Test User New ${id}`,
      email: `testuser${id}@example.com`,
      gender: "female",
      status: "active",
    },
  });
  expect(response.status()).toBe(201);
  return (await response.json()).id;
}

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
  const userId = await createUser(request);

  let testData = {
    name: `Test User Updated ${randomUUID().slice(0, 8)}`,
    email: `testupdated${randomUUID().slice(0, 8)}@example.com`,
    gender: "female",
    status: "inactive",
  };

  let response = await request.put(`https://gorest.co.in/public/v2/users/${userId}`, {
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
  const userId = await createUser(request);

  let response = await request.delete(`https://gorest.co.in/public/v2/users/${userId}`, {
    headers: AUTH_TOKEN,
  });

  console.log(`Response status: ${response.status()}`);
  console.log(`Response status text: ${response.statusText()}`);
  expect(response.status()).toBe(204);
});
