import * as utils from '../../utils/common.js'
import { errorMessageHandler } from '../../utils/error-messages-handler.js'

export async function SMARTCONTRACT() {
  try {
    const args = utils.argsToArray(arguments)
    console.log(args, arguments)

    return new Promise((resolve) => {
    resolve( {
      callSignature: args,
      responseType: 'smart-contract'
    })
    })


  } catch (error) {
    return errorMessageHandler(error, 'SMARTCONTRACT')
  }
}
