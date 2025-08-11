import { z } from 'zod'

export const tallyParamsSchema = z.object({
  query: z.enum(['organization', 'proposal']),
  slug:  z.string(),
})