import { SERVICES_API_KEY } from "../../utils/constants.js";

export const DUNESIM_metadata = {
  API_KEY: SERVICES_API_KEY.DuneSim,
  LOGO: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://docs.sim.dune.com&size=32',
  BRAND_COLOR: '#fef7f5',
  BRAND_SECONDARY_COLOR: '#f9ab99',
  n: 'DUNESIM',
  t: 20,
  d: 'Query Sim APIs for blockchain activity, token prices, and token-holder data.',
  a: 'Query Sim APIs for blockchain activity, token prices, and token-holder data.',
  p: [
    {
      name: 'type',
      detail: 'Specify “price” to query token price info, “activity” for wallet activity, or “token_holders” for token-holder distribution.',
      example: `"price"`,
      require: 'm',
      type: 'string',
    },
    {
      name: 'input1',
      detail:
        'When type is "price": the chain ID or name to query token prices. When "activity": wallet address or ENS. When "token-holders": token address.',
      example: `"base"`,
      require: 'm',
      type: 'string',
    },
    {
      name: 'input2',
      detail:
        'When "price": optional historical price offsets. When "activity": optional chain ID or name ( e.g eth ). When "token-holders": chain ID or name ( e.g eth ).',
      example: `"1,6,24"`,
      require: 'o',
      type: 'string',
    },
    {
      name: 'input3',
      detail:
        'When "price": optional token contract address, when "activity": limit (1–100), when "token-holders": limit (1–500).',
      example: `"0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca"`,
      require: 'o',
      type: 'number',
    },
    {
      name: 'input4',
      detail: 'When "price": optional limit for results.',
      example: `5`,
      require: 'o',
      type: 'number',
    },
  ],
};
