/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { COINGECKO } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';

const API_KEY = 'test-cg-api-key';

describe('COINGECKO', function () {
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

  it('should return MISSING_PARAM error when required params are missing', async () => {
    const result = await COINGECKO();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.functionName).to.equal('COINGECKO');
  });

  it('should return MISSING_KEY if API key not found', async () => {
    global.window.localStorage.getItem.returns(null);
    const result = await COINGECKO('price', 'btc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.message).to.include('Coingecko');
  });

  it('should return INVALID_PARAM for unknown category', async () => {
    const result = await COINGECKO('invalid', 'param');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('category');
  });

  it('should return price result in flattened structure', async () => {
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({ btc: { usd: 60000 } })
    });

    const result = await COINGECKO('price', 'btc', 'usd');
    expect(result).to.deep.equal([{ Btc_USD: 60000 }]);
  });

  it('should handle market category with param and trend', async () => {
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ([{ id: 'eth', name: 'Ethereum' }])
    });

    const result = await COINGECKO('market', 'ethereum', '7d');
    expect(result[0].id).to.equal('eth');
  });

  it('should handle stablecoins category', async () => {
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ([{ id: 'usdt', name: 'Tether' }])
    });

    const result = await COINGECKO('stablecoins', 'all', '24h');
    expect(result[0].id).to.equal('usdt');
  });

  it('should fetch all derivatives data when param is all', async () => {
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ([{ symbol: 'BTC-PERP' }, { symbol: 'ETH-PERP' }])
    });

    const result = await COINGECKO('derivatives', 'all');
    expect(result.length).to.equal(2);
  });

  it('should fetch derivatives from specific exchange with tickers mapped', async () => {
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({
        name: 'Binance',
        logo: 'url',
        url: 'https://binance.com',
        trade_volume_24h_btc: 123,
        number_of_futures_pairs: 10,
        number_of_perpetual_pairs: 15,
        open_interest_btc: 30,
        tickers: [{ symbol: 'BTCUSD', converted_volume: { usd: 100000 } }]
      })
    });

    const result = await COINGECKO('derivatives', 'binance');
    expect(result[0].symbol).to.equal('BTCUSD');
    expect(result[0].exchange_name).to.equal('Binance');
  });

  it('should return INVALID_API_KEY if API complains about key', async () => {
    sinon.stub(global, 'fetch').resolves({
      ok: false,
      json: async () => ({ status: { error_message: 'API Key Missing' } })
    });

    const result = await COINGECKO('price', 'btc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_API_KEY);
  });

  it('should return NETWORK_ERROR if fetch response is not ok', async () => {
    sinon.stub(global, 'fetch').resolves({
      ok: false,
      status: 502,
      json: async () => ({})
    });

    const result = await COINGECKO('market', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
  });

  it('should return DEFAULT error if fetch throws', async () => {
    sinon.stub(global, 'fetch').rejects(new Error('Boom'));

    const result = await COINGECKO('price', 'btc');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.reason.message).to.equal('Boom');
  });
    it('should return RATE_LIMIT if fetch response is not 429', async () => {
    sinon.stub(global, 'fetch').resolves({
      ok: false,
      status: 429,
      json: async () => ({})
    });

    const result = await COINGECKO('market', 'ethereum');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.RATE_LIMIT);
  });
});
