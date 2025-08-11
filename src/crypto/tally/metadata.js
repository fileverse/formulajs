export const TALLY_metadata = {
  LOGO: "https://www.tally.xyz/favicon.ico",
  BRAND_COLOR: "#f9f8ff",
  BRAND_SECONDARY_COLOR: "#725bff",
  n: 'TALLY',
  t: 20,
  d: 'Query data from Tally',
  a: 'Query data from Tally',
  p: [
    {
      name: 'query',
      detail: "The type of Tally query you want to execute. We currently support only organization and proposal.",
      example: `"organization"`,
      require: 'm',
      type: 'string'
    },
    {
      name: 'input1',
      detail: "Query input. We currently support only organisation slug e.g aave, uniswap, compound, zksync etc...",
      example: `"arbitrum"`,
      require: 'm',
      type: 'string'
    },
  ]
}
