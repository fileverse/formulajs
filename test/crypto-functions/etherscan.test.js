/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { ETHERSCAN } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';
import * as isAddressUtil from '../../src/utils/is-address.js';
import * as fromEnsNameToAddressUtil from '../../src/utils/from-ens-name-to-address.js';
import * as fromTimeStampToBlockUtil from '../../src/utils/from-timestamp-to-block.js';

const API_KEY = 'test-etherscan-key';

describe('ETHERSCAN', function () {
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
    const result = await ETHERSCAN();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.functionName).to.equal('ETHERSCAN');
  });

  it('should return INVALID_CHAIN if chainId is not found', async () => {
    const result = await ETHERSCAN('all-txns', 'unknown', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_CHAIN);
    expect(result.message).to.include('unknown');
    expect(result.functionName).to.equal('ETHERSCAN');
  });

  it('should return MISSING_KEY if no API key in localStorage', async () => {
    global.window.localStorage.getItem.returns(null);
    const result = await ETHERSCAN('all-txns', 'ethereum', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.message).to.include('Etherscan');
    expect(result.functionName).to.equal('ETHERSCAN');
  });

  it('should return ENS error if address is ENS and cannot be resolved', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(false);
    sinon.stub(fromEnsNameToAddressUtil.default, 'fromEnsNameToAddress').resolves(null);

    const result = await ETHERSCAN('all-txns', 'ethereum', 'vitalik.eth');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.ENS);
    expect(result.functionName).to.equal('ETHERSCAN');
  });

  it('should return INVALID_PARAM if type is not supported', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    const result = await ETHERSCAN('invalid-type', 'ethereum', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.functionName).to.equal('ETHERSCAN');
  });

  it('should convert date to block numbers and return result', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(fromTimeStampToBlockUtil.default, 'fromTimeStampToBlock')
      .onFirstCall().resolves('111')
      .onSecondCall().resolves('222');

    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: [{ tx: 'sample' }] })
    });

    const result = await ETHERSCAN('all-txns', 'ethereum', '0xabc', '2024-01-01', '2024-06-01');
    expect(result).to.deep.equal([{ tx: 'sample' }]);
  });

  it('should return NETWORK_ERROR if fetch fails', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 502 });

    const result = await ETHERSCAN('all-txns', 'ethereum', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
    expect(result.functionName).to.equal('ETHERSCAN');
  });

  it('should return INVALID_API_KEY error on invalid key', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: 'Invalid API Key' })
    });

    const result = await ETHERSCAN('all-txns', 'ethereum', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_API_KEY);
    expect(result.functionName).to.equal('ETHERSCAN');
  });

  it('should return RATE_LIMIT error when exceeded', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: 'Max rate limit reached' })
    });

    const result = await ETHERSCAN('all-txns', 'ethereum', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.RATE_LIMIT);
    expect(result.functionName).to.equal('ETHERSCAN');
  });

  it('should return DEFAULT error if fetch throws', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').rejects(new Error('Boom'));

    const result = await ETHERSCAN('all-txns', 'ethereum', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.functionName).to.equal('ETHERSCAN');
    expect(result.reason.message).to.equal('Boom');
  });
  it('should handle supported chains: ethereum, base, gnosis', async () => {
    sinon.stub(isAddressUtil.default, 'isAddress').returns(true);
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ result: ['chain-ok'] })
    });

    for (const chain of ['ethereum', 'base', 'gnosis']) {
      const result = await ETHERSCAN('all-txns', chain, '0xabc');
      expect(result).to.deep.equal(['chain-ok']);
    }
  });
});
