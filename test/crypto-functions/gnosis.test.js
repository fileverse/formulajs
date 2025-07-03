/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { GNOSIS } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';
import * as isAddressUtil from '../../src/utils/is-address.js';
import * as fromEnsNameToAddressUtil from '../../src/utils/from-ens-name-to-address.js';
import * as fromTimeStampToBlockUtil from '../../src/utils/from-timestamp-to-block.js';

const API_KEY = 'gnosis-api-key';

describe('GNOSIS', function () {
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

  it('should return MISSING_PARAM error if required params are missing', async () => {
    const result = await GNOSIS();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.functionName).to.equal('GNOSIS');
  });

  it('should return MISSING_KEY error if no API key found', async () => {
    global.window.localStorage.getItem.returns(null);
    const result = await GNOSIS('all-txns', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.message).to.include('Gnosisscan');
    expect(result.functionName).to.equal('GNOSIS');
  });

  it('should return MAX_PAGE_LIMIT error if limit > 250', async () => {
    const result = await GNOSIS('all-txns', '0xabc', null, null, 1, 1000);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT);
    expect(result.functionName).to.equal('GNOSIS');
  });

  it('should return ENS error if ENS name fails resolution', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(false);
    sinon.stub(fromEnsNameToAddressUtil.default, 'fromEnsNameToAddress').resolves(null);
    const result = await GNOSIS('all-txns', 'vitalik.eth');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.ENS);
    expect(result.functionName).to.equal('GNOSIS');
  });

  it('should return INVALID_PARAM if type is not supported', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    const result = await GNOSIS('invalid-type', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.functionName).to.equal('GNOSIS');
  });

  it('should convert timestamps and return result', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(fromTimeStampToBlockUtil.default, 'fromTimeStampToBlock')
      .onFirstCall().resolves('123')
      .onSecondCall().resolves('456');

    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: [{ tx: 'ok' }] })
    });

    const result = await GNOSIS('all-txns', '0xabc', '2024-01-01', '2024-01-31');
    expect(result).to.deep.equal([{ tx: 'ok' }]);
  });

  it('should return NETWORK_ERROR on failed fetch', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 502 });
    const result = await GNOSIS('all-txns', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
    expect(result.functionName).to.equal('GNOSIS');
  });

  it('should return INVALID_API_KEY error if API returns such message', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: 'Invalid API Key' })
    });
    const result = await GNOSIS('all-txns', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_API_KEY);
    expect(result.functionName).to.equal('GNOSIS');
  });

  it('should return RATE_LIMIT error if API rate limits', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: 'Max rate limit reached' })
    });
    const result = await GNOSIS('all-txns', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.RATE_LIMIT);
    expect(result.functionName).to.equal('GNOSIS');
  });

  it('should return DEFAULT error if fetch throws', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').rejects(new Error('unexpected'));
    const result = await GNOSIS('all-txns', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.functionName).to.equal('GNOSIS');
    expect(result.reason.message).to.equal('unexpected');
  });
  it('should resolve ENS name and fetch data if valid', async () => {
  sinon.stub(isAddressUtil.default, 'isAddress').returns(false);
  sinon.stub(fromEnsNameToAddressUtil.default, 'fromEnsNameToAddress').resolves('0xResolvedAddress');

  sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({ result: [{ tx: 'mock-tx' }] })
  });

  const result = await GNOSIS('all-txns', 'vitalik.eth');
  expect(result).to.deep.equal([{ tx: 'mock-tx' }]);
});

});
