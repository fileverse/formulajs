/* eslint-env mocha */
import { expect } from 'chai';
import sinon from 'sinon';
import { SAFE } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';
import * as isAddressUtil from '../../src/utils/is-address.js';
import * as fromEnsNameToAddressUtil from '../../src/utils/from-ens-name-to-address.js';

const API_KEY = 'safe-api-key';

describe('SAFE', function () {
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

  it('should return MISSING_PARAM if required args are not provided', async () => {
    const result = await SAFE();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.functionName).to.equal('SAFE');
  });

  it('should return MISSING_KEY if API key is missing', async () => {
    window.localStorage.getItem.returns(null);
    const result = await SAFE('0xabc', 'txns', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.message).to.include('Safe');
  });

  it('should return INVALID_PARAM if limit is not valid', async () => {
    const result = await SAFE('0xabc', 'txns', 'ethereum', -1);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('limit');
    expect(result.message).to.include(-1);
    expect(result.functionName).to.equal('SAFE');
  });

  it('should return INVALID_PARAM if offset is not valid', async () => {
    const result = await SAFE('0xabc', 'txns', 'ethereum', 10, -2);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('offset');
    expect(result.message).to.include(-2);
  });

  it('should return INVALID_PARAM if utility is not txns', async () => {
    const result = await SAFE('0xabc', 'unknown', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('utility');
    expect(result.message).to.include('unknown');
    expect(result.functionName).to.equal('SAFE');
  });

  it('should return MAX_PAGE_LIMIT if offset > limit', async () => {
    const result = await SAFE('0xabc', 'txns', 'ethereum', 300);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT);
  });

  it('should return INVALID_CHAIN if chain is not supported', async () => {
    const result = await SAFE('0xabc', 'txns', 'fakechain');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_CHAIN);
    expect(result.message).to.include('fakechain');
  });

  it('should return ENS error if ENS address resolution fails', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(false);
    sinon.stub(fromEnsNameToAddressUtil.default, 'fromEnsNameToAddress').resolves(null);

    const result = await SAFE('vitalik.eth', 'txns', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.ENS);
  });

  it('should return NETWORK_ERROR if fetch fails', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 500 });

    const result = await SAFE('0xabc', 'txns', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
  });

  it('should return CUSTOM error if response structure is unexpected', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ notResults: [] })
    });

    const result = await SAFE('0xabc', 'txns', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.CUSTOM);
  });

  it('should return DEFAULT error if fetch throws', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').rejects(new Error('Boom'));

    const result = await SAFE('0xabc', 'txns', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.reason.message).to.equal('Boom');
  });

  it('should return parsed transaction data on success', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({
        results: [
          { confirmations: [], dataDecoded: {}, hash: '0x1' },
          { confirmations: [], dataDecoded: {}, hash: '0x2' }
        ]
      })
    });

    const result = await SAFE('0xabc', 'txns', 'ethereum');
    expect(result).to.deep.equal([
      { hash: '0x1' },
      { hash: '0x2' }
    ]);
  });
});
