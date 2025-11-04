import { CirclesData } from '@circles-sdk/data'
import * as utils from '../../utils/common.js'
import { errorMessageHandler, validateParams } from '../../utils/error-messages-handler.js'
import { circlesParamsSchema } from './circles-schema.js'
import * as fromEnsNameToAddressUtil from '../../utils/from-ens-name-to-address.js'
import { ValidationError } from '../../utils/error-instances.js'

export async function CIRCLES() {
  try {
    const [address, functionName, entries] = utils.argsToArray(arguments)

    validateParams(circlesParamsSchema, { address, functionName, entries })

    const resolved = await fromEnsNameToAddressUtil.default.validateAndGetAddress(address)
    const dataClient = new CirclesData('https://rpc.aboutcircles.com')

    const limit = Number.isFinite(Number(entries)) && Number(entries) > 0 ? Number(entries) : 10

    const runOnePage = async (maybeQuery) => {
      const q = await maybeQuery
      if (q && typeof q.queryNextPage === 'function') {
        const has = await q.queryNextPage()
        return has ? (q.currentPage?.results ?? []) : []
      }
      return q
    }

    switch (functionName) {
      case 'trust':
        return await runOnePage(dataClient.getTrustRelations(resolved, limit))

      case 'transactions':
        return await runOnePage(dataClient.getTransactionHistory(resolved, limit))

      case 'profile': {
        const res = await dataClient.getAvatarInfo(resolved)
        return [res]
      }

      case 'balances': {
        const balance = await dataClient.getTotalBalanceV2(resolved)
        return [{ 'CRC Balance': balance }]
      }
      default:
        throw new ValidationError('Unsupported functionName')
    }
  } catch (error) {
    return errorMessageHandler(error, 'CIRCLES')
  }
}
