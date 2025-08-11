import { z } from 'zod'

export const tallyParamsSchema = z.object({
  query: z.enum(['organisation']),
  slug:  z.string(),
})