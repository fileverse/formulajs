import { de } from "zod/v4/locales";

export const WALLET_metadata = {
    n: 'WALLET',
    t: 20,
    d: 'Query wallet balance and transactions',
    r: 'Query wallet balance and transactions',
    p: [
        {
            name: 'addresses',
            detail: 'Comma separated addresses / ens',
            example: '"vitalik.eth, 0xfA0253943c3FF0e43898cba5A7a0dA9D17C27995"',
            require: 'm',
            type: 'string'
        },
        {
            name: 'chain',
            detail: 'Comma separated chains',
            example: '"ethereum, base"',
            require: 'm',
            type: 'any'
        },
        {
            name: 'query',
            detail: 'Type of query, can be "txns" or "balance"',
            example: '"txns"',
            require: 'm',
            type: 'string'
        },
        {
            name: 'timeframe',
            detail: 'Comma-separated timeframes in hours. Defaults to latest block for “txns” and latest balance for “balance”',
            example: '"17520"',
            require: 'o',
            type: 'string'
        },
    ],
    examples: [{
    title: 'WALLET',
    argumentString: '"0x7FD624f3f97A7dd36195E8379F28dB6147C270ff", "ethereum", "txns", "17520"',
    description: 'returns transactions for the specified wallet address on the Ethereum chain within the last 17520 hours (approximately 2 years).'
  },
  {
    title: 'WALLET',
    argumentString: '"vitalik.eth", "base", "balance"',
    description: 'returns the latest balance for the address vitalik.eth on the Base chain.'
  }]
}