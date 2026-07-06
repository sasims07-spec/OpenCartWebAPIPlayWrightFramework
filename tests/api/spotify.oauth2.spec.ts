import { test, expect } from "@playwright/test";

let OAUTH_CONFIG = {
  tokenURL: "https://accounts.spotify.com/api/token",
  clientId: process.env.OAUTH_CLIENT_ID!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  grantType: process.env.GRANT_TYPE!,
};

let accessToken: string;

test.beforeEach("POST - generate Spotify OAuth2 Access Token", async ({ request }) => {
  let response = await request.post(OAUTH_CONFIG.tokenURL, {
    form: {
      grant_type: OAUTH_CONFIG.grantType,
      client_id: OAUTH_CONFIG.clientId,
      client_secret: OAUTH_CONFIG.clientSecret,
    },
  });

  expect(response.status()).toBe(200);
  let jsonResponse = await response.json();
  accessToken = jsonResponse.access_token;
  console.log("Access Token:", accessToken);

  // Schema validation (trainer: 'append with more schema validation')
  expect(jsonResponse).toHaveProperty("access_token");
  expect(jsonResponse).toHaveProperty("token_type", "Bearer");
  expect(jsonResponse).toHaveProperty("expires_in");
  expect(typeof jsonResponse.access_token).toBe("string");
  expect(typeof jsonResponse.expires_in).toBe("number");
});

/*Spotify is rejecting the request — it's not a code bug. The response body in your Postman screenshot says it directly:

Active premium subscription required for the owner of the app. When the subscription status changes, it can take a few hours before requests are allowed again.

That's why both Postman and your Playwright test return 403 Forbidden with the same token — same app, same owner, same Spotify-side restriction. The token generated fine (the POST succeeded), but the /v1/search endpoint refuses to serve results because the developer account that owns the app no longer has an active Premium subscription. */

test("GET -- get artist search data", async ({ request }) => {
  // https://api.spotify.com/v1/search?type=artist&q=coldplay&market=GB
  let baseURL = "https://api.spotify.com";
  let endPointURL = "/v1/search";
  let queryParam = {
    type: "artist",
    q: "coldplay",
    market: "GB",
  };

  let typeQMarketResponse = await request.get(`${baseURL}${endPointURL}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: queryParam,
  });

  expect(typeQMarketResponse.status()).toBe(200);
  console.log(await typeQMarketResponse.json());

  let typeJson = await typeQMarketResponse.json();
  console.log(typeJson.artists.total);

  let artist1 = typeJson.artists.items[0];
  console.log(artist1);
});
