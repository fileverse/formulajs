import { z } from 'zod'
import * as isAddress from '../utils/is-address.js'

export const priceSchema = z.object({
    input1: z.string().nonempty(), // coin / token address
    input2: z.string().optional(), // chainId / time
    input3: z.string().optional(), // time
}).superRefine((data, ctx) => {
  if(!isAddress.default.isAddress(data.input1))return
  if(!data.input2){
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Chain is required to query token price ",
      path: ["input2"],
    });
  }
  if(data.input2?.split(',')?.length){
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Token address can query only one chain ",
      path: ["input2"],
    });
  }
})