/* global window */

import { SERVICES_API_KEY } from '../../utils/constants.js'
import * as utils from '../../utils/common.js'
import { errorMessageHandler, validateParams } from '../../utils/error-messages-handler.js'
import { duneSimParamsSchema } from './dune-sim.schema.js'
import { NetworkError } from '../../utils/error-instances.js'
import { getUrlAndHeaders } from '../../utils/proxy-url-map.js'
import { flattenObject } from '../../utils/flatten-object.js'
import * as fromEnsNameToAddressUtil from '../../utils/from-ens-name-to-address.js'






export async function DUNESIM() {
  try {
    const [type, wallet] = utils.argsToArray(arguments)

    validateParams(duneSimParamsSchema, { wallet, type })
    const address = await fromEnsNameToAddressUtil.default.validateAndGetAddress(wallet)
    const apiKey = window.localStorage.getItem(SERVICES_API_KEY.DuneSim)
    const url = `https://api.sim.dune.com/v1/evm/activity/${address}`

    const { URL: finalUrl, HEADERS } = getUrlAndHeaders({
      url: url, serviceName: 'DuneSim',
        headers: {
          'X-Sim-Api-Key': apiKey,
        }
      
    });

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: HEADERS,
    })
    if (!response.ok) {
      throw new NetworkError(SERVICES_API_KEY.DuneSim, response.status)
    }

    const json = await response.json()
    const activity =  json?.activity || []
    return activity.map((item) => flattenObject(item))
  } catch (err) {
    return errorMessageHandler(err, 'DUNESIM')
  }
}