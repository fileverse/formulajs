import * as utils from '../../utils/common.js'
import { errorMessageHandler, validateParams } from '../../utils/error-messages-handler.js'
import { walletParamsSchema } from './wallet.schema.js'
import { ValidationError, NetworkError } from '../../utils/error-instances.js'
// import * as fromEnsNameToAddressUtil from '../../utils/from-ens-name-to-address.js'

// const getResolvedAddresses = async (addresses) => {
//     const addressesList = addresses.split(',')
//     const resolvedAddresses = []
//     for(let address of addressesList){
//         const data = await fromEnsNameToAddressUtil.default.validateAndGetAddress(address) 
//         resolvedAddresses.push(data)
//     }
//     return resolvedAddresses.join(',')
// }

export async function WALLET() {
    try {
      const [addresses, chains, query, time] = utils.argsToArray(arguments)
      validateParams(walletParamsSchema, { addresses, chains, query, time })

      const baseUrl = 'http://localhost:3000/third-party'

    //   const resolvedAddresses = await getResolvedAddresses(addresses)

      let url = `${baseUrl}?service=wallet&addresses=${encodeURIComponent(addresses)}&chains=${encodeURIComponent(chains)}&query=${encodeURIComponent(query)}`
      if (time) {
          url += `&time=${encodeURIComponent(time)}`
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
