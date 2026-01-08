export const BLOCKSCOUT_metadata = {
  LOGO: 'https://cdn.prod.website-files.com/65f94dfd53db8b337c808067/68485baa72714ae58f350ce2_bs-logo.png',
  BRAND_COLOR: '#f8f8fd',
  BRAND_SECONDARY_COLOR: '#5353D3',
  n: 'BLOCKSCOUT',
  t: 20,
  d: 'Returns the onchain information about an address on a provided blockchain. By default on Ethereum mainnet.',
  a: 'Returns the onchain information about an address on a provided blockchain. By default on Ethereum mainnet.',
  p: [
    {
      name: 'address',
      detail: 'The address string representing the addresses to check for balance',
      example: `"vitalik.eth"`,
      require: 'm',
      type: 'string'
    },
    {
      name: 'type',
      detail: 'The type of data to query.',
      example: `"txns"`,
      require: 'm',
      type: 'string'
    },
    {
      name: 'chain',
      detail: 'The blockchain to query. By default on Ethereum mainnet. Can be gnosis, arbitrum, optimism, soneium, unichain  ',
      example: `"ethereum"`,
      require: 'o',
      type: 'string'
    },
    {
      name: 'startTimestamp',
      detail: 'Start date marking the start of the transaction search range. Work with type === "txns"',
      example: `"01/01/2023"`,
      require: 'o',
      type: 'string'
    },
    {
      name: 'endTimestamp',
      detail: 'End date marking the end of the transaction search range. Work with type === "txns"',
      example: `"01/05/2024"`,
      require: 'o',
      type: 'string'
    },
    {
      name: 'page',
      detail: 'The page number to return. Work with type === "txns"',
      example: '1',
      require: 'o',
      repeat: 'n',
      type: 'rangenumber'
    },
    {
      name: 'offset',
      detail: 'The number of transactions to return per page. Work with type === "txns"',
      example: '2',
      require: 'o',
      repeat: 'n',
      type: 'rangenumber'
    }
  ],
  examples: [{
    title: 'BLOCKSCOUT',
    argumentString: '"vitalik.eth", "txns", "ethereum", \"01/01/2023\", \"01/05/2024\", 1, 2',
    description: 'returns transaction history for the address vitalik.eth on the Ethereum blockchain between January 1, 2023 and January 5, 2024, returning page 1 with 2 transactions per page.'
  }, {
    title: 'BLOCKSCOUT',
    argumentString: '"vitalik.eth", "balance", "gnosis"',
    description: 'returns the balance for the address vitalik.eth on the Gnosis blockchain.'
  }]
}
