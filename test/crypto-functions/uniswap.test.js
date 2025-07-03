/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { UNISWAP } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';

const MOCK_URL = 'https://onchain-proxy.fileverse.io/third-party';

describe('UNISWAP', function () {
  beforeEach(() => {
    global.window = { localStorage: { getItem: () => '' } }; // optional
    global.fetch = () => {};
  });

  afterEach(() => {
    sinon.restore();
    delete global.fetch;
    delete global.window;
  });

  it('should return MISSING_PARAM error if required params are missing', async () => {
    const result = await UNISWAP();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
  });

  it('should return NETWORK_ERROR if fetch returns !ok', async () => {
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 500 });
    const result = await UNISWAP('v3', 'pool', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
  });

  it('should return DEFAULT error if fetch throws', async () => {
    sinon.stub(global, 'fetch').rejects(new Error('Failed'));
    const result = await UNISWAP('v3', 'pool', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.reason.message).to.equal('Failed');
  });

  it('should build correct URL and return cleaned data', async () => {
    const mockResponse = { pool: { volume: 1234 } };

    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => mockResponse
    });

    const result = await UNISWAP('v3', 'pool', '0xabc', 'optional');
    expect(result).to.deep.equal({ pool: { volume: 1234 } });

    const calledUrl = global.fetch.getCall(0).args[0];
    expect(calledUrl).to.include(`${MOCK_URL}?service=uniswap`);
    expect(calledUrl).to.include('graphType=v3');
    expect(calledUrl).to.include('category=pool');
    expect(calledUrl).to.include('input1=0xabc');
    expect(calledUrl).to.include('input2=optional');
  });
});
