import { de } from "zod/v4/locales";

export const UNISWAP_metadata = {
  LOGO: 'https://app.uniswap.org/favicon.png',
  BRAND_COLOR: '#fef5fc',
  BRAND_SECONDARY_COLOR: '#f50db4',
  n: 'UNISWAP',
  t: 20,
  d: 'Returns Uniswap pools and tokens data',
  a: 'Retrieves Uniswap data for a given chain and address from Uniswap',
  p: [
    {
      name: 'graphType',
      detail: "Graph type to Query. Can be 'v3', 'v3-raw'",
      example: `"v3"`,
      require: 'm',
      type: 'string'
    },
    {
      name: 'category',
      detail: "Query type for the data. Can be 'tokens', 'markets'",
      example: `"tokens"`,
      require: 'm',
      type: 'string'
    },
    {
      name: 'param1',
      detail: 'Token Contract Address for market or Token symbol ',
      example: `"eth"`,
      require: 'm',
      type: 'string'
    },
            {
      name: 'columnsName',
      detail: 'Filter columns by name in output. Comma separated list.',
      example: `"id,address"`,
      require: 'o',
      type: 'string'
    }
  ],
  examples: [{
    title: 'UNISWAP',
    argumentString: '"v3", "tokens", "eth"',
    description: 'returns data for the ETH token from Uniswap V3.'
  },
  {
    title: 'UNISWAP',
    argumentString: '"v3-raw", "markets", "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8"',
    description: 'returns data for the Uniswap V3 market with the specified contract address.'
  }]
}
