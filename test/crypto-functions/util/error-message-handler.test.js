import { expect } from 'chai';
import { errorMessageHandler, checkRequiredParams } from '../../../src/utils/error-messages-handler.js';
import { ERROR_MESSAGES_FLAG, MAX_PAGE_LIMIT } from '../../../src/utils/constants.js';


describe('errorMessageHandler', () => {
  it('should auto-infer function name when not provided', () => {
    const result = (function testFuncName() {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_ADDRESS, '0xabc');
    })();
    expect(result.functionName).to.equal('testFuncName');
  });

  it('should return default error when unknown errorFlag is passed', () => {
    const result = errorMessageHandler('UNKNOWN_FLAG', 'oops', 'UnknownFunc');
    expect(result.message).to.equal('An unexpected error occured');
    expect(result.type).to.equal('UNKNOWN_FLAG');
    expect(result.reason).to.equal('oops');
  });

  it('should handle INVALID_ADDRESS correctly', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_ADDRESS, '0x123', 'AddrFunc');
    expect(result.message).to.equal('0x123 is not a supported address');
  });

  it('should handle INVALID_PARAM correctly', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { type: 'wrong' }, 'ParamFunc');
    expect(result.message).to.equal('wrong is an invalid value for type');
  });

  it('should handle INVALID_CHAIN correctly', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_CHAIN, 'optimism', 'ChainFunc');
    expect(result.message).to.equal('optimism is not a supported chain for this function ');
  });

  it('should handle RATE_LIMIT with input', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.RATE_LIMIT, 'alchemy', 'RateFunc');
    expect(result.message).to.equal('Rate limit for alchemy has been reached');
  });

  it('should handle RATE_LIMIT without input', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.RATE_LIMIT, undefined, 'RateFunc');
    expect(result.message).to.equal('Rate limit for RateFunc has been reached');
  });

  it('should handle MISSING_KEY with input', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, 'infura', 'KeyFunc');
    expect(result.message).to.equal('Api key for infura is missing');
  });

  it('should handle MISSING_KEY without input', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, undefined, 'KeyFunc');
    expect(result.message).to.equal('Api key for KeyFunc is missing');
  });

  it('should handle NETWORK_ERROR with 429', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, 429, 'NetFunc');
    expect(result.message).to.equal('Rate limit for NetFunc has been reached');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.RATE_LIMIT);
  });

  it('should handle NETWORK_ERROR with other status', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, 500, 'NetFunc');
    expect(result.message).to.equal('Api failed with status code 500');
    expect(result.type).to.equal(ERROR_MESSAGES_FLAG.NETWORK_ERROR);
  });

  it('should handle MISSING_PARAM', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_PARAM, 'chainId', 'Checker');
    expect(result.message).to.equal('Missing param: chainId');
  });

  it('should handle ENS error', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.ENS, 'bad.eth', 'EnsFunc');
    expect(result.message).to.equal('bad.eth is not a supported ens name');
  });

  it('should handle CUSTOM with message and reason', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.CUSTOM, { message: 'Something broke', reason: 'Token expired' }, 'CustomFunc');
    expect(result.message).to.equal('Something broke');
    expect(result.reason).to.equal('Token expired');
  });

  it('should handle CUSTOM with message only', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.CUSTOM, { message: 'Only message' }, 'CustomFunc');
    expect(result.reason).to.equal('Only message');
  });

  it('should handle MAX_PAGE_LIMIT', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT, null, 'PageFunc');
    expect(result.message).to.equal(`Max page limit is ${MAX_PAGE_LIMIT}`);
  });

  it('should handle INVALID_API_KEY', () => {
    const result = errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_API_KEY, 'etherscan', 'ApiFunc');
    expect(result.message).to.equal('etherscan: Invalid API key');
  });
});

describe('checkRequiredParams', () => {
  it('should return undefined if all params are present', () => {
    const result = checkRequiredParams({ chainId: '1', address: '0xabc' });
    expect(result).to.be.undefined;
  });

  it('should return error message for first missing param', () => {
    const result = (function validateParams() {
      return checkRequiredParams({ chainId: '', address: '0xabc' });
    })();

    expect(result).to.include({
      message: 'Missing param: chainId',
      type: ERROR_MESSAGES_FLAG.MISSING_PARAM
    });

    // Confirm it inferred function name from stack trace
    expect(result.functionName).to.equal('validateParams');
  });

  it('should return error for first falsy param only', () => {
    const result = checkRequiredParams({ key1: '', key2: null, key3: 'value' });
    expect(result.message).to.equal('Missing param: key1');
  });

  it('should return undefined for empty object', () => {
    const result = checkRequiredParams({});
    expect(result).to.be.undefined;
  });
});
