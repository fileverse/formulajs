export const PRICE_metadata = {
    n: 'PRICE',
    t: 20,
    d: 'Query prices of crypto assets',
    r: 'Query prices of crypto assets.',
    p: [
        {
            name: 'input1',
            detail: 'Token address or comma separated coin symbols',
            example: '"0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca"',
            require: 'm',
            type: 'string'
        },
        {
            name: 'input2',
            detail: 'Single chain for token addresses, Comma separated timeframe in hours for coin symbol. Optional for coin symbols',
            example: '"base"',
            require: 'o',
            type: 'string'
        },
        {
            name: 'input3',
            detail: 'Comma separated timeframe for token address, Skip for coin symbol',
            example: '"1,24"',
            require: 'o',
            type: 'any'
        }
    ]
}