/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { BASE } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';
import * as isAddressUtil from '../../src/utils/is-address.js';
import * as fromEnsNameToAddressUtil from '../../src/utils/from-ens-name-to-address.js';
import * as fromTimeStampToBlockUtil from '../../src/utils/from-timestamp-to-block.js';

const API_KEY = 'test-api-key';

describe('BASE', function () {
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
    const result = await BASE();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.functionName).to.equal('BASE');
  });

  it('should return MISSING_KEY error if no API key found', async () => {
    global.window.localStorage.getItem.returns(null);
    const result = await BASE('all-txns', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.message).to.include('Basescan');
    expect(result.functionName).to.equal('BASE');
  });

  it('should return MAX_PAGE_LIMIT error if limit > 250', async () => {
    const result = await BASE('all-txns', '0xabc', null, null, 1, 9999);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT);
    expect(result.functionName).to.equal('BASE');
  });

  it('should return ENS error if address is ENS and resolution fails', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(false);
    sinon.stub(fromEnsNameToAddressUtil.default, 'fromEnsNameToAddress').resolves(null);

    const result = await BASE('all-txns', 'vitalik.eth');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.ENS);
    expect(result.functionName).to.equal('BASE');
  });

  it('should return INVALID_PARAM if type is not supported', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    const result = await BASE('invalid-type', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.functionName).to.equal('BASE');
  });


  it('should convert date range to blocks and fetch data successfully', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(fromTimeStampToBlockUtil.default, 'fromTimeStampToBlock')
      .onFirstCall().resolves('111')
      .onSecondCall().resolves('222');

    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: [{ tx: '123' }] })
    });

    const result = await BASE('all-txns', '0xabc', '2024-01-01', '2024-06-01');
    expect(result).to.deep.equal([{ tx: '123' }]);
  });

  it('should return NETWORK_ERROR if fetch returns !ok', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 500 });

    const result = await BASE('all-txns', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
    expect(result.functionName).to.equal('BASE');
  });

  it('should return INVALID_API_KEY error if API complains about key', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: 'Invalid API Key' })
    });

    const result = await BASE('all-txns', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_API_KEY);
    expect(result.functionName).to.equal('BASE');
  });

  it('should return RATE_LIMIT error if API says rate limit hit', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: 'Max rate limit reached' })
    });

    const result = await BASE('all-txns', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.RATE_LIMIT);
    expect(result.functionName).to.equal('BASE');
  });

  it('should return DEFAULT error if fetch throws', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').rejects(new Error('Boom'));

    const result = await BASE('all-txns', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.functionName).to.equal('BASE');
    expect(result.reason.message).to.equal('Boom');
  });
  it('should resolve ENS name and fetch data if valid', async () => {
  sinon.stub(isAddressUtil.default, 'isAddress').returns(false);
  sinon.stub(fromEnsNameToAddressUtil.default, 'fromEnsNameToAddress').resolves('0xResolvedAddress');

  sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({ result: [{ tx: 'mock-tx' }] })
  });

  const result = await BASE('all-txns', 'vitalik.eth');
  expect(result).to.deep.equal([{ tx: 'mock-tx' }]);
});

});
