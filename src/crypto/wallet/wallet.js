import * as utils from '../../utils/common.js'
import { errorMessageHandler, validateParams } from '../../utils/error-messages-handler.js'
import { walletParamsSchema } from './wallet.schema.js'
import { ValidationError, NetworkError } from '../../utils/error-instances.js'
import * as fromEnsNameToAddressUtil from '../../utils/from-ens-name-to-address.js'

const getResolvedAddresses = async (addresses) => {
    const addressesList = addresses.split(',')
    const resolvedAddresses = []
    for(let address of addressesList){
        const data = await fromEnsNameToAddressUtil.default.validateAndGetAddress(address) 
        resolvedAddresses.push(data)
    }
    return resolvedAddresses.join(',')
}

export async function WALLET() {
    try {
      let [addresses, chains, query, time] = utils.argsToArray(arguments)
      validateParams(walletParamsSchema, { addresses, chains, query, time })

      addresses = addresses?.replace(/\s+/g, "")
      chains = chains?.replace(/\s+/g, "")
      time = time?.replace(/\s+/g, "")
      const baseUrl = 'https://onchain-proxy.fileverse.io'

      const resolvedAddresses = await getResolvedAddresses(addresses)

      let url = `${baseUrl}/third-party?service=wallet&addresses=${resolvedAddresses}&chains=${chains}&query=${query}`
      if (time) {
          url += `&time=${time}`
      }

      const res = await fetch(url)

        if(res.status === 400){
            const errorData = await res.json()
            throw new ValidationError(errorData.message)
        }

      if (!res.ok) {
          throw new NetworkError('WALLET', res.status)
      }

      const json = await res.json()
      return json

    } catch (error) {
        return errorMessageHandler(error, 'WALLET')
    }
}


// WALLET("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "ethereum", "balance", "720,1,24").then(console.log)
// WALLET("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045, 0x50Aa3435E310d5a2d15a989Bc353ce7f5682E1d4", "ethereum, base", "balance", "720").then(console.log)
// WALLET("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "ethereum", "balance").then(console.log)