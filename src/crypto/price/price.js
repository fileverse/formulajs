import * as utils from '../../utils/common.js'
import { errorMessageHandler, validateParams } from '../../utils/error-messages-handler.js'
import { priceSchema } from './price.schema.js'
import * as isAddressUtil from '../../utils/is-address.js'
import { ValidationError, NetworkError } from '../../utils/error-instances.js'


export async function PRICE() {
    try {
        const [input1, input2, input3] = utils.argsToArray(arguments)
        validateParams(priceSchema, { input1, input2, input3 })

        // eslint-disable-next-line no-undef
        const baseUrl = window.useLocal ? 'http://localhost:3000' : 'https://onchain-proxy.fileverse.io'

        let url = `${baseUrl}` +
            `/third-party?service=price`

        let returnSingleValue = false


        if(isAddressUtil.default.isAddress(input1)) {
            const tokenAddress = input1
            url += `&token=${encodeURIComponent(tokenAddress)}&chain=${encodeURIComponent(input2)}`
            if(input3){
                url += `&time=${encodeURIComponent(input3)}`
            }
        } else {
            const coin = input1
            url += `&coin=${encodeURIComponent(coin)}`
            if (input2) {
                url += `&time=${encodeURIComponent(input2)}`
            } else {
               returnSingleValue = true
            }
        }

        const res = await fetch(url)

        if(res.status === 400){
            const errorData = await res.json()
            throw new ValidationError(errorData.message)
        }
        if (!res.ok) {
        throw new NetworkError('PRICE', res.status)
        }


        const json = await res.json()

        const data = json.price

        if(returnSingleValue){
            return data[0].price
        }

        return data

    } catch (error) {
        return errorMessageHandler(error, 'PRICE')
    }
}


// PRICE("btc,eth", "720,1,24").then(console.log)
// PRICE("btc").then(console.log)
// PRICE("btc,eth").then(console.log)

// PRICE("0xd9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca", "base").then(console.log)
