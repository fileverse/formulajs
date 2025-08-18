import { z } from 'zod'

export const tallyParamsSchema = z.object({
  query: z.enum(['organization', 'proposal', 'proposals']),
  slug:  z.string(),
})