import { z } from 'zod'

export const circlesParamsSchema = z.object({
  functionName: z.enum(['trust', 'profile', 'transactions', 'balances']),
  address: z.string().nonempty(),
  entries: z.number().int().nonnegative().default(10)
})
