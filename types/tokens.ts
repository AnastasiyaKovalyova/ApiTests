  export interface Token {
    chainId: number;
    address: string;
    symbol: string;
    coinKey?: string;
    logoURI?: string;
  }
  
  export  interface TokensApiResponse {
    tokens: Token[];
  }
  
  