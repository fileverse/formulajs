import { ERROR_MESSAGES_FLAG, MAX_PAGE_LIMIT } from './constants.js'

export const errorMessageHandler = (errorFlag, input, functionName) => {
  if (!functionName) {
    const stack = new Error().stack?.split('\n')[2]
    const match = stack?.match(/at (\w+)/)
    functionName = match?.[1]
  }

  switch (errorFlag) {
    case ERROR_MESSAGES_FLAG.INVALID_ADDRESS:
      return {
        message: `${input} is not a supported address`,
        functionName,
        type: errorFlag
      }

    case ERROR_MESSAGES_FLAG.INVALID_PARAM: {
      const key = Object.keys(input)[0]
      const value = input[key]
      return {
        message: `${value} is an invalid value for ${key}`,
        functionName,
        type: errorFlag
      }
    }

    case ERROR_MESSAGES_FLAG.INVALID_CHAIN:
      return {
        message: `${input} is not a supported chain for this function `,
        functionName,
        type: errorFlag
      }

    case ERROR_MESSAGES_FLAG.RATE_LIMIT:
      return {
        message: `Rate limit for ${input || functionName || 'this api'} has been reached`,
        functionName,
        type: errorFlag
      }

    case ERROR_MESSAGES_FLAG.MISSING_KEY:
      return {
        message: `Api key for ${input || functionName || 'this api'} is missing`,
        functionName,
        type: errorFlag
      }

    case ERROR_MESSAGES_FLAG.NETWORK_ERROR:
      if (input === 429) {
        return {
          message: `Rate limit for ${functionName || 'this function'} has been reached`,
          functionName,
          type: ERROR_MESSAGES_FLAG.RATE_LIMIT
        }
      }
      return {
        message: `Api failed with status code ${input}`,
        functionName,
        type: errorFlag
      }

    case ERROR_MESSAGES_FLAG.MISSING_PARAM:
      return {
        message: `Missing param: ${input}`,
        functionName,
        type: errorFlag
      }

    case ERROR_MESSAGES_FLAG.ENS:
      return {
        message: `${input} is not a supported ens name`,
        functionName,
        type: errorFlag
      }

    case ERROR_MESSAGES_FLAG.CUSTOM:
      return {
        message: input.message,
        functionName,
        type: errorFlag,
        reason: input.reason || input.message
      }

    case ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT:
      return {
        message: `Max page limit is ${MAX_PAGE_LIMIT}`,
        functionName,
        type: errorFlag
      }

    case ERROR_MESSAGES_FLAG.INVALID_API_KEY:
      return {
        message: `${input}: Invalid API key`,
        functionName,
        type: errorFlag
      }

    default:
      return {
        message: 'An unexpected error occured',
        functionName,
        type: errorFlag,
        reason: input
      }
  }
}





export const checkRequiredParams = (inputMap) => {
  for (const key in inputMap) {
    if (!inputMap[key]) {
      const stack = new Error().stack?.split('\n')[2]
      const match = stack?.match(/at (\w+)/)
      const parentFunctionName = match?.[1]
      const paramName = key
      return errorMessageHandler(ERROR_MESSAGES_FLAG.MISSING_PARAM, paramName, parentFunctionName)
    }
  }
}