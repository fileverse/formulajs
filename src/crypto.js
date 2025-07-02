/* global window */

import { SERVICES_API_KEY } from './crypto-constants'
import { fromTimeStampToBlock } from './utils/from-timestamp-to-block'
import {
  CHAIN_ID_MAP,
  BLOCKSCOUT_CHAINS_MAP,
  SAFE_CHAIN_MAP,
  ERROR_MESSAGES_FLAG,
  MAX_PAGE_LIMIT
} from './utils/constants'
import { handleScanRequest } from './utils/handle-explorer-request'
import { toTimestamp } from './utils/toTimestamp'
import { isAddress } from './utils/is-address'
import { fromEnsNameToAddress } from './utils/from-ens-name-to-address'
import { fromUsernameToFid } from './utils/from-username-to-fid'
import { removeNestedStructure } from './utils/remove-nested-structure'
import * as utils from './utils/common'
import { checkRequiredParams, errorMessageHandler } from './utils/error-messages-handler'

export async function FIREFLY() {
  const [platform, contentType, identifier, start = 0, end = 10] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ platform, contentType, identifier })

  if (missingParamsError) {
    return missingParamsError
  }

  if (end > MAX_PAGE_LIMIT) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT)
  }

  const API_KEY = window.localStorage.getItem(SERVICES_API_KEY.Firefly)
  if (!API_KEY) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Firefly)

  const baseUrl = 'https://openapi.firefly.land/v1/fileverse/fetch'
  const headers = { 'x-api-key': API_KEY }

  const typeMap = {
    farcaster: {
      posts: 'farcasterid',
      replies: 'farcasterpostid',
      channels: 'farcasterchannels'
    },
    lens: {
      posts: 'lensid',
      replies: 'lenspostid'
    }
  }
  const platformType = typeMap[platform]
  if (!platformType) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { platform })
  }
  const platformContentType = platformType[contentType]
  if (!platformContentType) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { contentType })
  }
  const query = identifier
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(',')

  const url = new URL(baseUrl)
  url.searchParams.set('query', query)
  url.searchParams.set('type', platformType)
  url.searchParams.set('start', String(start))
  url.searchParams.set('end', String(end))

  try {
    const res = await fetch(url.toString(), { headers })
    if (!res.ok) errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, res.status)

    const json = await res.json()
    if (!Array.isArray(json?.data)) return []

    return json.data.map((item) => {
      const flat = {}
      for (const [key, value] of Object.entries(item)) {
        if (typeof value !== 'object' || value === null) {
          flat[key] = value
        }
      }
      flat.platform = platform
      return flat
    })
  } catch (err) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, err)
  }
}

export async function LENS() {
  const [contentType, identifier, start = 0, end = 10] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ contentType, identifier })
  if (missingParamsError) {
    return missingParamsError
  }
  if (end > MAX_PAGE_LIMIT) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT)
  }
  const API_KEY = window.localStorage.getItem(SERVICES_API_KEY.Firefly)
  if (!API_KEY) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Firefly)

  const baseUrl = 'https://openapi.firefly.land/v1/fileverse/fetch'
  const headers = { 'x-api-key': API_KEY }

  const typeMap = {
    posts: 'lensid',
    replies: 'lenspostid'
  }
  const platformContentType = typeMap[contentType]
  if (!platformContentType) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { contentType })
  }
  const query = identifier
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(',')

  const url = new URL(baseUrl)
  url.searchParams.set('query', query)
  url.searchParams.set('type', platformContentType)
  url.searchParams.set('start', String(start))
  url.searchParams.set('end', String(end))

  try {
    const res = await fetch(url.toString(), { headers })
    if (!res.ok) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, res.status)
    }

    const json = await res.json()
    if (!Array.isArray(json?.data)) return []

    return json.data.map((item) => {
      const flat = {}
      for (const [key, value] of Object.entries(item)) {
        if (typeof value !== 'object' || value === null) {
          flat[key] = value
        }
      }
      flat.platform = 'lens'
      return flat
    })
  } catch (err) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, err)
  }
}

export async function FARCASTER() {
  const [contentType, identifier, start = 0, end = 10] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ contentType, identifier })
  if (missingParamsError) {
    return missingParamsError
  }
  if (end > MAX_PAGE_LIMIT) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT)
  }
  const API_KEY = window.localStorage.getItem(SERVICES_API_KEY.Firefly)
  if (!API_KEY) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Firefly)
  const baseUrl = 'https://openapi.firefly.land/v1/fileverse/fetch'
  const headers = { 'x-api-key': API_KEY }

  const typeMap = {
    posts: 'farcasterid',
    replies: 'farcasterpostid',
    channels: 'farcasterchannels'
  }

  const platformContentType = typeMap[contentType]
  if (!platformContentType) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { contentType })
  }
  const query = identifier
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .join(',')

  const url = new URL(baseUrl)
  url.searchParams.set('query', query)
  url.searchParams.set('type', platformContentType)
  url.searchParams.set('start', String(start))
  url.searchParams.set('end', String(end))

  try {
    const res = await fetch(url.toString(), { headers })
    if (!res.ok) errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, res.status)

    const json = await res.json()
    if (!Array.isArray(json?.data)) return []

    return json.data.map((item) => {
      const flat = {}
      for (const [key, value] of Object.entries(item)) {
        if (typeof value !== 'object' || value === null) {
          flat[key] = value
        }
      }
      flat.platform = 'farcaster'
      return flat
    })
  } catch (err) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, err)
  }
}

export async function BLOCKSCOUT() {
  let [address, type, chain, startTimestamp, endTimestamp, page = 1, offset = 10] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ address, type })

  if (missingParamsError) {
    return missingParamsError
  }
  if (offset > MAX_PAGE_LIMIT) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT)
  }
  if (!chain) {
    chain = 'ethereum'
  }

  if (!startTimestamp) {
    const currentTimestamp = Date.now()
    startTimestamp = currentTimestamp - 30 * 24 * 60 * 60 * 1000
    startTimestamp = Math.floor(startTimestamp / 1000)
  }

  if (isNaN(startTimestamp)) {
    startTimestamp = toTimestamp(startTimestamp)
  }

  if (isNaN(endTimestamp) && endTimestamp) {
    endTimestamp = toTimestamp(endTimestamp)
  }

  if (!isAddress(address)) {
    const ensName = address
    address = await fromEnsNameToAddress(address)
    if (!address) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.ENS, ensName)
    }
  }
  const hostname = BLOCKSCOUT_CHAINS_MAP[chain]

  if (!hostname) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_CHAIN, chain)
  }

  let requestUrl

  switch (type) {
    case 'stat':
      requestUrl = `${hostname}/api/v2/addresses/${address}/counters`
      break
    case 'txns':
      requestUrl = `${hostname}/api?module=account&action=txlist&address=${address}&start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}&page=${page}&offset=${offset}&sort=asc`
      break
    case 'tokens':
      requestUrl = `${hostname}/api?module=account&action=tokenlist&address=${address}`
      break
    default:
      return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { type })
  }
  try {
    const response = await fetch(requestUrl)

    if (!response.ok) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, response.status)
    }
    const json = await response.json()
    if (json?.result?.includes('Invalid parameter(s)')) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.CUSTOM, {
        message: 'Invalid parameters',
        reason: json.result
      })
    }
    if (json?.result?.includes('Not found')) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.CUSTOM, {
        message: 'Address information not found',
        reason: json.result
      })
    }

    if (type === 'stat') {
      /*
      For type === "stat"
      [{transactions_count: "2940",token_transfers_count: "8346015",gas_usage_count: "91296738",validations_count: "0"}]
      */
      return [json]
    }

    /*
    For type === "tokens"
    [{balance: "287933140055877783279",contractAddress: "0x0000019226b5a2e87714daebde6a21e67fa88787",decimals: "18",name: "Doge King",symbol: "DOGEK",type: "ERC-20"}]

    For type === "txns"
    [{blockNumber: '65204', timeStamp: '1439232889', blockHash: '0x3c3c3c3c', nonce: '0',....}]
    */
    return json.result
  } catch (error) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, error)
  }
}

export async function BASE() {
  const [type, address, startDate, endDate, page, limit] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ type, address })

  if (missingParamsError) {
    return missingParamsError
  }
  const API_KEY = window.localStorage.getItem(SERVICES_API_KEY.Basescan)
  if (!API_KEY) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Basescan)
  if (limit > MAX_PAGE_LIMIT) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT)
  }
  return handleScanRequest({
    type,
    address,
    startDate,
    endDate,
    page,
    offset: limit,
    apiKey: API_KEY,
    functionName: 'BASE',
    chainId: CHAIN_ID_MAP.base,
    network: 'base'
  })
}
export async function GNOSIS() {
  const [type, address, startDate, endDate, page, limit] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ type, address })

  if (missingParamsError) {
    return missingParamsError
  }
  const API_KEY = window.localStorage.getItem(SERVICES_API_KEY.Gnosisscan)
  if (!API_KEY) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Gnosisscan)
  if (limit > MAX_PAGE_LIMIT) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT)
  }
  return handleScanRequest({
    type,
    network: 'gnosis',
    address,
    startDate,
    endDate,
    page,
    apiKey: API_KEY,
    offset: limit,
    chainId: CHAIN_ID_MAP.gnosis,
    functionName: 'GNOSIS'
  })
}

export async function NEYNAR() {
  const [username] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ username })

  if (missingParamsError) {
    return missingParamsError
  }
  const API_KEY = window.localStorage.getItem(SERVICES_API_KEY.Neynar)
  if (!API_KEY) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Neynar)

  const fid = await fromUsernameToFid(username, API_KEY)

  if (!fid) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { username })
  }

  const url = `https://api.neynar.com/v2/farcaster/followers?fid=${fid}`

  try {
    const response = await fetch(url, {
      headers: {
        'x-api-key': API_KEY,
        'x-neynar-experimental': 'false'
      }
    })
    if (!response.ok) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, response.status)
    }
    const json = await response.json()
    if (!json?.users?.length) return []

    return json.users.map(({ user }) => ({
      username: user.username,
      custody_address: user.custody_address,
      follower_count: user.follower_count,
      country: user.profile?.location?.address?.country || '',
      city: user.profile?.location?.address?.city || ''
    }))
  } catch (err) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, err)
  }
}
// export async function GNOSISPAY({
//   cardId,
//   startDate,
//   endDate,
//   limit = 20,
//   offset = 0,
// }) {
//   const apiKeyKey = SERVICES_API_KEY.GnosisPay
//   const API_KEY = window.localStorage.getItem(apiKeyKey);
//   if (!API_KEY) return `${apiKeyKey}${ERROR_MESSAGES_FLAG.MISSING_KEY}`;
//   if (!cardId) return `${apiKeyKey}${ERROR_MESSAGES_FLAG.INVALID_PARAM}`;
//     if(limit > MAX_PAGE_LIMIT){
//     return ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT
//   }

//   const url = new URL(`https://api.gnosispay.com/cards/${cardId}/transactions`);
//   url.searchParams.set('limit', limit.toString());
//   url.searchParams.set('offset', offset.toString());

//   if (!isNaN(toTimestamp(startDate))) {
//     url.searchParams.set('startDate', new Date(startDate * 1000).toISOString());
//   }

//   if (!isNaN(toTimestamp(endDate))) {
//     url.searchParams.set('endDate', new Date(endDate * 1000).toISOString());
//   }

//   try {
//     const res = await fetch(url.toString(), {
//       headers: {
//         Authorization: `Bearer ${API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

//     const json = await res.json();

//     if (!Array.isArray(json)) return [];

//     return json.map(tx => ({
//       createdAt: tx.createdAt,
//       clearedAt: tx.clearedAt,
//       country: tx.country,
//       merchant: tx.merchant,
//       billingAmount: tx.billingAmount,
//       billingCurrency: tx.billingCurrency,
//       transactionAmount: tx.transactionAmount,
//       transactionCurrency: tx.transactionCurrency,
//       transactionType: tx.transactionType,
//       kind: tx.kind,
//       status: tx.status || null,
//       mcc: tx.mcc,
//     }));
//   } catch (err) {
//     console.error('GNOSISPAY_CARD_TXNS error:', err);
//     return ERROR_MESSAGES_FLAG.DEFAULT;
//   }
// }

export async function ETHERSCAN(...args) {
  const [type, chain, address, startDate, endDate, page, limit] = args
  const missingParamsError = checkRequiredParams({ type, address, chain })

  if (missingParamsError) {
    return missingParamsError
  }

  const chainId = CHAIN_ID_MAP[chain]

  if (!chainId.toString()) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_CHAIN, chain)
  }
  const API_KEY = window.localStorage.getItem(SERVICES_API_KEY.Etherscan)
  if (!API_KEY) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Etherscan)
  return handleScanRequest({
    type,
    address,
    startDate,
    endDate,
    page,
    offset: limit,
    chainId,
    network: chain,
    functionName: 'ETHERSCAN',
    apiKey: API_KEY
  })
}

export async function COINGECKO() {
  const [category, param1, param2] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ category, param1 })

  if (missingParamsError) {
    return missingParamsError
  }
  const API_KEY = window.localStorage.getItem(SERVICES_API_KEY.Coingecko)
  if (!API_KEY) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Coingecko)

  const headers = {
    accept: 'application/json',
    'x-cg-demo-api-key': API_KEY
  }

  let url = ''
  const lowerCategory = (category || '').toLowerCase()

  switch (lowerCategory) {
    case 'price': {
      const token = param1
      const vsCurrencies = param2
      if (!token) {
        return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { param1 })
      }
      url = `https://api.coingecko.com/api/v3/simple/price?vs_currencies=${vsCurrencies ? vsCurrencies : 'usd'}&symbols=${token}`
      break
    }

    case 'market': {
      const ecosystemMap = {
        all: '',
        ethereum: 'ethereum-ecosystem',
        base: 'base-ecosystem',
        solana: 'solana-ecosystem',
        gnosis: 'gnosis-chain',
        hyperliquid: 'hyperliquid-ecosystem',
        bitcoin: 'bitcoin-ecosystem',
        pump: 'pump-ecosystem',
        aiagents: 'ai-agents',
        meme: 'meme-token'
      }

      const key = param1?.toLowerCase()
      const categoryVal = ecosystemMap[key] || ''
      const trend = param2 ? `&price_change_percentage=${param2}` : ''

      url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&include_tokens=top&page=1&per_page=100`
      if (categoryVal) url += `&category=${categoryVal}`
      if (trend) url += trend
      break
    }

    case 'stablecoins': {
      const category = !param1 || param1.toLowerCase() === 'all' ? 'stablecoins' : param1.toLowerCase()

      const trend = param2 ? `&price_change_percentage=${param2}` : ''
      url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&category=${category}&order=market_cap_desc&page=1&per_page=100${trend}`
      break
    }

    case 'derivatives': {
      const exchange = param1
      if (!exchange || exchange === 'all') {
        url = `https://api.coingecko.com/api/v3/derivatives`
      } else {
        url = `https://api.coingecko.com/api/v3/derivatives/exchanges/${exchange}?include_tickers=all`
      }
      break
    }

    default:
      return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { category })
  }

  try {
    const response = await fetch(url, { method: 'GET', headers })
    const json = await response.json()

    if (!response.ok) {
      const message = json?.status?.error_message || ''
      if (message.includes('API Key Missing')) {
        return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_API_KEY, SERVICES_API_KEY.Coingecko)
      }
      return errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, response.status)
    }

    if (lowerCategory === 'price') {
      const output = {}
      for (const [token, prices] of Object.entries(json)) {
        for (const [currency, value] of Object.entries(prices)) {
          const key = `${token.charAt(0).toUpperCase() + token.slice(1)}_${currency.toUpperCase()}`
          output[key] = value
        }
      }
      return [output]
    }

    let data = json

    if (lowerCategory === 'derivatives') {
      if (json.length > 200) {
        data = json.slice(0, 200)
      }

      if (param1 !== 'all' && json && json.tickers) {
        const exchangeDetails = {
          exchange_id: param1,
          exchange_name: json.name,
          exchange_logo: json.logo,
          exchange_url: json.url,
          exchange_trade_volume_24h_btc: json.trade_volume_24h_btc,
          exchange_number_of_futures_pairs: json.number_of_futures_pairs,
          exchange_number_of_perpetual_pairs: json.number_of_perpetual_pairs,
          exchange_open_interest_btc: json.open_interest_btc
        }
        data = json.tickers.slice(0, 200).map((item) => {
          return {
            ...item,
            ...exchangeDetails,
            usd_volume: item.converted_volume && item.converted_volume.usd
          }
        })
      }
    }

    const flatArray = Array.isArray(data) ? data : [data]
    return flatArray.map((item) => {
      const flat = {}
      for (const [key, value] of Object.entries(item)) {
        if (typeof value !== 'object' || value === null) {
          flat[key] = value
        }
      }
      return flat
    })
  } catch (error) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, error)
  }
}

export async function EOA() {
  let [addresses, category, chains, startTime, endTime, page = 1, offset = 10] = utils.argsToArray(arguments)

  const optionalParams = category === 'balance' ? {} : {startTime, endTime}

  const missingParamsError = checkRequiredParams({ addresses, category, chains, ...optionalParams })

  if (missingParamsError) {
    return missingParamsError
  }

  if (offset > MAX_PAGE_LIMIT) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT)
  }

  const API_KEY = window.localStorage.getItem(SERVICES_API_KEY.Etherscan)
  if (!API_KEY) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Etherscan)
  const INPUTS = addresses
    .split(',')
    .map((a) => a.trim())
    .filter(Boolean)
  const CHAINS = chains
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean)
  const out = []
  // Map: finalAddress => ENS name (if applicable)
  const ADDRESS_MAP = {}
  for (const input of INPUTS) {
    if (isAddress(input)) {
      ADDRESS_MAP[input.toLowerCase()] = null // it's a direct address
    } else {
      try {
        const resolved = await fromEnsNameToAddress(input) // ENS -> address
        if (resolved) ADDRESS_MAP[resolved.toLowerCase()] = input
      } catch {
        return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { addresses })
      }
    }
  }
  const ADDRS = Object.keys(ADDRESS_MAP)
  for (const chain of CHAINS) {
    const chainId = CHAIN_ID_MAP[chain]
    if (!chainId) return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_CHAIN, chain)
    if (category === 'balance') {
      for (let i = 0; i < ADDRS.length; i += 20) {
        const slice = ADDRS.slice(i, i + 20).join(',')
        const action = 'addresstokenbalance'
        const url =
          `https://api.etherscan.io/v2/api?chainid=${chainId}` +
          `&module=account&action=${action}&address=${slice}` +
          `&page=${page}&offset=100&apikey=${API_KEY}`
        const data = await fetchJSON(url)
        if (typeof data === 'string') return data
        data.forEach((tx) =>
          out.push({
            chain,
            address: ADDRS[i],
            name: ADDRESS_MAP[ADDRS[i]],
            ...tx
          })
        )
      }
      continue
    }
    if (category === 'txns') {
      const startBlock = await fromTimeStampToBlock(toTimestamp(startTime), chain, API_KEY)
      const endBlock = await fromTimeStampToBlock(toTimestamp(endTime), chain, API_KEY)
      if (!startBlock.toString()) {
        return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { startTime })
      }
      if (!endBlock.toString()) {
        return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { endTime })
      }
      for (const addr of ADDRS) {
        const url =
          `https://api.etherscan.io/v2/api?chainid=${chainId}` +
          `&module=account&action=tokentx&address=${addr}` +
          `&startblock=${startBlock}&endblock=${endBlock}` +
          `&page=${page}&offset=${offset}&sort=asc&apikey=${API_KEY}`
        const data = await fetchJSON(url)
        if (typeof data === 'string') return data
        data.forEach((tx) =>
          out.push({
            chain,
            address: addr,
            name: ADDRESS_MAP[addr],
            ...tx
          })
        )
      }
      continue
    }
    return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { category })
  }

  return out

  async function fetchJSON(url) {
    try {
      const res = await fetch(url)
      if (!res.ok) {
        return errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, res.status)
      }

      const json = await res.json()

      if (json.result?.includes?.('Invalid API Key'))
        return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_API_KEY, SERVICES_API_KEY.Etherscan)

      if (json.result?.includes?.('Max rate limit reached'))
        return errorMessageHandler(ERROR_MESSAGES_FLAG.RATE_LIMIT, SERVICES_API_KEY.Etherscan)

      if (json.status === '0' && json.message !== 'No transactions found')
        return errorMessageHandler(ERROR_MESSAGES_FLAG.CUSTOM, {
          message: json.message || 'Api Error',
          reason: json.message || 'json.status === "0" && json.message !== "No transactions found"'
        })

      return json.result
    } catch (err) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, err)
    }
  }
}

export async function FLVURL(token, vs_currencies) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([{ Yoo: 'gotcha' }])
    }, 10000)
  })
}

export async function SAFE() {
  let [address, utility, chain, limit = 10, offset = 0] = utils.argsToArray(arguments)

  const missingParamsError = checkRequiredParams({ address, utility, chain })

  if (missingParamsError) {
    return missingParamsError
  }

  if (offset > MAX_PAGE_LIMIT) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT)
  }

  const apiKey = window.localStorage.getItem(SERVICES_API_KEY.Safe)

  if (!apiKey) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Safe)

  if (typeof limit !== 'number' || limit < 0) return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { limit })
  if (typeof offset !== 'number' || offset < 0)
    return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { offset })
  if (utility !== 'txns') return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { utility })
  if (limit > MAX_PAGE_LIMIT) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT)
  }

  const chainIdentifier = SAFE_CHAIN_MAP[chain]

  if (!chainIdentifier) return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_CHAIN, { chain })

  if (!isAddress(address)) {
    const ensName = address
    address = await fromEnsNameToAddress(address)
    if (!address) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.ENS, ensName)
    }
  }

  const url = `https://api.safe.global/tx-service/${chainIdentifier}/api/v2/safes/${address}/multisig-transactions?limit=${limit}&offset=${offset}`
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    })
    if (!response.ok) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, response.status)
    }
    const json = await response.json()
    if (!Array.isArray(json.results)) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.CUSTOM, { message: 'Invalid API response' })
    }
    // remove nested structure from the response
    return json.results.map(({ confirmations, dataDecoded, ...rest }) => rest)
  } catch (e) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, e)
  }
}

export async function DEFILLAMA() {
  let [category] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ category })

  if (missingParamsError) {
    return missingParamsError
  }
  const apiKey = window.localStorage.getItem(SERVICES_API_KEY.Defillama)
  if (!apiKey) return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_KEY, SERVICES_API_KEY.Defillama)
  const categoryList = ['protocols', 'yields', 'dex', 'fees']
  const categoryMap = {
    [categoryList[0]]: 'https://api.llama.fi/protocols',
    [categoryList[1]]: 'https://yields.llama.fi/pools',
    [categoryList[2]]:
      'https://api.llama.fi/overview/dexs?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true',
    [categoryList[3]]:
      'https://api.llama.fi/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyFees'
  }
  let url = categoryMap[category]

  if (!url) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.INVALID_PARAM, { category })
  }

  try {
    const response = await fetch(url)
    if (!response.ok) return errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, response.status)
    let json = await response.json()
    switch (category) {
      case categoryList[0]: {
        if (json.length > 500) {
          json = json.slice(0, 500)
        }
        break
      }
      case categoryList[1]: {
        json = json.data.slice(0, 500)
        break
      }
      case categoryList[2]: {
        json = json.protocols.slice(0, 500)
        break
      }
      case categoryList[3]: {
        json = json.protocols.slice(0, 500)
        break
      }
    }

    return removeNestedStructure(Array.isArray(json) ? json : [json])
  } catch (e) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, e)
  }
}

export async function UNISWAP() {
  const [graphType, category, param1, param2] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ graphType, category, param1 })

  if (missingParamsError) {
    return missingParamsError
  }
  const baseUrl = 'https://onchain-proxy.fileverse.io/third-party'
  try {
    const url = `${baseUrl}?service=uniswap&graphType=${graphType}&category=${category}&input1=${param1}&input2=${param2}`
    const res = await fetch(url)
    if (!res.ok) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, res.status)
    }
    const json = await res.json()
    return removeNestedStructure(json)
  } catch (err) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, err)
  }
}

export async function AAVE() {
  const [graphType, category, param1, param2] = utils.argsToArray(arguments)
  const missingParamsError = checkRequiredParams({ graphType, category, param1 })

  if (missingParamsError) {
    return missingParamsError
  }
  const baseUrl = 'https://onchain-proxy.fileverse.io/third-party'
  try {
    const url = `${baseUrl}?service=aave&graphType=${graphType}&category=${category}&input1=${param1}&input2=${param2}`
    const res = await fetch(url)
    if (!res.ok) {
      return errorMessageHandler(ERROR_MESSAGES_FLAG.NETWORK_ERROR, res.status)
    }
    const json = await res.json()
    return removeNestedStructure(json)
  } catch (err) {
    return errorMessageHandler(ERROR_MESSAGES_FLAG.DEFAULT, err)
  }
}

export function POLYMARKET() {
  return 'Coming Soon'
}

export function PRIVACYPOOL() {
  return 'Coming Soon'
}

export function ROTKI() {
  return 'Coming Soon'
}

export function MEERKAT() {
  return 'Coming Soon'
}

export function ARTEMIS() {
  return 'Coming Soon'
}

export function TALLY() {
  return 'Coming Soon'
}

export function MYANIMELIST() {
  return 'Coming Soon'
}
