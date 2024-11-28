import { APIResponse } from "playwright";
import { APIRequestContext } from "playwright-core";

export default class API {
  private request: APIRequestContext;
  private baseURL: string;
  private apiKey: string;

  constructor(request: APIRequestContext, baseURL: string) {
    if (!baseURL) {
      throw new Error("Base URL is required for API requests.");
    }
    this.request = request;
    this.baseURL = baseURL;
   // this. = process.env.X_LIFI_API_KEY || "";
  }

  // Helper method to construct the URL with query parameters
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.keys(params).forEach((key) => {
        url.searchParams.append(key, params[key]);
      });
    }
    return url.toString();
  }

  private async makeRequest(
    endpoint: string, 
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE", 
    reqBody?: object, 
    params?: Record<string, string>
    ): Promise<APIResponse> {
    // Build the request URL with query parameters
    const url = this.buildUrl(endpoint, params);

    // Set request headers
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(this.apiKey ? { "x-lifi-api-key": this.apiKey } : {}),
    };
    
    const options: Record<string, any> = { headers };
    if (reqBody) {
      options.data = reqBody;
    }

    try {
      console.log("Request URL:", url.toString());
      console.log("Request Params:", params);

      const response = await this.request.fetch(url.toString(), options);
      return response;
    } catch (error) {
      console.error(`Error during API call to ${url.toString()}:`, error.message);
      throw error;
    }

   // return await this.request[method](url.toString(), options);
  }

  async postRequest(endpoint: string, reqBody: object):Promise<APIResponse> {
    return this.makeRequest(endpoint, 'POST', reqBody);
  }

  async getRequest(endpoint: string, params?: Record<string, any>):Promise<APIResponse> {
    return this.makeRequest(endpoint, 'GET', undefined, params);
  }

  async putRequest(endpoint: string, reqBody: object):Promise<APIResponse> {
    return this.makeRequest(endpoint, 'PUT', reqBody);
  }

  async patchRequest(endpoint: string, reqBody: object):Promise<APIResponse> {
    return this.makeRequest(endpoint, 'PATCH', reqBody);
  }

  async deleteRequest(endpoint: string):Promise<APIResponse> {
    return this.makeRequest(endpoint, 'DELETE');
  }
}