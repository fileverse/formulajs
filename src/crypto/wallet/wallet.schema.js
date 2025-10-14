import { z } from 'zod'


export const walletParamsSchema = z.object({
  query: z.enum(['txns', 'balance']),
  addresses: z.string().nonempty(),
  chains:    z.string(),
  time:      z.string().optional(),
})