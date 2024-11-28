import { APIResponse } from 'playwright'
import { expect } from '@playwright/test'
import * as Error from '../constants/error-messages.json'

class ResponseValidator {
  /**
   * Verifies that the provided API response contains the provided expected status code
   * @param response - the API response we want to verify the response code of
   * @param expectedStatusCode - the response code we expect the request response to have
   */
  static async validateStatusCode(
    response: APIResponse,
    expectedStatusCode: number,
  ): Promise<void> {
    await expect(response.status()).toBe(expectedStatusCode)
  }

  static async validateErrorMessageAndCode(
    response,
    expectedErrorCode: number,
    expectedErrorMessage: string
  ) {
    const responseBody = await response.json()
    expect(responseBody.message).toContain(expectedErrorMessage);
    expect(responseBody.code).toBe(expectedErrorCode);
  }
}

export default ResponseValidator
