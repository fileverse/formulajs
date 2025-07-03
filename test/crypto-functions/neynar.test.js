/* eslint-env mocha */

import { expect } from 'chai';
import sinon from 'sinon';
import { NEYNAR } from '../../src/crypto.js';
import { ERROR_MESSAGES_FLAG } from '../../src/utils/constants.js';
import * as fromUsernameToFidUtil from '../../src/utils/from-username-to-fid.js';

const API_KEY = 'test-neynar-api-key';

describe('NEYNAR', function () {
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

  it('should return MISSING_PARAM error if username is missing', async () => {
    const result = await NEYNAR();
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_PARAM);
    expect(result.message).to.include('username');
    expect(result.functionName).to.equal('NEYNAR');
  });

  it('should return MISSING_KEY error if API key is missing', async () => {
    global.window.localStorage.getItem.returns(null);
    const result = await NEYNAR('testuser');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.MISSING_KEY);
    expect(result.message).to.include('Neynar');
    expect(result.functionName).to.equal('NEYNAR');
  });

  it('should return INVALID_PARAM if fid resolution fails', async () => {
    sinon.stub(fromUsernameToFidUtil.default, 'fromUsernameToFid').resolves(null);
    const result = await NEYNAR('nonexistent');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.INVALID_PARAM);
    expect(result.message).to.include('nonexistent');
    expect(result.functionName).to.equal('NEYNAR');
  });

  it('should return NETWORK_ERROR if fetch response is not ok', async () => {
    sinon.stub(fromUsernameToFidUtil.default, 'fromUsernameToFid').resolves('1234');
    sinon.stub(global, 'fetch').resolves({ ok: false, status: 503 });
    const result = await NEYNAR('testuser');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
    expect(result.message).to.include('503');
    expect(result.functionName).to.equal('NEYNAR');
  });

  it('should return DEFAULT error if fetch throws', async () => {
    sinon.stub(fromUsernameToFidUtil.default, 'fromUsernameToFid').resolves('1234');
    sinon.stub(global, 'fetch').rejects(new Error('Boom'));
    const result = await NEYNAR('testuser');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.DEFAULT);
    expect(result.functionName).to.equal('NEYNAR');
    expect(result.reason.message).to.equal('Boom');
  });


  it('should return mapped users and skip nested field if json.users has data', async () => {
    sinon.stub(fromUsernameToFidUtil.default, 'fromUsernameToFid').resolves('1234');
    sinon.stub(global, 'fetch').resolves({
      ok: true,
      json: async () => ({
        users: [
          {
            user: {
              username: 'alice',
              custody_address: '0x123',
              follower_count: 100,
              profile: {
                location: {
                  address: {
                    country: 'Wonderland',
                    city: 'Rabbit Hole'
                  }
                }
              }
            }
          }
        ]
      })
    });

    const result = await NEYNAR('testuser');
    expect(result).to.deep.equal([
      {
        username: 'alice',
        custody_address: '0x123',
        follower_count: 100,
        country: 'Wonderland',
        city: 'Rabbit Hole'
      }
    ]);
  });
});
