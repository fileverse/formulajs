import { z } from 'zod'
const priceSchema = z.object({
  category: z.literal('price'),
  param1:   z.string().nonempty(),
  param2:   z.string().nonempty().optional(),
})
const marketEcosystems = ['all','base','meme','aiagents','bitcoin','ethereum','hyperliquid','pump','solana']
const marketSchema = z.object({
  category: z.literal('market'),
  param1:   z.enum(marketEcosystems),
  param2:   z.enum(['1h','24h','7d']).optional(),
})
const stablecoinsTypes = ['all','yield-bearing-stablecoins','crypto-backed-stablecoin']
const stablecoinsSchema = z.object({
  category: z.literal('stablecoins'),
  param1:   z.enum(stablecoinsTypes),
  param2:   z.enum(['1h','24h','7d']).optional(),
})
const derivativesSchema = z.object({
  category: z.literal('derivatives'),
  param1:   z.string().nonempty(),
  param2:   z.any().optional(),
})
export const coingeckoParamsSchema = z.discriminatedUnion('category', [
  priceSchema,
  marketSchema,
  stablecoinsSchema,
  derivativesSchema,
])