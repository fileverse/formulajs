import { CHAIN_ID_MAP } from './constants'
import { getUrlAndHeaders } from './proxy-url-verify'
import { SERVICE_API_KEY } from '../crypto-constants'


export const fromTimeStampToBlock = async (timestamp, chain, apiKey) => {
  if (!timestamp || !chain || !apiKey) return
  const chainId = CHAIN_ID_MAP[chain];
  const url = `https://api.etherscan.io/v2/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}&chainId=${chainId}`;
  const { URL: finalUrl, HEADERS } = getUrlAndHeaders(url, SERVICE_API_KEY.Etherscan, 'etherscan')
  const res = await fetch(finalUrl, {
    method: 'GET',
    headers: HEADERS,
  });
  const json = await res.json();
  return parseInt(json.result);

};