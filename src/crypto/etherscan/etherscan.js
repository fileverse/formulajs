/* global window */

import { SERVICES_API_KEY, CHAIN_ID_MAP } from '../../utils/constants.js'
import * as utils from '../../utils/common.js'
import { ValidationError } from '../../utils/error-instances.js'
import { errorMessageHandler, validateParams } from '../../utils/error-messages-handler.js'
import { handleScanRequest } from '../../utils/handle-explorer-request.js'
import { etherscanParamsSchema } from './etherscan-schema.js'





export async function ETHERSCAN() {
  try {
    const [type, chain, address, startDate, endDate, page = 1, limit = 10, columnName] =
      utils.argsToArray(arguments)


    validateParams(etherscanParamsSchema, { type, chain, address, startDate, endDate, page, limit, columnName })

    const chainId = CHAIN_ID_MAP[chain]
    if (!chainId) throw new ValidationError(`Invalid chain: ${chain}`)

    const apiKey = window.localStorage.getItem(SERVICES_API_KEY.Etherscan)

    const out = await handleScanRequest({
      type,
      address,
      startDate,
      endDate,
      page,
      offset: limit,
      apiKey,
      functionName: 'ETHERSCAN',
      chainId,
      network: chain,
    });
    if (columnName) {
      const filterColumnName = columnName.split(',').map(s => s.trim())
      return out.map(obj =>
        Object.fromEntries(
          filterColumnName
            .filter(key => key in obj)
            .map(key => [key, obj[key]])
        )
      );
    }
    return out
  } catch (err) {
    return errorMessageHandler(err, 'ETHERSCAN')
  }
}