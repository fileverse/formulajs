import { DEFILLAMA } from "../defillama/defillama.js"
import * as utils from '../../utils/common.js'
import { errorMessageHandler, validateParams } from "../../utils/error-messages-handler.js"
import { yieldParamsSchema } from './yield.schema.js'

export async function YIELD () {

    try {
            const [category] = utils.argsToArray(arguments)
        
            validateParams(yieldParamsSchema, { category })
        
            const response = await DEFILLAMA('yields')
        
            if(response.functionName){
                response.functionName = 'YIELD'
                return response
            }
        
            if(category === 'all'){
                return response
            }
            const result = response.filter(data => data.stablecoin)
            return result
        
    } catch (error) {
        return errorMessageHandler(error, 'YIELD')
    }
}