export const CIRCLES_metadata = {
  LOGO: 'https://avatars.githubusercontent.com/u/159135534?s=200&v=4',
  n: 'CIRCLES',
  t: 20,
  d: 'Query the list of transactions performed by a Circles address, with optional pagination.',
  a: 'Query the list of transactions performed by a Circles address, with optional pagination.',
  p: [
    {
      name: 'functionName',
      detail: "The function name to query, supported values: 'trust', 'profile', 'transactions', 'balances'.",
      example: `"trust"`,
      require: 'm'
    },
    {
      name: 'address',
      detail: 'The address to query, in hexadecimal format.',
      example: `"0xe9A6378d8FD4983C2999DB0735f258397E8C2253"`,
      require: 'm'
    },
    {
      name: 'entries',
      detail: 'The number of entries to return. Default is 10.',
      example: `10`,
      require: 'o',
      type: 'number'
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
    title: 'CIRCLES',
    argumentString: '"trust", "0xe9A6378d8FD4983C2999DB0735f258397E8C2253"',
    description: 'returns the trust relationships for the specified Circles address.'
  }, {
    title: 'CIRCLES',
    argumentString: '"transactions", "0xe9A6378d8FD4983C2999DB0735f258397E8C2253", 5',
    description: 'returns the last 5 transactions for the specified Circles address.'
  }]
}
