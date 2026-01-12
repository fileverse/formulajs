export const YIELD_metadata = {
  n: 'YIELD',
  t: 20,
  d: 'Query yields',
  r: 'Query yields',
  p: [
    {
      name: 'category',
      detail: "Yield category to be fetch. Can be 'all' or 'stablecoins'",
      example: `"stablecoins"`,
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
    title: 'YIELD',
    argumentString: '"stablecoins"',
    description: 'returns yield data for stablecoins.'
  }, {
    title: 'YIELD',
    argumentString: '"all"',
    description: 'returns yield data for all categories.'
  }]
}