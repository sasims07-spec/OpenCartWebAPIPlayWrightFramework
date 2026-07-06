import { test, expect } from "../../src/fixtures/apifixtures";

const TOKEN = process.env.API_Token!;
const AUTH_HEADER = {
  Authorization: `Bearer ${TOKEN}`,
};

//helper - generic function to create a user and return the userId
async function createUser(apiHelper: any) {
  const id = crypto.randomUUID().slice(0, 8);
  let userData = {
    name: `Test User New ${id}`,
    email: `testuser${id}@example.com`,
    gender: "male",
    status: "active",
  };
  let response = await apiHelper.post("/public/v2/users", userData, AUTH_HEADER);
  expect(response.status).toBe(201);
  expect(response.body).toHaveProperty("id");
  return response.body;
}

//POST--GET
//Test 1: Create a user + verify: AAA
//POST ---> userId --> GET / userId --> verify user details
test("POST- Create a user", async ({ apiHelper }) => {
  //create a user:
  let userResponse = await createUser(apiHelper);
  //get the user
  let response = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
  expect(response.status).toBe(200);
  expect(response.body.name).toBe(userResponse.name);
});

//POST--PUT
test("Put API - update a user", async ({ apiHelper }) => {
  //create a user:
  let userResponse = await createUser(apiHelper);

  let id = crypto.randomUUID().slice(0, 8);
  let userUpdatedData = {
    name: `UpdateUser${id}`,
    email: `updateuser${id}@example.com`,
    gender: "male",
    status: "inactive",
  };
  let response = await apiHelper.put(`/public/v2/users/${userResponse.id}`, userUpdatedData, AUTH_HEADER);
  console.log(response.body);
  expect(response.status).toBe(200);
  expect(response.body.name).toBe(userUpdatedData.name);
  expect(response.body.status).toBe(userUpdatedData.status);
});

//POST--GET
//POST--DELETE
test("Delete API - delete a user", async ({ apiHelper }) => {
  //create a user:
  let userResponse = await createUser(apiHelper);

  let response = await apiHelper.delete(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
  expect(response.status).toBe(204);

  //verify user is deleted
  let getResponse = await apiHelper.get(`/public/v2/users/${userResponse.id}`, AUTH_HEADER);
  expect(getResponse.status).toBe(404);
});
