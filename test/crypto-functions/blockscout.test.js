/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { BLOCKSCOUT } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';
import * as fromEnsNameToAddress from '../../src/utils/from-ens-name-to-address.js';
import * as isAddressModule from '../../src/utils/is-address.js';

describe('BLOCKSCOUT', function () {
  this.timeout(5000);

  beforeEach(() => {
    global.window = {
      localStorage: {
        getItem: sinon.stub()
      }
    };
    global.fetch = () => {};
    global.document = {
    createElement: () => ({ set src(_) {}, set onload(_) {}, set onerror(_) {} }),
    head: { appendChild: () => {} }
  };
  });

  afterEach(() => {
    sinon.restore();
    delete global.window;
    delete global.fetch;
    delete global.document;
  });

  it('should return missing param error if address or type is missing', async () => {
    const result = await BLOCKSCOUT();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.functionName).to.equal('BLOCKSCOUT');
  });

  it('should return MAX_PAGE_LIMIT error if offset > MAX_PAGE_LIMIT', async () => {
    const result = await BLOCKSCOUT('0xabc', 'txns', 'ethereum', null, null, 1, 10000);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT);
    expect(result.functionName).to.equal('BLOCKSCOUT');
  });

  it('should return INVALID_CHAIN error if chain is not supported', async () => {
sinon.stub(isAddressModule.default, 'isAddress').returns(true);
    const result = await BLOCKSCOUT('0xabc', 'txns', 'fakechain');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_CHAIN);
    expect(result.message).to.include('fakechain');
    expect(result.functionName).to.equal('BLOCKSCOUT');
  });

  it('should return INVALID_PARAM if type is unsupported', async () => {
sinon.stub(isAddressModule.default, 'isAddress').returns(true);
    const result = await BLOCKSCOUT('0xabc', 'invalid', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('type');
    expect(result.message).to.include('invalid');
    expect(result.functionName).to.equal('BLOCKSCOUT');
  });

  it('should resolve ENS name to address and return ENS error if resolution fails', async () => {
    sinon.stub(isAddressModule.default, 'isAddress').returns(false);
    sinon.stub(fromEnsNameToAddress.default, 'fromEnsNameToAddress').resolves(null);

    const result = await BLOCKSCOUT('vitalik.eth', 'txns', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.ENS);
    expect(result.functionName).to.equal('BLOCKSCOUT');
  });

  it('should resolve ENS name to address and fetch data if valid', async () => {
    sinon.stub(isAddressModule.default, 'isAddress').returns(false);
    sinon.stub(fromEnsNameToAddress.default, 'fromEnsNameToAddress').resolves('0xResolved');

    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: [] })
    });

    const result = await BLOCKSCOUT('vitalik.eth', 'tokens', 'ethereum');
    expect(result).to.deep.equal([]);
  });

  it('should return NETWORK_ERROR if fetch fails with non-ok response', async () => {
    sinon.stub(isAddressModule.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: false,
      status: 503
    });

    const result = await BLOCKSCOUT('0xabc', 'txns', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
    expect(result.message).to.include('503');
    expect(result.functionName).to.equal('BLOCKSCOUT');
  });

  it('should return DEFAULT error if fetch throws', async () => {
    sinon.stub(isAddressModule.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').rejects(new Error('Boom'));

    const result = await BLOCKSCOUT('0xabc', 'txns', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.reason.message).to.equal('Boom');
    expect(result.functionName).to.equal('BLOCKSCOUT');
  });

  it('should return result directly for stat type', async () => {
    sinon.stub(isAddressModule.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ transactions_count: '1' })
    });

    const result = await BLOCKSCOUT('0xabc', 'stat', 'ethereum');
    expect(result).to.deep.equal([{ transactions_count: '1' }]);
  });

  it('should return custom error if result includes "Invalid parameter(s)"', async () => {
    sinon.stub(isAddressModule.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: 'Invalid parameter(s)' })
    });

    const result = await BLOCKSCOUT('0xabc', 'txns', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.CUSTOM);
    expect(result.message).to.equal('Invalid parameters');
  });

  it('should return custom error if result includes "Not found"', async () => {
    sinon.stub(isAddressModule.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: 'Not found' })
    });

    const result = await BLOCKSCOUT('0xabc', 'txns', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.CUSTOM);
    expect(result.message).to.equal('Address information not found');
  });


it('should convert date strings to valid UNIX timestamps', async () => {
  sinon.stub(isAddressModule.default, 'isAddress').returns(true);
  const fetchStub = sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({ result: [] })
  });

  await BLOCKSCOUT('0xabc', 'txns', 'ethereum', '01/01/2023', '01/01/2024');

  const url = new URL(fetchStub.firstCall.args[0]);
  expect(parseInt(url.searchParams.get('start_timestamp'))).to.be.a('number');
  expect(parseInt(url.searchParams.get('end_timestamp'))).to.be.a('number');
});

  it('should default chain to "ethereum" when not provided', async () => {
  sinon.stub(isAddressModule.default, 'isAddress').returns(true);
  const fetchStub = sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({ result: [] })
  });

  await BLOCKSCOUT('0xabc', 'txns');

  const url = new URL(fetchStub.firstCall.args[0]);
  expect(url.hostname).to.include('eth.blockscout.com');
});

it('should include correct page and offset in the query string', async () => {
  sinon.stub(isAddressModule.default, 'isAddress').returns(true);
  const fetchStub = sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({ result: [] })
  });

  await BLOCKSCOUT('0xabc', 'txns', 'ethereum', null, null, 3, 50);

  const url = new URL(fetchStub.firstCall.args[0]);
  expect(url.searchParams.get('page')).to.equal('3');
  expect(url.searchParams.get('offset')).to.equal('50');
});
it('should fallback to default startTimestamp if not provided', async () => {
  sinon.stub(isAddressModule.default, 'isAddress').returns(true);
  const nowStub = sinon.stub(Date, 'now').returns(1700000000000); // fixed time
  const fetchStub = sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({ result: [] })
  });

  await BLOCKSCOUT('0xabc', 'txns', 'ethereum');

  const url = new URL(fetchStub.firstCall.args[0]);
  const expectedStart = Math.floor((1700000000000 - 30 * 24 * 60 * 60 * 1000) / 1000).toString();
  expect(url.searchParams.get('start_timestamp')).to.equal(expectedStart);

  nowStub.restore();
});

it('should return empty array for tokens type with valid address', async () => {
  sinon.stub(isAddressModule.default, 'isAddress').returns(true);
  sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({ result: [] })
  });

  const result = await BLOCKSCOUT('0xabc', 'tokens', 'ethereum');
  expect(result).to.deep.equal([]);
});
it('should return txns array if valid response', async () => {
  sinon.stub(isAddressModule.default, 'isAddress').returns(true);
  const mockTxns = [{ blockNumber: '1', timeStamp: '123456' }];
  sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({ result: mockTxns })
  });

  const result = await BLOCKSCOUT('0xabc', 'txns', 'ethereum');
  expect(result).to.deep.equal(mockTxns);
});

});
