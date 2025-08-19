import { z } from 'zod'


export const duneSimParamsSchema = z.object({
  wallet: z.string().nonempty(),
  type: z.enum(['activity']),
})