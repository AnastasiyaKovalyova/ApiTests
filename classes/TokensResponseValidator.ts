import ResponseValidator from './ResponseValidator'
import * as tokenProperties from '../data/token/token-properties.json'
import { TokensApiResponse } from '../types/tokens';

class TokensResponseValidator extends ResponseValidator {
  /**
   * Validates that the chains in the response are expected and that the response contains tokens.
   * @param response - the tokens object from the API response
   * @param expectedChainList - the expected chains and their chainIds
   * @returns - void; throws an error if validation fails
   */
  static validateChains(
    response: TokensApiResponse,
    expectedChainList: Record<string, number>,
  ): void {
    const validChainIds = new Set(Object.values(expectedChainList))

    // Extract chain IDs from the response
    const responseChainIds = Object.keys(response.tokens).map(Number)

    // Check for chains in the response that are not included in the list of expected chains
    const invalidChains = responseChainIds.filter(
      (chainId) => !validChainIds.has(chainId),
    )

    // If there are invalid chains, log the error and throw an exception
    if (invalidChains.length > 0) {
      const invalidChainsString = invalidChains.join(', ')
      console.error(`Invalid chains found in response: ${invalidChainsString}`)
      throw new Error(
        `The following chain IDs are not supported: ${invalidChainsString}`,
      )
    }

    console.log('All chains in the response are valid!')
  }

  /**
   * Verifies the chains from the /tokens response against a list of provided chains
   * @param response - the API response from GET /tokens
   * @param expectedChainList - the list of chains that need to be present in the response
   */
  static async validateChainsInResponse(
    response: TokensApiResponse,
    expectedChainList: Record<string, number>,
  ): Promise<void> {
    console.log(`Starting to validate the chains in the API Response...`)

    // Use the common helper function to validate the chains in the response
    await this.validateChains(response, expectedChainList)

    console.log('All chains in the response are valid!')
  }

  /**
   * Validates tokens returned by the API for the given chain type.
   * Ensures that all tokens belong to the expected chain and have valid properties.
   * @param response - the tokens object from the GET /tokens response body
   * @param chainTypes - the expected chain types by abbreviation
   */
  static async validateTokensByChain(
    response: TokensApiResponse,
    expectedChains: Record<string, number>,
  ): Promise<void> {
    console.log(
      `Start validating the token properties for each chain in the response...`,
    )

    // Use the common helper function to validate the chains in the response
    await this.validateChains(response, expectedChains)

    // Map the chainTypes to their corresponding chainIds
    const expectedChainIds = Array.from(new Set(Object.values(expectedChains)))

    // For every chainId in the tokens list, verify each token and its properties
    for (const [chainId, tokenList] of Object.entries(response.tokens)) {
      const parsedChainId = parseInt(chainId, 10)

      // Validate token list presence
      if (!Array.isArray(tokenList) || tokenList.length === 0) {
        throw new Error(
          `No tokens found for chainId=${chainId}. Expected tokens for chainIds=${expectedChainIds.join(', ')}`,
        )
      }

      // Validate each token in the token list
      for (const token of tokenList) {
        console.log(`Validating properties for token: ${token.name}...`)
        await this.validateTokenProperties(token, parsedChainId)
      }
    }

    // Validate that all expected chainIds have a token group in the response
    // for (const expectedChainId of expectedChainIds) {
    //   if (!response.tokens[expectedChainId]) {
    //     throw new Error(`Missing token group for expected chainId=${expectedChainId} in response.`);
    //   }
    // }
  }

  /**
   * Validates individual token properties.
   * Ensures the token has all required fields and matches the expected chain ID.
   * @param token - the token from the tokenList passed from the responseBody
   * @param expectedChainId - the chainId this token should be part of
   */
  static async validateTokenProperties(
    token: any,
    expectedChainId: number,
  ): Promise<void> {
    const requiredProperties = tokenProperties.requiredTokenProperties

    // Check for missing properties
    for (const prop of requiredProperties) {
      if (!Object.prototype.hasOwnProperty.call(token, prop)) {
        throw new Error(
          `Token ${token.name} is missing required property: ${prop}`,
        )
      }
    }

    console.log(`Token ${token.name} has all required properties present!`)

    // @todo check if these additional validations can be extracted into a separate function
    // Ensure chainId matches the expected value
    if (token.chainId !== expectedChainId) {
      throw new Error(
        `Token with address=${token.address} has invalid chainId=${token.chainId}. Expected: ${expectedChainId}`,
      )
    }

    console.log(`Token ${token.name} has the correct chainId!`)

    // Additional validation: Ensure 'decimals' is a number
    if (typeof token.decimals !== 'number' || token.decimals < 0) {
      throw new Error(
        `Invalid 'decimals' value for token: ${token.decimals}. Expected a non-negative number.`,
      )
    }

    // Additional validation: Ensure 'priceUSD' is a valid number or string that can be parsed
    if (
      typeof token.priceUSD !== 'string' ||
      isNaN(parseFloat(token.priceUSD))
    ) {
      throw new Error(
        `Invalid 'priceUSD' value for token: ${token.priceUSD}. Expected a numeric string.`,
      )
    }
  }

  /**
   * Validates that all tokens in the response have a priceUSD greater than the provided threshold.
   *
   * @param response - The API response containing token objects grouped by chainId.
   * @param priceThreshold - The price to compare against.
   * @returns `true` if all tokens meet the criteria, otherwise throws an error.
   */
  static async validateAllTokensAbovePrice(
    response: Record<string, any[]>,
    priceThreshold: number,
  ): Promise<void> {
    console.log(
      `Start validation if all tokens have price higher or equal to ${priceThreshold}`,
    )
    for (const chainId in response) {
      const tokens = response[chainId]
      for (const token of tokens) {
        const priceUSD = parseFloat(token.priceUSD)

        if (isNaN(priceUSD)) {
          throw new Error(
            `Invalid priceUSD value for token: ${JSON.stringify(token)}`,
          )
        }

        if (priceUSD <= priceThreshold) {
          throw new Error(
            `Validation failed: Token with address=${token.address} has priceUSD=${priceUSD}, which is not greater than ${priceThreshold}.`,
          )
        }
      }
    }

    console.log(`All tokens have priceUSD greater than ${priceThreshold}.`)
  }
}

export default TokensResponseValidator
