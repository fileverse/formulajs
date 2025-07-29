import * as utils from '../../utils/common.js'
import { errorMessageHandler } from '../../utils/error-messages-handler.js'

export function SMARTCONTRACT() {
  try {
    const args = utils.argsToArray(arguments)

    return {
      callSignature: args,
      responseType: 'smart-contract'
    }
  } catch (error) {
    return errorMessageHandler(error, 'SMARTCONTRACT')
  }
}
