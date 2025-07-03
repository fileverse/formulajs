import * as fromTimeStampToBlockUtil from './from-timestamp-to-block.js'
import { ERROR_MESSAGES_FLAG } from './constants.js'
import { toTimestamp } from './toTimestamp.js'
import * as isAddressUtil from './is-address.js'
import * as fromEnsNameToAddressUtil from './from-ens-name-to-address.js'
import { errorMessageHandler } from './error-messages-handler.js'
import { SERVICES_API_KEY } from '../crypto-constants.js'
export async function handleScanRequest({
  type,
  address,
  startDate,
  endDate,
  page = 1,
  offset = 10,
  apiKey,
  functionName,
  chainId,
  network
}) {
  const API_INFO_MAP = {
    BASE: { url: 'https://api.basescan.org/api', apiKeyName: SERVICES_API_KEY.Basescan },
    ETHERSCAN: { url: 'https://api.etherscan.io/v2/api', apiKeyName: SERVICES_API_KEY.Etherscan },
    GNOSIS: { url: 'https://api.gnosisscan.io/api', apiKeyName: SERVICES_API_KEY.Gnosisscan }
  }

  if (!isAddressUtil.default.isAddress(address)) {
    const ensName = address
    address = await fromEnsNameToAddressUtil.default.fromEnsNameToAddress(address)
    if (!address) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.ENS, ensName, functionName)
    }
  }

  const apiInfo = API_INFO_MAP[functionName]
  const baseUrl = apiInfo?.url

  if (!baseUrl) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.CUSTOM, {
      message: 'Api not found',
      reason: ` Api not found for: ${functionName}`
    }, functionName)
  }

  const ACTION_MAP = {
    'all-txns': 'txlist',
    'token-txns': 'tokentx',
    'nft-txns': 'tokennfttx',
    gas: 'gastracker'
  }

  const action = ACTION_MAP[type]
  if (!action) return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { type }, functionName)

  let url = `${baseUrl}?chainid=${chainId}&module=account&action=${action}&apikey=${apiKey}`

  if (['all-txns', 'token-txns', 'nft-txns'].includes(type)) {
    url += `&address=${address}&startblock=0&endblock=99999999&sort=asc`

    if (!isNaN(startDate) && !isNaN(endDate)) {
      const [startBlock, endBlock] = await Promise.all([
        fromTimeStampToBlockUtil.default.fromTimeStampToBlock(toTimestamp(startDate), network, apiKey),
        fromTimeStampToBlockUtil.default.fromTimeStampToBlock(toTimestamp(endDate), network, apiKey)
      ])
      url += `&startblock=${startBlock || '0'}&endblock=${endBlock || '99999999'}`
    }
    url += `&page=${page}&offset=${offset}`
  }

  try {
    const res = await fetch(url)
    if (!res.ok) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, res.status, functionName)
    }
    const json = await res.json()

    if (typeof json.result === 'string') {
      if (json.result.includes('Invalid API Key'))
        return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_API_KEY, apiInfo.apiKeyName, functionName)
      if (json.result.includes('Max rate limit reached'))
        return errorMessageHandler(ERROR_MESSAGES_FLAG.RATE_LIMIT, apiInfo.apiKeyName, functionName)
    }

    return json.result
  } catch (err) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, err, functionName)
  }
}
