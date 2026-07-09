//schema : type of the response data
//ajv ----> node lib for the schema validation
//npm install ajv
import { randomUUID } from "crypto";
import { ApiHelper } from "../../src/api/ApiHelper";
import { test, expect } from "../../src/fixtures/apifixtures";
import Ajv from "ajv";

let TOKEN = process.env.API_TOKEN;
let AUTH_HEADER = { Authorization: `Bearer ${TOKEN}` };

// setup AJV:
let ajv = new Ajv();

//define JSON schema
let userSchema = {
  type: "object",
  properties: {
    id: {
      type: "number",
    },
    name: {
      type: "string",
    },
    email: {
      type: "string",
    },
    gender: {
      type: "string",
    },
    status: {
      type: "string",
    },
  },
  required: ["id", "name", "email", "gender", "status"],
};

let userArraySchema = {
  type: "array",
  items: userSchema,
};

test("GET -- get the user", async ({ apiHelper }) => {
  const id = randomUUID().slice(0, 8);
  let userData = {
    name: `Schema Test User ${id}`,
    email: `testuser${id}@example.com`,
    gender: "female",
    status: "active",
  };
  //create a user - POST
  let createResponse = await apiHelper.post("/public/v2/users", userData, AUTH_HEADER);
  let userId = createResponse.body.id;

  //get - get a user
  let getUserResponse = await apiHelper.get(`/public/v2/users/${userId}`, AUTH_HEADER);
  expect(getUserResponse.status).toBe(200);

  //schema validation from ajv
  let validate = ajv.compile(userSchema);
  let isSchemaValid = validate(getUserResponse.body); //this is going to validate this response body based the previous userSchema
  if (!isSchemaValid) {
    console.log("Schema Errors:", validate.errors);
  }
  expect(isSchemaValid).toBeTruthy();
});

test("GET -- get all user", async ({ apiHelper }) => {
  //get - get a user
  let getUserResponse = await apiHelper.get("/public/v2/users", AUTH_HEADER);
  expect(getUserResponse.status).toBe(200);

  //schema validation from ajv
  let validate = ajv.compile(userArraySchema);
  let isSchemaValid = validate(getUserResponse.body); //this is going to validate this response body based the previous userSchema
  if (!isSchemaValid) {
    console.log("Schema Errors:", validate.errors);
  }
  expect(isSchemaValid).toBeTruthy();
});
