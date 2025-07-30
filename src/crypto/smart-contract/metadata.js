export const SMARTCONTRACT_metadata = {
    n: 'SMARTCONTRACT',
    t: 20,
    d: 'Query smart contracts in cells.',
    r: 'Call a read-only function on a given smart contract',
    p: [
        {
            name: 'contractName',
            detail: 'Name of the contract you want to pull data from',
            example: '"USDC"',
            require: 'm',
            type: 'string'
        },
        {
            name: 'functionName',
            detail: 'Name of the function you want to call from the give contract',
            example: '"balanceOf"',
            require: 'm',
            type: 'string'
        },
        {
            name: '...functionArgs',
            detail: 'Optional arguments to pass to the contract function.',
            example: '"0x50Aa3435E310d5a2d15a989Bc353ce7f5682E1d4"',
            require: 'o',
            type: 'any'
        }
    ]
}