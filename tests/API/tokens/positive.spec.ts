import { test, APIRequestContext } from '@playwright/test';
import API from '../../../utils/api-utils';
import chainTypes from '../../../data/tokens/inputData/chain-types.json';
import chains from '../../../data/tokens/chains.json';
import priceUSDData from '../../../data/tokens/inputData/min-price-usd.json';
import { tokens } from '../../../utils/api-endpoints';
import TokensResponseValidator  from '../../../classes/TokensResponseValidator';
import ResponseValidator from '../../../classes/ResponseValidator';
import responseChains from '../../../data/tokens/outputData/responseChains.json';

test.describe.parallel('GET /tokens POSITIVE API tests', () => {
    let requestContext: APIRequestContext;
    let api:API;

    test.beforeEach(async ({ playwright }) => {
        // Initialize the request context
        requestContext = await playwright.request.newContext({
          baseURL: process.env.BASE_URL || 'https://li.quest/v1',
          extraHTTPHeaders: {
           // "x-lifi-api-key": process.env.X_LIFI_API_KEY || "",
            "Content-Type": "application/json",
          },
        });

        // Pass the request context to the API helper
    api = new API(requestContext, process.env.BASE_URL || 'https://li.quest/v1');
    });
 

    test.afterAll(async () => {
        // Dispose of the request context
        await requestContext.dispose();
    });

    test('GET /tokens when no query parameters are provided', async () => {
        const response = await api.getRequest(tokens.get);
        const responseBody = await response.json();

        await ResponseValidator.validateStatusCode(response, 200);

        // Validate chains in the response
        await TokensResponseValidator.validateChainsInResponse(responseBody, responseChains.supported);

        //validate the tokens and their properties for each chain in the response
        await TokensResponseValidator.validateTokensByChain(responseBody, responseChains.supported)
    });

    test('GET /tokens when all query parameters are provided', async () => {
        const combinedChainTypes = chainTypes.supported.join(",");
        const combinedChains = Object.values(chains.supported).join(",");
        const validPrice = priceUSDData.validMinPriceUSD[0];

        const response = await api.getRequest(
            tokens.get, 
            { chainTypes: combinedChainTypes, chains: combinedChains, minPriceUSD: validPrice }
            );
        const responseBody = await response.json();
        await ResponseValidator.validateStatusCode(response, 200);

        // Validate chains in the response
        await TokensResponseValidator.validateChainsInResponse(responseBody, responseChains.supported);

        //validate the tokens and their properties for each chain in the response
        await TokensResponseValidator.validateTokensByChain(responseBody, responseChains.supported)
    });

    test('GET /tokens for case sensitive chainTypes ', async () => {
      const combinedChainTypes = chainTypes.caseSensitive.join(",");

      const response = await api.getRequest(
          tokens.get, 
          { chainTypes: combinedChainTypes }
          );
      const responseBody = await response.json();

      await ResponseValidator.validateStatusCode(response, 200);

      // Validate chains in the response
      await TokensResponseValidator.validateChainsInResponse(responseBody, responseChains.supported);

      //validate the tokens and their properties for each chain in the response
      await TokensResponseValidator.validateTokensByChain(responseBody, responseChains.supported)
    });

    test(`GET /tokens when providing all supported chainTypes`, async () => {
       const combinedChainTypes = chainTypes.supported.join(",");
       await console.log(`GET all tokens for chainTypes: ${combinedChainTypes}`);
 
       const response = await api.getRequest(tokens.get, { chainTypes: combinedChainTypes });
       const responseBody = await response.json();
 
       // Validate successful status code
       await ResponseValidator.validateStatusCode(response, 200);

       // Validate token groups and properties
       await TokensResponseValidator.validateTokensByChain(responseBody, responseChains.supported);
    });

    test(`GET /tokens when providing all supported chains`, async () => {
        // Combine all valid chains into a single query parameter
       const combinedChains = Object.values(chains.supported).join(",");
       await console.log(`GET all tokens for chains: ${combinedChains}`);
 
       const response = await api.getRequest(tokens.get, { chains: combinedChains });
       const responseBody = await response.json();
 
       // Validate successful status code
       await ResponseValidator.validateStatusCode(response, 200);

       // Validate token groups and properties
       await TokensResponseValidator.validateTokensByChain(responseBody, responseChains.supported);
    });

    test('GET /tokens with providing valid minPriceUSD', async () => {
        const validPrice = priceUSDData.validMinPriceUSD[0];
        const response = await api.getRequest(tokens.get, { minPriceUSD: validPrice });
        const responseBody = await response.json();
    
        // Validate successful status code
       await ResponseValidator.validateStatusCode(response, 200);

       //Validate all tokens prices are above the threshold price
       await TokensResponseValidator.validateAllTokensAbovePrice(responseBody.tokens, validPrice);
    });

    test('GET /tokens when providing duplicated chainTypes', async () => {
       // Combine all valid chain types into a single query parameter
       const duplicatedChainTypes = chainTypes.duplicated.join(",");
       await console.log(`GET all tokens for chainType: ${duplicatedChainTypes}`);
 
       const response = await api.getRequest(tokens.get, { chainTypes: duplicatedChainTypes });
       const responseBody = await response.json();
 
       // Validate successful status code
       await ResponseValidator.validateStatusCode(response, 200);

       // Validate token groups and properties
       await TokensResponseValidator.validateTokensByChain(responseBody, responseChains.supported);
    });

    test(`GET /tokens when providing duplicated chains`, async () => {
        // Combine all valid chains into a single query parameter
       const duplicatedChains = Object.values(chains.duplicated).join(",");
       await console.log(`GET all tokens for chains=${duplicatedChains}`);
 
       const response = await api.getRequest(tokens.get, { chains: duplicatedChains });
       const responseBody = await response.json();
 
       // Validate successful status code
       await ResponseValidator.validateStatusCode(response, 200);

       // Validate chains in the response
       await TokensResponseValidator.validateChainsInResponse(responseBody, responseChains.supported);

       //Not sure if we expect this to pass!
       await TokensResponseValidator.validateTokensByChain(responseBody, responseChains.supported);
    });

    Object.entries(chains.supported).forEach(([chainName, chainId]) => {
        test(`GET /tokens for a single chain with name ${chainName} and id ${chainId}.`, async () => {
            await console.log(`GET all tokens for chainId=${chainId}`);
      
            const response = await api.getRequest(tokens.get, { chains: chainId });
            const responseBody = await response.json();
            
      
            // Validate successful response
            await ResponseValidator.validateStatusCode(response, 200);

            // Validate token groups and properties
            await TokensResponseValidator.validateTokensByChain(responseBody, { [chainName]: chainId });
          });  
    });

    chainTypes.supported.forEach(chainType => {
        test(`GET tokens for a single chainType: ${chainType}`, async () => {
            console.log(`GET all tokens for chainType=${chainType}`);
      
            const response = await api.getRequest(tokens.get, { chainTypes: chainType });
            const responseBody = await response.json();
      
            // Validate successful response
            await ResponseValidator.validateStatusCode(response, 200);

            // Validate token groups and properties
            await TokensResponseValidator.validateTokensByChain(responseBody, responseChains.supported);
          });
    });
})


