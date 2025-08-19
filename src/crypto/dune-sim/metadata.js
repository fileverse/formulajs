import { SERVICES_API_KEY } from "../../utils/constants.js";

export const DUNESIM_metadata =   {
    API_KEY: SERVICES_API_KEY.DuneSim,
    LOGO: 'https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://docs.sim.dune.com&size=32',
    BRAND_COLOR: '#fef7f5',
    BRAND_SECONDARY_COLOR: '#f9ab99',
    n: 'DUNESIM',
    t: 20,
    d: "Query Sim APIs for blockchain activity and ownership data.",
    a: "Query Sim APIs for blockchain activity and ownership data.",
    p: [
      {
        name: 'type',
        detail: 'Query type. We support only `activity` for now.',
        example: `"activity"`,
        require: 'm',
        type: 'string'
      },
      {
        name: 'wallet',
        detail: 'Wallet to get activity for',
        example: `"vitalik.eth"`,
        require: 'm',
        type: 'string'
      }
    ]
}