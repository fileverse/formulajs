/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { EOA } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';
import * as isAddressUtil from '../../src/utils/is-address.js';
import * as fromEnsNameToAddressUtil from '../../src/utils/from-ens-name-to-address.js';
import * as fromTimeStampToBlockUtil from '../../src/utils/from-timestamp-to-block.js';

const API_KEY = 'test-api-key';

describe('EOA', function () {
  this.timeout(5000);

  beforeEach(() => {
    global.window = {
      localStorage: {
        getItem: sinon.stub().returns(API_KEY)
      }
    };
    global.fetch = () => {};
  });

  afterEach(() => {
    sinon.restore();
    delete global.window;
    delete global.fetch;
  });

  it('should return MISSING_PARAM if required params are missing', async () => {
    const result = await EOA();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.functionName).to.equal('EOA');
  });

  it('should return MAX_PAGE_LIMIT error if offset > 250', async () => {
    const result = await EOA('0xabc', 'txns', 'ethereum', '2023-01-01', '2024-01-01', 1, 9999);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT);
    expect(result.functionName).to.equal('EOA');
  });

  it('should return MISSING_KEY error if no API key found', async () => {
    global.window.localStorage.getItem.returns(null);
    const result = await EOA('0xabc', 'balance', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.functionName).to.equal('EOA');
  });

  it('should return INVALID_PARAM error for ENS name resolution failure', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(false);
    sinon.stub(fromEnsNameToAddressUtil.default, 'fromEnsNameToAddress').rejects();

    const result = await EOA('vitalik.eth', 'balance', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('addresses');
  });

  it('should return INVALID_CHAIN error for unsupported chain', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    const result = await EOA('0xabc', 'balance', 'unsupportedChain');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_CHAIN);
  });

  it('should return INVALID_PARAM for unsupported category', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    const result = await EOA('0xabc', 'invalid-category', 'ethereum', '2023-01-01', '2024-01-01');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('category');
  });

  it('should fetch balance data and resolve ENS correctly', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(false);
    sinon.stub(fromEnsNameToAddressUtil.default, 'fromEnsNameToAddress').resolves('0xResolved');
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: [{ token: 'ETH', balance: '1000' }] })
    });

    const result = await EOA('vitalik.eth', 'balance', 'ethereum');
    expect(result[0]).to.include({ token: 'ETH', balance: '1000' });
  });

  it('should fetch txns data and convert timestamps to blocks', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(fromTimeStampToBlockUtil.default, 'fromTimeStampToBlock')
      .onFirstCall().resolves('123')
      .onSecondCall().resolves('456');

    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: [{ txHash: '0x1' }] })
    });

    const result = await EOA('0xabc', 'txns', 'ethereum', '2023-01-01', '2024-01-01');
    expect(result[0]).to.include({ txHash: '0x1' });
  });

  it('should return NETWORK_ERROR if fetch fails', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(fromTimeStampToBlockUtil.default, 'fromTimeStampToBlock').resolves('123');
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 500 });

    const result = await EOA('0xabc', 'txns', 'ethereum', '2023-01-01', '2024-01-01');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
    expect(result.functionName).to.equal('EOA')
  });

  it('should return INVALID_API_KEY if result contains error message', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(fromTimeStampToBlockUtil.default, 'fromTimeStampToBlock').resolves('123');
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: 'Invalid API Key' })
    });

    const result = await EOA('0xabc', 'txns', 'ethereum', '2023-01-01', '2024-01-01');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_API_KEY);
  });

  it('should return DEFAULT if fetch throws', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(fromTimeStampToBlockUtil.default, 'fromTimeStampToBlock').resolves('123');
    sinon.stub(global, 'fetch').rejects(new Error('boom'));

    const result = await EOA('0xabc', 'txns', 'ethereum', '2023-01-01', '2024-01-01');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.reason.message).to.equal('boom');
  });
  it('should process multiple chains and multiple addresses', async () => {

  sinon.stub(isAddressUtil.default, 'isAddress')
    .onFirstCall().returns(true)  // 0xabc
    .onSecondCall().returns(false); // vitalik.eth

  sinon.stub(fromEnsNameToAddressUtil.default, 'fromEnsNameToAddress')
    .resolves('0xresolved');

sinon.stub(fromTimeStampToBlockUtil.default, 'fromTimeStampToBlock')
  .onCall(0).resolves('1000')
  .onCall(1).resolves('2000')
  .onCall(2).resolves('3000')
  .onCall(3).resolves('4000');


  sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({
      result: [
        { hash: '0x1' },
        { hash: '0x2' }
      ]
    })
  });

  const result = await EOA('0xabc,vitalik.eth', 'txns', 'ethereum,base', '01/01/2023', '01/01/2023');
  expect(result).to.be.an('array');
  expect(result.length).to.equal(8); // 2 addresses × 2 chains
  expect(result[0].chain).to.equal('ethereum');
  expect(result[4].chain).to.equal('base');
  expect(result[1].address).to.equal('0xabc');
  expect(result[2].name).to.equal('vitalik.eth');
});

});
