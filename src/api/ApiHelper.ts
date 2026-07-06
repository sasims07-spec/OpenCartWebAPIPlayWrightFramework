import { APIRequestContext } from "@playwright/test";

export class ApiHelper {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string) {
    this.request = request;
    this.baseUrl = baseUrl;
  }
  //Get
  public async get(endpoint: string, headers?: Record<string, any>) {
    let response = await this.request.get(`${this.baseUrl}${endpoint}`, {
      headers: headers,
    });
    console.log("Response status:", response);
    return {
      status: response.status(),
      statusText: response.statusText(),
      body: await response.json(),
    };
  }

  //POST
  public async post(endpoint: string, data: object, headers?: Record<string, any>) {
    let response = await this.request.post(`${this.baseUrl}${endpoint}`, {
      headers: headers,
      data: data,
    });
    return {
      status: response.status(),
      statusText: response.statusText(),
      body: await response.json(),
    };
  }

  //PUT
  public async put(endpoint: string, data: object, headers?: Record<string, any>) {
    let response = await this.request.put(`${this.baseUrl}${endpoint}`, {
      headers: headers,
      data: data,
    });
    return {
      status: response.status(),
      statusText: response.statusText(),
      body: await response.json(),
    };
  }

  //DELETE
  public async delete(endpoint: string, headers?: Record<string, any>) {
    let response = await this.request.delete(`${this.baseUrl}${endpoint}`, {
      headers: headers,
    });
    const text = await response.text();
    return {
      status: response.status(),
      statusText: response.statusText(),
      body: text ? JSON.parse(text) : null,
    };
  }
}
