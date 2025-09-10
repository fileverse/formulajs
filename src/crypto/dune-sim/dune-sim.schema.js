import { z } from 'zod'



const historicalPrices = z
  .string()
  .regex(/^\s*(\d{1,2})(\s*,\s*\d{1,2}){0,2}\s*$/, "Up to 3 comma-separated hour offsets")
  .refine((s) => s.split(",").map((x) => +x.trim()).every((n) => n >= 1 && n <= 24), {
    message: "Each offset must be between 1 and 24",
  });



const activity = z.object({
  type: z.literal("activity"),
  input1: z.string().nonempty(), // wallet address / ens name
  input2: z.string().optional(), // chain id. / name
  input3: z.number().int().min(1).max(100).optional(), // limit
});

const tokenHolders = z.object({
  type: z.literal("token-holders"),
  input1: z.string().nonempty(), // expects token address
  input2: z.string().nonempty(), // chain id / name
  input3: z.number().int().min(1).max(500).optional() // limit
});


const price = z.object({
  type: z.literal("price"),
  input1: z.string().nonempty(), // chain name / id
  input2: historicalPrices.optional(), // history prices
  input3: z.string().optional(), // contract address
  input4: z.number().int().min(1).max(500).optional() // limit
});


export const duneSimParamsSchema = z.discriminatedUnion("type", [
  activity,
  price,
  tokenHolders
])