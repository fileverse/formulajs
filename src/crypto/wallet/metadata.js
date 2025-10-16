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
            detail: 'Comma separated timeframe in hours. Only applies for "txns" queries, if not provided it fetches transaction from latest block.',
            example: '"17520"',
            require: 'm',
            type: 'string'
        },
    ]
}