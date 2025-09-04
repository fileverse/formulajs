

import { SERVICES_API_KEY } from '../../utils/constants.js'
import * as utils from '../../utils/common.js'
import { errorMessageHandler, validateParams } from '../../utils/error-messages-handler.js'
import { duneSimParamsSchema } from './dune-sim.schema.js'
import { NetworkError } from '../../utils/error-instances.js'
import { getUrlAndHeaders } from '../../utils/proxy-url-map.js'
import { flattenObject } from '../../utils/flatten-object.js'
import * as fromEnsNameToAddressUtil from '../../utils/from-ens-name-to-address.js'


const SUPPORTED_TOKEN_NAMES = {
  "eth": 1,
  "base": 8453,
  "polygon": 137,
  "arbitrum": 42161,
  "optimism": 10,
  "gnosis": 100,
  "bsc": 56,
  "avalanche": 43114,
  "fantom": 250,
  "scroll": 534352,
  "linea": 59144,
  "ethereum": 1
};



function formatNumber(raw, decimals) {
  if(!decimals){
    return raw
  }
  const quorum = BigInt(raw)
  const divisor = 10 ** decimals;
  const normalized = Number(quorum) / divisor;

  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(normalized);
}

let cachedChains = null;
export async function getChainName(chainId){
  try {
      if (!cachedChains) {
        const res = await fetch("https://chainid.network/chains_mini.json");
        if (!res.ok) throw new Error("Failed to fetch chains.json");
        cachedChains = await res.json();
      }
    
      const chain = cachedChains.find(c => c.chainId === chainId);
      return chain ? chain.name : chainId;
  } catch (error) {
      console.log(error)
      return chainId
    }
}



export async function DUNE() {
  try {
    const [type, input1, input2, input3, input4] = utils.argsToArray(arguments);

    validateParams(duneSimParamsSchema, { type, input1, input2, input3, input4 });

    let route = "";

    // Helper to assemble query pieces
    const buildQuery = (pairs) => {
      const parts = pairs
        // eslint-disable-next-line no-unused-vars
        .filter(([_, v]) => v !== undefined && v !== '')
        .map(([k, v]) => `${k}=${encodeURIComponent(v)}`);
      return parts.length ? `?${parts.join('&')}` : '';
    };

    if (type === 'activity') {
      const address = await fromEnsNameToAddressUtil.default.validateAndGetAddress(input1)
      const qs = buildQuery([['chain_ids', SUPPORTED_TOKEN_NAMES[input2] || input2], ['limit', input3]]);
      route = `activity/${address}${qs}`;
    }

    if (type === 'price') {
      const chain = SUPPORTED_TOKEN_NAMES[input1] || input1;
      const qs = buildQuery([
        ['chain_ids', chain],
        ['historical_prices', input2],
        ['limit', input4],
      ]);
      const tokenAddress = input3 || "native"
      route = `token-info/${tokenAddress}${qs}`;
    }

    if (type === 'token-holders') {
      const qs = buildQuery([['limit', input3]]);
      const chain = SUPPORTED_TOKEN_NAMES[input2] || input2
      route = `token-holders/${chain}/${input1}${qs}`;
    }

    const apiKey = window.localStorage.getItem(SERVICES_API_KEY.DuneSim)
    const url = `https://api.sim.dune.com/v1/evm/${route}`;

    const { URL: finalUrl, HEADERS } = getUrlAndHeaders({
      url, serviceName: "DuneSim",
      headers: { "X-Sim-Api-Key": apiKey },
    });

    const res = await fetch(finalUrl, { method: "GET", headers: HEADERS });
    if (!res.ok) throw new NetworkError(SERVICES_API_KEY.DuneSim, res.status);

    const json = await res.json();
    const data =
      type === "activity" ? json?.activity ?? json ?? [] :
      type === "token-holders" ? json?.holders ?? json ?? [] :
      type === "price" ? json?.tokens ?? json ?? [] :
      json ?? [];
    const result = (Array.isArray(data) ? data : [data])

    const final = []

    let globalDecimals

    for(let item of result){
      if(item?.decimals){
        if(item?.total_supply){
          item.total_supply = formatNumber(item?.total_supply, item.decimals)
        }
        if(item?.fully_diluted_value){
          item.fully_diluted_value = formatNumber(item?.fully_diluted_value, item.decimals)
        }
      }
      if(item?.first_acquired){
        item.first_acquired = new Intl.DateTimeFormat("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit"
        }).format(new Date(item.first_acquired));
      }
      if(item.historical_prices){
        const prices = item.historical_prices
        prices.forEach((priceData) => {
          const key = "price_" + priceData.offset_hours +"h"
          const price = priceData.price_usd 
          item[key] = price
        })
      }

      if(type === 'price'){
        delete item["chain_id"]
        delete item["decimals"]
        delete item["logo"]
      }
      if(type === 'activity'){
        item.chain_id = await getChainName(item.chain_id)
      }
      if(type === 'token-holders'){
        if(item.balance){
          if(!globalDecimals){
            try {
              const chain = SUPPORTED_TOKEN_NAMES[input2] || input2
              const url = `https://api.sim.dune.com/v1/evm/token-info/${input1}?chain_ids=${chain}`;
              const { URL: finalUrl, HEADERS } = getUrlAndHeaders({
                url, serviceName: "DuneSim",
                headers: { "X-Sim-Api-Key": apiKey },
              });
              const res = await fetch(finalUrl, { method: "GET", headers: HEADERS });
              const resData = await res.json();
              const decimals = resData.tokens[0]?.decimals
              globalDecimals = decimals
            } catch (error) {
              console.log(error)
            }
          }
          item.balance =  formatNumber(item.balance, globalDecimals)
        }
      }
       final.push(flattenObject(item))

    }
    return final
  } catch (err) {
    return errorMessageHandler(err, "DUNE");
  }
}
