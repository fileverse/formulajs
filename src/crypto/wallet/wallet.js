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
      const [addresses, chains, query, time] = utils.argsToArray(arguments)
      validateParams(walletParamsSchema, { addresses, chains, query, time })

      const baseUrl = 'http://localhost:3000/third-party'

      const resolvedAddresses = await getResolvedAddresses(addresses)

      let url = `${baseUrl}?service=wallet&addresses=${resolvedAddresses}&chains=${chains}&query=${query}`
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
      if(query === 'txns'){
        return json.transactions
      }
      return json.balances

    } catch (error) {
        return errorMessageHandler(error, 'WALLET')
    }
}


// WALLET("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "ethereum", "balance", "720,1,24").then(console.log)
// WALLET("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045, 0xfA0253943c3FF0e43898cba5A7a0dA9D17C27995", "ethereum", "txns", "720").then(console.log)
// WALLET("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "ethereum", "balance").then(console.log)