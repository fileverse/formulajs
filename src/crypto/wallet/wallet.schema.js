import { z } from 'zod'


export const walletParamsSchema = z.object({
  query: z.enum(['txns', 'balance']),
  addresses: z.string().nonempty(),
  chains:    z.string(),
  time:      z.string().optional(),
}).superRefine((data, ctx) => {
  if(data.addresses.split(',') > 20){
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Max number of addresses to query is 20",
      path: ["addresses"],
    });
  }
})