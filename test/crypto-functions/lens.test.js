/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { LENS } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';

describe('LENS', () => {
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
    const result = await LENS();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.message).to.include('Missing param');
    expect(result.functionName).to.equal('LENS')
  });

  it('should return MAX_PAGE_LIMIT error if end > MAX_PAGE_LIMIT', async () => {
    const result = await LENS('posts', 'lens123', 0, 9999);
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT);
    expect(result.functionName).to.equal('LENS')
  });

  it('should return missing key error if no API key in localStorage', async () => {
    window.localStorage.getItem.returns(null);
    const result = await LENS('posts', 'lens123');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.functionName).to.equal('LENS')
  });

  it('should return INVALID_PARAM for unsupported contentType', async () => {
    window.localStorage.getItem.returns('dummy-key');
    const result = await LENS('likes', 'lens123');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('likes');
    expect(result.message).to.include('contentType');
    expect(result.functionName).to.equal('LENS')
  });

  it('should return NETWORK_ERROR for failed fetch status (e.g. 500)', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: false,
      status: 500
    });
    const result = await LENS('posts', 'lens123');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
    expect(result.message).to.include('500');
    expect(result.functionName).to.equal('LENS')
  });

  it('should return RATE_LIMIT error when status === 429', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: false,
      status: 429
    });
    const result = await LENS('posts', 'lens123');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.RATE_LIMIT);
    expect(result.functionName).to.equal('LENS')
  });

  it('should return empty array if response.data is not an array', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ data: null })
    });
    const result = await LENS('posts', 'lens123');
    expect(result).to.deep.equal([]);
  });

  it('should flatten valid data and append platform field', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({
        data: [{ id: 1, text: 'hello', meta: { extra: 'ignored' }, status: null }]
      })
    });
    const result = await LENS('posts', 'lens123');
    expect(result).to.deep.equal([
      { id: 1, text: 'hello', status: null, platform: 'lens' }
    ]);
  });

  it('should preserve nulls and skip nested objects in flattening', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({
        data: [{ id: 5, name: null, info: { ignored: true }, active: true }]
      })
    });
    const result = await LENS('replies', 'abc');
    expect(result[0]).to.deep.equal({
      id: 5,
      name: null,
      active: true,
      platform: 'lens'
    });
    expect(result[0]).to.not.have.property('info');
  });

  it('should trim and format identifier into clean query string', async () => {
    window.localStorage.getItem.returns('dummy-key');
    const fetchStub = sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ data: [] })
    });
    await LENS('posts', ' a , b , ,c ');
    const calledUrl = new URL(fetchStub.firstCall.args[0]);
    expect(calledUrl.searchParams.get('query')).to.equal('a,b,c');
  });

  it('should include start and end query params in URL', async () => {
    window.localStorage.getItem.returns('dummy-key');
    const fetchStub = sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ data: [] })
    });
    await LENS('replies', 'xyz', 5, 15);
    const url = new URL(fetchStub.firstCall.args[0]);
    expect(url.searchParams.get('start')).to.equal('5');
    expect(url.searchParams.get('end')).to.equal('15');
  });

  it('should return DEFAULT error if fetch throws error', async () => {
    window.localStorage.getItem.returns('dummy-key');
    sinon.stub(global, 'fetch').rejects(new Error('Boom'));
    const result = await LENS('posts', 'abc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.reason.message).to.equal('Boom');
    expect(result.functionName).to.equal('LENS')
  });
});
