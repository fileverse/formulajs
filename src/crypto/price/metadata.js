export const PRICE_metadata = {
    n: 'PRICE',
    t: 20,
    d: 'Query prices of crypto assets',
    r: 'Query prices of crypto assets.',
    p: [
        {
            name: 'input1',
            detail: 'Token address or comma separated coin symbols',
            example: '"btc,eth"',
            require: 'm',
            type: 'string'
        },
        {
            name: 'input2',
            detail: 'Single chain for token addresses, Comma separated timeframe in hours for coin symbol. Optional for coin symbols',
            example: '"720,1,24"',
            require: 'o',
            type: 'string'
        },
        {
            name: 'input3',
            detail: 'Comma separated timeframe for token address, Skip for coin symbol',
            example: '"720,1,24"',
            require: 'o',
            type: 'any'
        }
    ]
}