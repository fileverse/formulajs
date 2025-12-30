/* global window */

import { errorMessageHandler, validateParams } from "../../utils/error-messages-handler.js"
import * as utils from '../../utils/common.js'
import {baseParamsSchema} from './base-schema.js'
import { handleScanRequest } from "../../utils/handle-explorer-request.js"
import { SERVICES_API_KEY, CHAIN_ID_MAP } from "../../utils/constants.js"

export async function BASE() {
  try {
    const [type, address, startDate, endDate, page, limit, columnName] = utils.argsToArray(arguments)
    validateParams(baseParamsSchema, { type, address, startDate, endDate, page, limit, columnName })
    const API_KEY = window.localStorage.getItem(SERVICES_API_KEY.Basescan)

    const out = await handleScanRequest({
      type,
      address,
      startDate,
      endDate,
      page,
      offset: limit,
      apiKey: API_KEY,
      functionName: 'BASE',
      chainId: CHAIN_ID_MAP.base,
      network: 'base'
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
  } catch (error) {
    return errorMessageHandler(error, 'BASE')
  }
}