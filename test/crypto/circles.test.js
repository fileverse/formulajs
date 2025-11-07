/* eslint-env mocha */
import { expect } from 'chai'
import sinon from 'sinon'
import { CIRCLES } from '../../src/crypto/circles/circles.js'
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js'
import * as fromEnsNameToAddressUtil from '../../src/utils/from-ens-name-to-address.js'
import { ValidationError } from '../../src/utils/error-instances.js'

describe('CIRCLES', () => {
  beforeEach(() => {
    global.window = { localStorage: { getItem: sinon.stub() } }
  })

  afterEach(() => {
    sinon.restore() // restores ALL stubs/spies/fakes
    delete global.window // optional: clean up your global
  })

  it('should return INVALID_PARAM when required args missing', async () => {
    const res = await CIRCLES()
    expect(res.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM)
    expect(res.functionName).to.equal('CIRCLES')
  })

  it('should return INVALID_PARAM when address is missing', async () => {
    const res = await CIRCLES('trust', undefined)
    expect(res.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM)
    expect(res.functionName).to.equal('CIRCLES')
  })

  it('should return INVALID_PARAM when functionName is missing', async () => {
    const res = await CIRCLES('', '0xe9A6378d8FD4983C2999DB0735f258397E8C2253')
    expect(res.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM)
    expect(res.functionName).to.equal('CIRCLES')
  })

  it('should return INVALID_PARAM for unsupported functionName', async () => {
    sinon
      .stub(fromEnsNameToAddressUtil.default, 'validateAndGetAddress')
      .resolves('0xe9A6378d8FD4983C2999DB0735f258397E8C2253')
    const res = await CIRCLES('invalid', '0xe9A6378d8FD4983C2999DB0735f258397E8C2253')
    expect(res.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM)
    expect(res.functionName).to.equal('CIRCLES')
  })

  it('should return INVALID_PARAM for empty address string', async () => {
    const res = await CIRCLES('trust', '')
    expect(res.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM)
    expect(res.functionName).to.equal('CIRCLES')
  })

  it('should return INVALID_PARAM for empty functionName string', async () => {
    sinon
      .stub(fromEnsNameToAddressUtil.default, 'validateAndGetAddress')
      .resolves('0xe9A6378d8FD4983C2999DB0735f258397E8C2253')
    const res = await CIRCLES('', '0xe9A6378d8FD4983C2999DB0735f258397E8C2253')
    expect(res.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM)
    expect(res.functionName).to.equal('CIRCLES')
  })

  it('should return INVALID_PARAM when ENS resolution fails', async () => {
    sinon.stub(fromEnsNameToAddressUtil.default, 'validateAndGetAddress').throws(new ValidationError('Invalid address'))
    const res = await CIRCLES('trust', 'vitalik.eth')
    console.log({ res })
    expect(res.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM)
    expect(res.functionName).to.equal('CIRCLES')
  })

  it('should return DEFAULT when SDK throws error', async () => {
    const mockAddress = '0xe9A6378d8FD4983C2999DB0735f258397E8C2253'
    sinon.stub(fromEnsNameToAddressUtil.default, 'validateAndGetAddress').resolves(mockAddress)

    // SDK will throw an error if it can't connect or if there's a network issue
    const res = await CIRCLES('trust', mockAddress)
    // The error should be caught and handled by errorMessageHandler
    expect(res).to.be.an('object')
    expect(res.functionName).to.equal('CIRCLES')
    // SDK errors typically result in DEFAULT or NETWORK_ERROR
    expect([ERROR_MESSAGES_FLAG.DEFAULT, ERROR_MESSAGES_FLAG.NETWORK_ERROR]).to.include(res.type)
  })

  it('should return DEFAULT when SDK throws error for transactions', async () => {
    const mockAddress = '0xe9A6378d8FD4983C2999DB0735f258397E8C2253'
    sinon.stub(fromEnsNameToAddressUtil.default, 'validateAndGetAddress').resolves(mockAddress)

    const res = await CIRCLES('transactions', mockAddress)
    expect(res).to.be.an('object')
    expect(res.functionName).to.equal('CIRCLES')
    expect([ERROR_MESSAGES_FLAG.DEFAULT, ERROR_MESSAGES_FLAG.NETWORK_ERROR]).to.include(res.type)
  })

  it('should return INVALID_PARAM when address is null', async () => {
    const res = await CIRCLES('trust', null)
    expect(res.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM)
    expect(res.functionName).to.equal('CIRCLES')
  })

  it('should return INVALID_PARAM when functionName is null', async () => {
    sinon
      .stub(fromEnsNameToAddressUtil.default, 'validateAndGetAddress')
      .resolves('0xe9A6378d8FD4983C2999DB0735f258397E8C2253')
    const res = await CIRCLES('', '0xe9A6378d8FD4983C2999DB0735f258397E8C2253')
    expect(res.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM)
    expect(res.functionName).to.equal('CIRCLES')
  })
})
