import * as utils from '../../utils/common.js'
import { NetworkError } from '../../utils/error-instances.js'
import { errorMessageHandler, validateParams } from '../../utils/error-messages-handler.js'
import { tallyParamsSchema } from './tally-schema.js'

export async function TALLY() {
  try {
    const [query, slug] = utils.argsToArray(arguments)

    validateParams(tallyParamsSchema, { query, slug })

    const baseUrl = 'https://onchain-proxy.fileverse.io/third-party'
    const url =
      `${baseUrl}` +
      `?service=tally` +
      `&input1=${encodeURIComponent(query)}` +
      `&input2=${encodeURIComponent(slug)}`
    const res = await fetch(url)
    if (!res.ok) {
      throw new NetworkError('TALLY', res.status)
    }

    const data = await res.json()
    return data
  } catch (err) {
    return errorMessageHandler(err, 'TALLY')
  }
}