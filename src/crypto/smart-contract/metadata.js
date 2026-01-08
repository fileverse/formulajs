export const SMARTCONTRACT_metadata = {
    n: 'SMARTCONTRACT',
    t: 20,
    d: 'Query smart contract in cells. Returning a list of available functions and arguments that you can use to get data.',
    r: 'Query smart contract in cells. Returning a list of available functions and arguments that you can use to get data.',
    p: [
        {
            name: 'contract_address',
            detail: 'Address of the contract you want to query',
            example: '"0x9C58BAcC331c9aa871AFD802DB6379a98e80CEdb"',
            require: 'm',
            type: 'string'
        },
        {
            name: 'chain',
            detail: 'Blockchain network(s) to query. Supported values: "ethereum", "gnosis", "base". Accepts comma-separated values.',
            example: '"GNOSIS"',
            require: 'm',
            type: 'string'
        }
    ],
    examples: [{
        title: 'SMARTCONTRACT',
        argumentString: '"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", "ETHEREUM"',
        description: 'returns the list of functions and their arguments for Circle USDC contract on Ethereum.'
    },
    {
        title: 'SMARTCONTRACT',
        argumentString: '"0xdac17f958d2ee523a2206206994597c13d831ec7", "ETHEREUM"',
        description: 'returns the list of functions and their arguments for Tether USD (USDT) contract on Ethereum.'
    }]
}