/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { DEFILLAMA } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';

const API_KEY = 'test-defillama-api-key';

describe('DEFILLAMA', function () {
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

  it('should return MISSING_PARAM if category is missing', async () => {
    const result = await DEFILLAMA();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
  });

  it('should return MISSING_KEY if API key is missing', async () => {
    global.window.localStorage.getItem.returns(null);
    const result = await DEFILLAMA('protocols');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.message).to.include('Defillama');
  });

  it('should return INVALID_PARAM if category is unsupported', async () => {
    const result = await DEFILLAMA('unknown-category');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('unknown-category');
    expect(result.message).to.include('category');
  });

  it('should return NETWORK_ERROR if fetch fails with !ok', async () => {
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 503 });
    const result = await DEFILLAMA('protocols');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
  });

  it('should return DEFAULT error if fetch throws', async () => {
    sinon.stub(global, 'fetch').rejects(new Error('Fetch failed'));
    const result = await DEFILLAMA('protocols');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.reason.message).to.equal('Fetch failed');
  });

  it('should process "protocols" category with slice cap', async () => {
    const longArray = new Array(600).fill({ name: 'protocol' });
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => longArray
    });
    const result = await DEFILLAMA('protocols');
    expect(result).to.be.an('array');
    expect(result.length).to.equal(500);
  });

  it('should process "yields" category from .data', async () => {
    const dataArray = new Array(10).fill({ pool: 'pool1' });
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ data: dataArray })
    });
    const result = await DEFILLAMA('yields');
    expect(result).to.be.an('array');
    expect(result.length).to.equal(10);
  });

  it('should process "dex" category from .protocols', async () => {
    const dexArray = new Array(10).fill({ name: 'dex1' });
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ protocols: dexArray })
    });
    const result = await DEFILLAMA('dex');
    expect(result).to.be.an('array');
    expect(result.length).to.equal(10);
  });

  it('should process "fees" category from .protocols', async () => {
    const feeArray = new Array(10).fill({ name: 'fee1' });
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ protocols: feeArray })
    });
    const result = await DEFILLAMA('fees');
    expect(result).to.be.an('array');
    expect(result.length).to.equal(10);
  });
});
