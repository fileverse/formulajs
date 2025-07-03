/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { AAVE } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';

describe('AAVE', function () {
  const MOCK_URL = 'https://onchain-proxy.fileverse.io/third-party';

  beforeEach(() => {
    global.fetch = () => {};
  });

  afterEach(() => {
    sinon.restore();
    delete global.fetch;
  });

  it('should return MISSING_PARAM error if required params are missing', async () => {
    const result = await AAVE();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
  });

  it('should return NETWORK_ERROR if fetch returns !ok', async () => {
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 500 });

    const result = await AAVE('v3', 'market', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
  });

  it('should return DEFAULT error if fetch throws', async () => {
    sinon.stub(global, 'fetch').rejects(new Error('Fetch failed'));

    const result = await AAVE('v3', 'market', '0xabc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.reason.message).to.equal('Fetch failed');
  });

  it('should build correct URL and return cleaned data', async () => {

    const jsonResponse = { pool: { totalLiquidity: '12345' } };
    const expectedFlat = { pool: { totalLiquidity: '12345' } };

    const fetchStub = sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => jsonResponse
    });


    const result = await AAVE('v3', 'market', '0xabc', 'optional');

    expect(result).to.deep.equal(expectedFlat);

    const calledUrl = fetchStub.getCall(0).args[0];
    expect(calledUrl).to.include(`${MOCK_URL}?service=aave`);
    expect(calledUrl).to.include('graphType=v3');
    expect(calledUrl).to.include('category=market');
    expect(calledUrl).to.include('input1=0xabc');
    expect(calledUrl).to.include('input2=optional');
  });
});
