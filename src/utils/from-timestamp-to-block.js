import { CHAIN_ID_MAP } from './constants.js'
import { getUrlAndHeaders } from './proxy-url-map.js'

const fromTimeStampToBlock = async (timestamp, chain, apiKey) => {
  console.log('fromTimeStampToBlock', timestamp, chain, apiKey)
  if (!timestamp || !chain || !apiKey) return
  const chainId = CHAIN_ID_MAP[chain];
  console.log('chainId', chainId)
  const url = `https://api.etherscan.io/v2/api?module=block&action=getblocknobytime&timestamp=${timestamp}&closest=before&apikey=${apiKey}&chainId=${chainId}`;
  console.log('url', url, getUrlAndHeaders);
  const { URL: finalUrl, HEADERS } = getUrlAndHeaders({ url, serviceName: 'Etherscan', headers: {} });
  console.log('finalUrl', finalUrl, HEADERS)
  const res = await fetch(finalUrl, {
    method: 'GET',
    headers: HEADERS,
  });
  console.log('res', res, finalUrl, HEADERS)
  const json = await res.json();
  return parseInt(json.result);

};

export default {
  fromTimeStampToBlock
}
