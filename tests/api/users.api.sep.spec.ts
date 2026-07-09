import { test, expect } from "../../src/fixtures/apifixtures";

const TOKEN = process.env.API_TOKEN!;
const AUTH_HEADER = {
  Authorization: `Bearer ${TOKEN}`,
};

let userId: number;

test.describe.serial("Running e2e go rest crud API tests", () => {
  //GET test:
  test("Get API - get all users", async ({ apiHelper }) => {
    let response = await apiHelper.get("/public/v2/users", AUTH_HEADER);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  //POST test:
  test("Post API - create a new user", async ({ apiHelper }) => {
    const id = crypto.randomUUID().slice(0, 8);
    let userData = {
      name: `Test User New ${id}`,
      email: `testuser${id}@example.com`,
      gender: "male",
      status: "active",
    };
    let response = await apiHelper.post("/public/v2/users", userData, AUTH_HEADER);
    console.log(response.body);
    expect(response.status).toBe(201);
    expect(response.body.name).toBe(userData.name);
    expect(response.body).toHaveProperty("id");
    userId = response.body.id;
    console.log(`Created user ID: ${userId}`);
  });

  test("Put API - update the user", async ({ apiHelper }) => {
    let userUpdatedData = {
      name: "Updated User Name",
      email: "updateduser@example.com",
      status: "inactive",
    };
    let response = await apiHelper.put(`/public/v2/users/${userId}`, userUpdatedData, AUTH_HEADER);
    console.log(response.body);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe(userUpdatedData.name);
    expect(response.body.status).toBe(userUpdatedData.status);
  });

  test("Delete API - delete the user", async ({ apiHelper }) => {
    let response = await apiHelper.delete(`/public/v2/users/${userId}`, AUTH_HEADER);
    console.log(response.body);
    expect(response.status).toBe(204);
  });
});
