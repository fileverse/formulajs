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
        }
    ]
}