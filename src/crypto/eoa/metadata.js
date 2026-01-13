import { de } from 'zod/v4/locales'
import { SERVICES_API_KEY } from '../../utils/constants.js'

export const EOA_metadata = {
  API_KEY: SERVICES_API_KEY.Etherscan,
  LOGO: 'https://raw.githubusercontent.com/ethereum/ethereum-org/master/dist/favicon.ico',
  BRAND_COLOR: '#F6F7F8',
  BRAND_SECONDARY_COLOR: '#21325B',
  n: 'EOA',
  t: 20,
  d: 'Fetches address data like transactions, balances, or portfolio info from multiple supported chains.',
  a: 'Dynamically queries blockchain data such as transactions and balances by resolving time ranges to block ranges and supporting pagination.',
  p: [
    {
      name: 'addresses',
      detail: 'One or more addresses (comma-separated) to query.',
      example: `"vitalik.eth"`,
      require: 'm',
      type: 'string'
    },
    {
      name: 'categories',
      detail: `Type of data to fetch. Supported values: "txns", "balance".`,
      example: `"txns"`,
      require: 'm',
      type: 'string'
    },
    {
      name: 'chain',
      detail: `Blockchain network(s) to query. Supported values: "ethereum", "gnosis", "base". Accepts comma-separated values.`,
      example: `"ethereum"`,
      require: 'm',
      type: 'string'
    },
    {
      name: 'startTime',
      detail: 'Used to calculate starting block for transaction queries.',
      example: `"01/01/2024"`,
      require: 'm',
      type: 'string'
    },
    {
      name: 'endTime',
      detail: 'Used to calculate ending block for transaction queries.',
      example: `"01/06/2024"`,
      require: 'm',
      type: 'string'
    },
    {
      name: 'page',
      detail: "The page number for paginated transaction results. Only used when category is 'txns'. Default is 1",
      example: '1',
      require: 'o',
      type: 'number'
    },
    {
      name: 'offset',
      detail: "The number of results to return per page (limit). Only used when category is 'txns'. Default is 10",
      example: '10',
      require: 'o',
      type: 'number'
    },
            {
      name: 'columnsName',
      detail: 'Filter columns by name in output. Comma separated list.',
      example: `"address,blockNumber"`,
      require: 'o',
      type: 'string'
    }
  ],
  examples: [{
    title: 'EOA',
    argumentString: '"vitalik.eth", "txns", "ethereum", \"01/01/2023\", \"01/05/2024\", 1, 2',
    description: 'returns the transaction history for the address vitalik.eth on the Ethereum blockchain between January 1, 2023 and January 5, 2024, returning page 1 with 2 transactions per page.'
  }, {
    title: 'EOA',
    argumentString: '"vitalik.eth", "balance", "gnosis"',
    description: 'returns the balance for the address vitalik.eth on the Gnosis blockchain.'
  }]
}
