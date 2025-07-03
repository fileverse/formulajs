/* eslint-env mocha */


import { expect } from 'chai';
import sinon from 'sinon';
import { FIREFLY } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';
describe('FIREFLY', () => {


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

  it('should return missing param error when required inputs are missing', async () => {
    const result = await FIREFLY();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.message).to.include('Missing param');
    expect(result.functionName).to.equal('FIREFLY')
  });

  it('should return MAX_PAGE_LIMIT error if end > MAX_PAGE_LIMIT', async () => {
    const args = ['farcaster', 'posts', 'xyz', 0, 99999];
    const result = await FIREFLY(...args);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT);
    expect(result.functionName).to.equal('FIREFLY')
  });

  it('should return missing key error if no API key in localStorage', async () => {
    window.localStorage.getItem.returns(null);
    const args = ['farcaster', 'posts', 'xyz'];
    const result = await FIREFLY(...args);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.functionName).to.equal('FIREFLY')
  });

  it('should return INVALID_PARAM for unsupported platform', async () => {
    window.localStorage.getItem.returns('dummy-key');
    const args = ['twitter', 'posts', 'xyz'];
    const result = await FIREFLY(...args);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('twitter');
    expect(result.message).to.include('platform');
    expect(result.functionName).to.equal('FIREFLY')
  });

  it('should return INVALID_PARAM for unsupported contentType', async () => {
    window.localStorage.getItem.returns('dummy-key');
    const args = ['lens', 'channels', 'xyz'];
    const result = await FIREFLY(...args);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('channels');
    expect(result.message).to.include('contentType');
    expect(result.functionName).to.equal('FIREFLY')
  });

  it('should handle fetch response not ok (status != 2xx)', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: false,
      status: 500
    });

    const args = ['lens', 'posts', 'xyz'];
    const result = await FIREFLY(...args);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
    expect(result.functionName).to.equal('FIREFLY')
  });

    it('should return rate limit error when response status === 429', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: false,
      status: 429
    });

    const args = ['lens', 'posts', 'xyz'];
    const result = await FIREFLY(...args);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.RATE_LIMIT);
    expect(result.functionName).to.equal('FIREFLY')
  });

  it('should return empty array if response.data is not an array', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ data: null })
    });

    const result = await FIREFLY('lens', 'posts', 'xyz');
    expect(result).to.deep.equal([]);
  });

  it('should flatten response and append platform field', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({
        data: [
          { id: 1, text: 'hello', meta: { deep: 'ignore' }, extra: null }
        ]
      })
    });

    const result = await FIREFLY('farcaster', 'posts', 'xyz');
    expect(result).to.be.an('array').with.lengthOf(1);
    expect(result[0]).to.include({ id: 1, text: 'hello', platform: 'farcaster' });
    expect(result[0]).to.not.have.property('meta');
  });

  it('should catch fetch error and return DEFAULT error', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').rejects(new Error('Network failed'));

    const result = await FIREFLY('lens', 'posts', 'abc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.message).to.equal('An unexpected error occured');
    expect(result.reason.message).to.equal('Network failed');
    expect(result.functionName).to.equal('FIREFLY')
  });
  it('should trim and format identifier into query string', async () => {
  window.localStorage.getItem.returns('key');
  const fetchStub = sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({ data: [] })
  });

  await FIREFLY('farcaster', 'posts', ' a , , b ');
  const calledUrl = new URL(fetchStub.firstCall.args[0]);
  expect(calledUrl.searchParams.get('query')).to.equal('a,b');
});
it('should include start and end in query string', async () => {
  window.localStorage.getItem.returns('key');
  const fetchStub = sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({ data: [] })
  });

  await FIREFLY('farcaster', 'posts', 'abc', 5, 9);
  const url = new URL(fetchStub.firstCall.args[0]);
  expect(url.searchParams.get('start')).to.equal('5');
  expect(url.searchParams.get('end')).to.equal('9');
});

it('should keep nulls and skip nested objects when flattening', async () => {
  window.localStorage.getItem.returns('key');
  sinon.stub(global, 'fetch').resolves({
    ok: true,
    json: async () => ({
      data: [
        {
          id: 1,
          text: 'hello',
          meta: { author: 'abc' },
          deleted: null
        }
      ]
    })
  });

  const result = await FIREFLY('lens', 'posts', 'abc');
  expect(result[0]).to.deep.equal({
    id: 1,
    text: 'hello',
    deleted: null,
    platform: 'lens'
  });
});

});
