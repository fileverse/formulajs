import { CirclesData } from '@circles-sdk/data'
import * as utils from '../../utils/common.js'
import { errorMessageHandler, validateParams } from '../../utils/error-messages-handler.js'
import { circlesParamsSchema } from './circles-schema.js'
import * as fromEnsNameToAddressUtil from '../../utils/from-ens-name-to-address.js'
import { ValidationError } from '../../utils/error-instances.js'

export async function CIRCLES() {
  try {
    const [functionName, address, entries, columnName] = utils.argsToArray(arguments)

    validateParams(circlesParamsSchema, { functionName, address, entries, columnName });

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
        const dataTrust = await runOnePage(dataClient.getTrustRelations(resolved, limit));
        if (columnName) {
          const filterColumnName = columnName.split(',').map(s => s.trim());
          return dataTrust.map(obj =>
            Object.fromEntries(
              filterColumnName
                .filter(key => key in obj)
                .map(key => [key, obj[key]])
            )
          );
        } else {
          return dataTrust;
        }

      case 'transactions':
        const data = await runOnePage(dataClient.getTransactionHistory(resolved, limit));
        if (columnName) {
          const filterColumnName = columnName.split(',').map(s => s.trim());
          return data.map(obj =>
            Object.fromEntries(
              filterColumnName
                .filter(key => key in obj)
                .map(key => [key, obj[key]])
            )
          );
        } else {
          return data;
        }

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
