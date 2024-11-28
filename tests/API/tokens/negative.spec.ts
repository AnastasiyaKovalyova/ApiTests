import { test, APIRequestContext } from '@playwright/test'
import API from '../../../utils/api-utils'
import chainTypes from '../../../data/tokens/inputData/chain-types.json'
import chains from '../../../data/tokens/chains.json'
import priceUSDData from '../../../data/tokens/inputData/min-price-usd.json'
import { tokens } from '../../../utils/api-endpoints'
import TokensResponseValidator from '../../../classes/TokensResponseValidator'
import ResponseValidator from '../../../classes/ResponseValidator'
import responseChains from '../../../data/tokens/outputData/responseChains.json'
import { TestData } from '../../../utils/test-data-utils'
import * as dotenv from 'dotenv';
import ErrorMessage from '../../../constants/error-messages.json';

dotenv.config()

test.describe.parallel('GET /tokens NEGATIVE API tests', () => {
  const REQUEST_LIMIT_PER_MINUTE_NOT_AUTHENTICATED = 100
  let requestContext: APIRequestContext
  let api: API

  test.beforeEach(async ({ playwright }) => {
    // Initialize the request context
    requestContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL || 'https://li.quest/v1',
      extraHTTPHeaders: {
        // "x-lifi-api-key": process.env.X_LIFI_API_KEY || "",
        'Content-Type': 'application/json',
      },
    })

    // Pass the request context to the API helper
    api = new API(requestContext, process.env.BASE_URL || 'https://li.quest/v1')
  })

  test.afterAll(async () => {
    // Dispose of the request context
    await requestContext.dispose()
  })

  test(`GET /tokens when providing single not supported chainType`, async () => {
    const chainType = chainTypes.notSupportedSingle.join(',')
    await console.log(`GET /tokens for a not supported chainType: ${chainType}`)

    const response = await api.getRequest(tokens.get, { chainTypes: chainType })

    // Validate 400 status code
    await ResponseValidator.validateStatusCode(response, 400)
    //Validate response body, message and code
    await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageChainTypes);
  })

  test(`GET /tokens when providing supported and not supported chainTypes`, async () => {
    const combinedChainTypes =
      chainTypes.notSupportedMixValidAndInvalid.join(',')
    await console.log(
      `GET /tokens for supported and not supported chainType: ${combinedChainTypes}`,
    )

    const response = await api.getRequest(tokens.get, {
      chainTypes: combinedChainTypes,
    })

    // Validate NOT FUND status code
    await ResponseValidator.validateStatusCode(response, 400)
    //Validate response body, message and code
    await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageChainTypes);
  })

  test(`GET /tokens when providing multiple not supported chainTypes`, async () => {
    const notSupportedChainTypes = chainTypes.notSupportedMultiple.join(',')
    await console.log(
      `GET all tokens for a not supported chainType: ${notSupportedChainTypes}`,
    )

    const response = await api.getRequest(tokens.get, {
      chainTypes: notSupportedChainTypes,
    })

    // Validate Not Found status code
    await ResponseValidator.validateStatusCode(response, 400)
    // Validate error code and message
    await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageChainTypes);
  })

  test(`GET /tokens when providing single not supported chain`, async () => {
    const notSupportedChain = Object.values(chains.notSupportedSingle).join(',')
    await console.log(
      `GET /tokens for single not supported chain: ${notSupportedChain}`,
    )

    const response = await api.getRequest(tokens.get, {
      chains: notSupportedChain,
    })

    // Validate NOT FOUND status code
    await ResponseValidator.validateStatusCode(response, 400)
    //Validate response body, message and code
    await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageChains);
  })

  test(`GET /tokens when providing multiple not supported chains`, async () => {
    const combinedChains = Object.values(chains.notSupportedMultiple).join(',')
    await console.log(
      `GET /tokens for multiple not supported chains: ${combinedChains}`,
    );

    const response = await api.getRequest(tokens.get, {
      chains: combinedChains,
    })

    // Validate NOT FOUND status code
    await ResponseValidator.validateStatusCode(response, 400)
    //Validate response body, message and code
    await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageChains);
  })

  test(`GET /tokens when providing both supported and not supported chains should fail with status code 400 and response code 1011`, async () => {
    const combinedChains = Object.values(
      chains.mixSupportedAndNotSupported,
    ).join(',')
    await console.log(
      `GET /tokens for supported and not supported chains: ${combinedChains}`,
    );

    const response = await api.getRequest(tokens.get, {
      chains: combinedChains,
    })

    // Validate NOT FOUND status code
    await ResponseValidator.validateStatusCode(response, 400)
    //Validate response body, message and code
    await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageChains);
  })

  Object.entries(priceUSDData.invalidMinPriceUSD).forEach((price) => {
    test(`GET /tokens for an invalid minPriceUSD: ${price}.`, async () => {
      const response = await api.getRequest(tokens.get, { minPriceUSD: price })

      // Validate NOT FOUND response
      await ResponseValidator.validateStatusCode(response, 400)
      //Validate response body, message and code
      await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageMinPriceUsd)
    })
  })

  test('GET /tokens with providing invalid chain, chainI and minPriceUSD should fail with stats code 400 and message status 1011', async () => {
    const invalidPrice = priceUSDData.invalidMinPriceUSD[0]
    const invalidChain = Object.values(chains.notSupportedSingle)
    const invalidChainType = chainTypes.notSupportedSingle

    const response = await api.getRequest(tokens.get, {
      minPriceUSD: invalidPrice,
      chainTypes: invalidChainType,
      chains: invalidChain,
    })
    const responseBody = await response.json()

    // Validate NOT FOUND status code
    await ResponseValidator.validateStatusCode(response, 400)
    //Validate response body, message and code
    await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageChains)
  })

  test('GET /tokens with providing invalid chain, chainI and valid minPriceUSD should fail with status code 400 and message status 1011', async () => {
    const valid = priceUSDData.validMinPriceUSD[0]
    const invalidChain = Object.values(chains.notSupportedSingle)
    const invalidChainType = chainTypes.notSupportedSingle

    const response = await api.getRequest(tokens.get, {
      minPriceUSD: valid,
      chainTypes: invalidChainType,
      chains: invalidChain,
    })

    // Validate NOT FOUND status code
    await ResponseValidator.validateStatusCode(response, 400)
    //Validate response body, message and code
    await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageChains);
  })

  //The invalid query params are ignored and the default response is returned?
  test('GET /tokens when providing invalid query params', async () => {
    // Generate a number of random query params
    const queryParams = await TestData.generateQueryParams(90)
    const queryString = new URLSearchParams(queryParams).toString()
    await console.log(`GET Request query params: ${queryString}`)

    const response = await api.getRequest(tokens.get, { queryString })
    const responseBody = await response.json()

    // Validate successful status code - do we expect successfull status code?
    // In the browser this is passing, here it is failing
    await ResponseValidator.validateStatusCode(response, 200)

    // Validate token groups and properties
    // this validation depends on whether the above one is expected to pass or not
    await TokensResponseValidator.validateTokensByChain(
      responseBody,
      responseChains.supported,
    )
  });

  test(`GET /tokens when providing SQL injection as a query parameter should fail with status code 400 and response code 1011`, async () => {
    const invalidChainValue = Object.values(chains.sqlInjection);

    const response = await api.getRequest(tokens.get, { chains: invalidChainValue });

    // Validate 400 status code
    await ResponseValidator.validateStatusCode(response, 400)
    //Validate response body, message and code
    await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageChains);
 });

 test(`GET /tokens when providing XSS injection as a query parameter should fail with status code 400 and response code 1011!`, async () => {
  const invalidChainValue = Object.values(chains.XssInjection);

  const response = await api.getRequest(tokens.get, { chains: invalidChainValue });

 // Validate 400 status code
 await ResponseValidator.validateStatusCode(response, 400)
 //Validate response body, message and code
 await ResponseValidator.validateErrorMessageAndCode(response, 1011, ErrorMessage.ErrorMessageChains);
});

  test('GET /tokens when providing invalid API KEY', async ({ playwright }) => {
    const invalidApiKey = process.env.INVALID_API_KEY || ''
    const negativeRequestContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL || '',
      extraHTTPHeaders: {
        'x-lifi-api-key': invalidApiKey,
        'Content-Type': 'application/json',
      },
    })

    const negativeApi = new API(
      negativeRequestContext,
      process.env.BASE_URL || '',
    )
    const response = await negativeApi.getRequest(tokens.get)

    // Validate NOT FOUND status code
    await ResponseValidator.validateStatusCode(response, 401)
    //Validate response body, message and code
    await ResponseValidator.validateErrorMessageAndCode(response, 401, ErrorMessage.Unauthorized)
  })

  test('GET /tokens when providing expired API KEY', async ({ playwright }) => {
    const invalidApiKey = process.env.EXPIRED_API_KEY || ''
    const negativeRequestContext = await playwright.request.newContext({
      baseURL: process.env.BASE_URL || '',
      extraHTTPHeaders: {
        'x-lifi-api-key': invalidApiKey,
        'Content-Type': 'application/json',
      },
    })

    const negativeApi = new API(
      negativeRequestContext,
      process.env.BASE_URL || '',
    )
    const response = await negativeApi.getRequest(tokens.get)

    await ResponseValidator.validateStatusCode(response, 401)
    await ResponseValidator.validateErrorMessageAndCode(response, 401, ErrorMessage.Unauthorized);
  })

  //Failing atm
  test.skip('GET /tokens should return 429 on the 21st request when not authenticated', async () => {
    // Send 20 requests in parallel to quickly hit the rate limit
    const requests = Array.from(
      { length: REQUEST_LIMIT_PER_MINUTE_NOT_AUTHENTICATED },
      () => api.getRequest(tokens.get),
    )

    // Wait for all the requests to complete
    const responses = await Promise.all(requests)

    // Verify the first 20 requests are successful
    for (const response of responses) {
      await ResponseValidator.validateStatusCode(response, 200)
    }

    // Send the 21st request, which should be rate-limited
    const rateLimitedResponse = await api.getRequest(tokens.get)

    //Verify Rate Limited Status Code
    await ResponseValidator.validateStatusCode(rateLimitedResponse, 429)
    // Check that the response status is 429 (rate-limited)
    await ResponseValidator.validateErrorMessageAndCode(
      rateLimitedResponse,
      429,
      ErrorMessage.RateLimited
    )
  });
})
