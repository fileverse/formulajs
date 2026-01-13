import { DEFILLAMA } from "../defillama/defillama.js"
import * as utils from '../../utils/common.js'
import { errorMessageHandler, validateParams } from "../../utils/error-messages-handler.js"
import { yieldParamsSchema } from './yield.schema.js'

export async function YIELD() {

    try {
        const [category, columnName] = utils.argsToArray(arguments)

        validateParams(yieldParamsSchema, { category, columnName })

        const response = await DEFILLAMA('yields');
        let returnValue;

        const filterColumnName = columnName?.split(',').map(s => s.trim());

        if (response.functionName) {
            response.functionName = 'YIELD';
            returnValue = response;
        }

        if (category === 'all') {
            returnValue = response;
        }

        const result = response.filter(data => data.stablecoin)
        returnValue = result;

        return (Array.isArray(returnValue) ? returnValue : [returnValue]).map(item => {
            if (!filterColumnName) return item
            const out = {};
            for (const [k, v] of Object.entries(item)) {
                if ((columnName && filterColumnName.includes(k)) && (v === null || typeof v !== 'object')) out[k] = v;
            }
            return out
        })

    } catch (error) {
        return errorMessageHandler(error, 'YIELD')
    }
}