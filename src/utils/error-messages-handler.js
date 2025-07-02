import { ERROR_MESSAGES_FLAG } from './utils/constants'

export const errorMessageHandler = (errorFlag, input, functionName) => {
  if (!functionName) {
    const stack = new Error().stack?.split('\n')[2]
    const match = stack?.match(/at (\w+)/)
    functionName = match?.[1] // e.g EOA
  }
  if (errorFlag === ERROR_MESSAGES_FLAG.DEFAULT || !ERROR_MESSAGES_FLAG[errorFlag]) {
    return { message: 'An unexpected error occured', functionName, type: errorFlag, reason: input }
  } else if (errorFlag === ERROR_MESSAGES_FLAG.INVALID_ADDRESS) {
    return { message: `${input} is not a supported address`, functionName, type: errorFlag }
  } else if (errorFlag === ERROR_MESSAGES_FLAG.INVALID_PARAM) {
    const key = Object.keys(input)[0]
    const value = input[key]
    return { message: `${value} is an invalid value for ${key}`, functionName, type: errorFlag }
  } else if (errorFlag === ERROR_MESSAGES_FLAG.INVALID_CHAIN) {
    return { message: `${input} is not a supported chain for this function `, functionName, type: errorFlag }
  } else if (errorFlag === ERROR_MESSAGES_FLAG.RATE_LIMIT) {
    return {
      message: `Rate limit for ${input || functionName || 'this api'} has been reached`,
      functionName,
      type: errorFlag
    }
  } else if (errorFlag === ERROR_MESSAGES_FLAG.MISSING_KEY) {
    return { message: `Api key for ${input || functionName || 'this api'} is missing`, functionName, type: errorFlag }
  } else if (errorFlag === ERROR_MESSAGES_FLAG.NETWORK_ERROR) {
    if (input === 429) {
      return {
        message: `Rate limit for ${functionName || 'this function'} has been reached`,
        functionName,
        type: ERROR_MESSAGES_FLAG.RATE_LIMIT
      }
    }
    return { message: `Api failed with status code ${input}`, functionName, type: errorFlag }
  } else if (errorFlag === ERROR_MESSAGES_FLAG.MISSING_PARAM) {
    return { message: `Missing param: ${input}`, functionName, type: errorFlag }
  } else if (errorFlag === ERROR_MESSAGES_FLAG.ENS) {
    return { message: `${input} is not a supported ens name`, functionName, type: errorFlag }
  } else if (errorFlag === ERROR_MESSAGES_FLAG.OTHER_ERRORS) {
    return { message: input.message, functionName, type: errorFlag, reason: input.reason || input.message }
  } else if (errorFlag === ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT) {
    return { message: ERROR_MESSAGES_FLAG.MAX_PAGE_LIMIT, functionName, type: errorFlag }
  } else if (errorFlag.ERROR_MESSAGES_FLAG.INVALID_API_KEY) {
    return { message: `${input}: Invalid API key`, type: errorFlag, functionName }
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
