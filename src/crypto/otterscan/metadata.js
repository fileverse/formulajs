export const OTTERSCAN_metadata = [
  {
    t: 20,
    // Otterscan does NOT need an API key
    API_KEY: null,
    LOGO: 'https://hoodi.otterscan.io/favicon.ico',
    BRAND_COLOR: '#3498DB',
    n: 'OTS_SEARCH_TRANSACTIONS_BEFORE',
    d: 'Returns blockchain transaction history backward from a block (or latest) for transactions that involve a given address.',
    p: [
      {
        name: 'endpoint',
        details: 'The RPC URL of the backend Erigon node',
        example: '"http://localhost:8545"',
        required: 'm',
        type: 'string'
      },
      {
        name: 'address',
        details: 'The ETH address to be searched.',
        example: '"0xC0a47dFe034B400B47bDaD5FecDa2621de6c4d95"',
        required: 'm',
        type: 'string'
      },
      {
        name: 'blockNumber',
        details:
          'Block number to start searching before. Use 0 to start from the most recent block.',
        example: '0',
        required: 'm',
        type: 'number'
      },
      {
        name: 'pageSize',
        details: 'How many transactions to return (page size). More transactions than this may be returned.',
        example: '25',
        required: 'm',
        type: 'number'
      }
    ]
  },
  {
    t: 20,
    API_KEY: null,
    LOGO: 'https://hoodi.otterscan.io/favicon.ico',
    BRAND_COLOR: '#3498DB',
    n: 'OTS_SEARCH_TRANSACTIONS_AFTER',
    d: 'Returns blockchain transaction history forward from a block (or genesis) for transactions that involve a given address.',
    p: [
      {
        name: 'endpoint',
        details: 'The RPC URL of the backend Erigon node',
        example: '"http://localhost:8545"',
        required: 'm',
        type: 'string'
      },
      {
        name: 'address',
        details: 'The ETH address to be searched.',
        example: '"0xC0a47dFe034B400B47bDaD5FecDa2621de6c4d95"',
        required: 'm',
        type: 'string'
      },
      {
        name: 'blockNumber',
        details:
          'Block number to start searching after. Use 0 to start from the genesis block.',
        example: '0',
        required: 'm',
        type: 'number'
      },
      {
        name: 'pageSize',
        details: 'How many transactions to return (page size). More transactions than this may be returned.',
        example: '25',
        required: 'm',
        type: 'number'
      }
    ]
  }
];
