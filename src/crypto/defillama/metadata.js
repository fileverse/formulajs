import { SERVICES_API_KEY } from '../../utils/constants.js'
export const DEFILLAMA_metadata = {
  API_KEY: SERVICES_API_KEY.Defillama,
  LOGO: 'https://defillama.com/favicon.ico',
  BRAND_COLOR: '#f8f5fc',
  BRAND_SECONDARY_COLOR: '#855dcd',
  n: 'DEFILLAMA',
  t: 20,
  d: 'Fetches content from Defillama.',
  a: 'Retrieves data from Defillama.',
  p: [
    {
      name: 'category',
      detail: "Type of content to fetch. Supports 'protocols', 'yields', 'dex', or 'fees'.",
      example: `"protocols"`,
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
  ]
}
