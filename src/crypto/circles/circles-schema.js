import { z } from 'zod'

export const circlesParamsSchema = z.object({
  address: z.string().nonempty(),
  functionName: z.enum(['trust', 'profile', 'transactions', 'balances']),
  entries: z.number().int().nonnegative().default(10)
})
