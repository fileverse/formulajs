import { expect } from 'chai'

import { SMARTCONTRACT } from '../../src/crypto.js'

describe('SMARTCONTRACT', () => {
  it('should return contractName, functionName and args', () => {
    const result = SMARTCONTRACT('MyContract', 'myFunc', 1, 2, 3, 4)
    expect(result).to.deep.equal({
      callSignature: ['MyContract', 'myFunc', 1, 2, 3, 4],
      responseType: 'smart-contract'
    })
  })
})
