import { errorMessageHandler, validateParams } from '../../utils/error-messages-handler.js'
import { NetworkError, ValidationError } from '../../utils/error-instances.js'
import * as fromEnsNameToAddressUtil from '../../utils/from-ens-name-to-address.js'
import { otsSearchTransactionsSchema } from './otterscan-schema.js';

/**
 * Helper – turn a hex string (0x...) into a decimal number.
 */
const hexToDec = (hex) => (hex ? parseInt(hex, 16) : null);

/**
 * Core implementation used by both BEFORE & AFTER.
 *
 * @param {string} method - full JSON‑RPC method name (ots_searchTransactionsBefore / After)
 * @param {string} endpoint - RPC URL of the node
 * @param {string} address
 * @param {number} blockNumber
 * @param {number} pageSize
 * @returns {Promise<Array<Object>>}
 */
async function _otsSearchTransactions (method, endpoint, address, blockNumber = 0, pageSize = 25) {
  // Validate parameters
  validateParams(otsSearchTransactionsSchema, { endpoint, address, blockNumber, pageSize });

  // Build JSON‑RPC payload
  const payload = {
    jsonrpc: '2.0',
    id: 1,
    method,
    params: [address, blockNumber, pageSize]
  };

  // Perform request
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new NetworkError(method, response.status);
  }

  const json = await response.json();

  // Otterscan returns an `error` field on failure; treat it as a generic error
  if (json.error) {
    const msg = json.error.message || 'Unknown Otterscan error';
    throw new Error(msg);
  }

  const result = json.result;

  // Normalize output
  const { txs = [], receipts = [] } = result;

  const normalized = txs.map((tx, idx) => {
    const receipt = receipts[idx] || {};

    return {
      // address that was queried
      address,

      // block information
      blockNumber: hexToDec(tx.blockNumber),
      blockHash: receipt.blockHash || null,
      timestamp: receipt.timestamp ?? null,

      // transaction core
      hash: tx.hash,
      nonce: hexToDec(tx.nonce),
      transactionIndex: hexToDec(tx.transactionIndex),
      from: tx.from,
      to: tx.to,
      contractAddress: receipt.contractAddress || null,
      value: hexToDec(tx.value),
      gas: hexToDec(tx.gas),
      gasPrice: tx.gasPrice,
      gasUsed: receipt.gasUsed !== undefined ? hexToDec(receipt.gasUsed) : null,
      input: tx.input
    };
  });

  return normalized;
}

/**
 * Search *backward* from `blockNumber` (or the latest block when
 * `blockNumber === 0`) and return the next `pageSize` transactions that
 * involve the supplied address.
 *
 * @param {string} endpoint
 * @param {string} address
 * @param {number} blockNumber
 * @param {number} pageSize
 * @returns {Promise<Array<Object>>}
 */
export async function OTS_SEARCH_TXS_BEFORE (
  endpoint,
  address,
  blockNumber,
  pageSize
) {
  try {
    return await _otsSearchTransactions(
      'ots_searchTransactionsBefore',
      endpoint,
      address,
      blockNumber,
      pageSize
    );
  } catch (err) {
    return errorMessageHandler(err, 'OTS_SEARCH_TRANSACTIONS_BEFORE');
  }
}

/**
 * Search *forward* from `blockNumber` (or the genesis block when
 * `blockNumber === 0`) and return the next `pageSize` transactions that
 * involve the supplied address.
 *
 * @param {string} endpoint
 * @param {string} address
 * @param {number} blockNumber
 * @param {number} pageSize
 * @returns {Promise<Array<Object>>}
 */
export async function OTS_SEARCH_TXS_AFTER (
  endpoint,
  address,
  blockNumber,
  pageSize
) {
  try {
    return await _otsSearchTransactions(
      'ots_searchTransactionsAfter',
      endpoint,
      address,
      blockNumber,
      pageSize
    );
  } catch (err) {
    return errorMessageHandler(err, 'OTS_SEARCH_TRANSACTIONS_AFTER');
  }
}

