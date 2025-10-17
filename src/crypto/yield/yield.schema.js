import { z } from 'zod'

export const yieldParamsSchema = z.object({
  category: z.enum(['all', 'stablecoins'])
})