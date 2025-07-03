/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { FARCASTER } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';

describe('FARCASTER', () => {
  beforeEach(() => {
    global.window = {
      localStorage: {
        getItem: sinon.stub()
      }
    };
    global.fetch = () => {};
  });

  afterEach(() => {
    sinon.restore();
    delete global.window;
    delete global.fetch;
  });

  it('should return missing param error if contentType or identifier is missing', async () => {
    const result = await FARCASTER();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.functionName).to.equal('FARCASTER')
  });

  it('should return MAX_PAGE_LIMIT error if end > MAX_PAGE_LIMIT', async () => {
    const result = await FARCASTER('posts', 'abc', 0, 9999);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT);
    expect(result.functionName).to.equal('FARCASTER')
  });

  it('should return missing key error if API key not found', async () => {
    window.localStorage.getItem.returns(null);
    const result = await FARCASTER('posts', 'abc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.functionName).to.equal('FARCASTER')
  });

  it('should return INVALID_PARAM for unsupported contentType', async () => {
    window.localStorage.getItem.returns('dummy-key');
    const result = await FARCASTER('likes', 'abc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('likes');
    expect(result.functionName).to.equal('FARCASTER')
  });

  it('should handle fetch with non-ok response (e.g. 500)', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 500 });

    const result = await FARCASTER('posts', 'abc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
    expect(result.message).to.include('500');
    expect(result.functionName).to.equal('FARCASTER')
  });

  it('should return RATE_LIMIT error if status === 429', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 429 });

    const result = await FARCASTER('posts', 'abc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.RATE_LIMIT);
    expect(result.functionName).to.equal('FARCASTER')
  });

  it('should return empty array if response.data is not an array', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ data: null })
    });

    const result = await FARCASTER('posts', 'abc');
    expect(result).to.deep.equal([]);
  });

  it('should flatten valid data and append platform field', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({
        data: [{ id: 1, title: 'hello', meta: { skip: true }, flag: null }]
      })
    });

    const result = await FARCASTER('posts', 'abc');
    expect(result).to.deep.equal([
      { id: 1, title: 'hello', flag: null, platform: 'farcaster' }
    ]);
  });

  it('should trim and clean identifier values into query param', async () => {
    window.localStorage.getItem.returns('dummy-key');
    const fetchStub = sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ data: [] })
    });

    await FARCASTER('replies', ' ,a, b , , c  ');
    const url = new URL(fetchStub.firstCall.args[0]);
    expect(url.searchParams.get('query')).to.equal('a,b,c');
  });

  it('should correctly pass start and end to query string', async () => {
    window.localStorage.getItem.returns('dummy-key');
    const fetchStub = sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ data: [] })
    });

    await FARCASTER('channels', 'abc', 10, 25);
    const url = new URL(fetchStub.firstCall.args[0]);
    expect(url.searchParams.get('start')).to.equal('10');
    expect(url.searchParams.get('end')).to.equal('25');
  });

  it('should catch fetch exceptions and return DEFAULT error', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').rejects(new Error('Boom'));

    const result = await FARCASTER('posts', 'abc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.reason.message).to.equal('Boom');
    expect(result.functionName).to.equal('FARCASTER')
  });
});
