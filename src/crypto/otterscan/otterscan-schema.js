import { z } from 'zod';

/**
 * Schema used by the Otterscan search functions.
 *
 *  address      - ETH address (hex string, 0x...)
 *  blockNumber  - integer (0 = latest / genesis)
 *  pageSize     - integer > 0
 */
export const otsSearchTransactionsSchema = z.object({
  endpoint: z
    .string().nonempty(),
  
  address: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, { message: 'Invalid ETH address' })
    .describe('The ETH address to be searched'),

  blockNumber: z
    .number()
    .int()
    .min(0, { message: 'blockNumber must be >= 0' })
    .describe(
      'Block number to start the search. 0 = latest for BEFORE, 0 = genesis for AFTER'
    ),

  pageSize: z
    .number()
    .int()
    .positive({ message: 'pageSize must be > 0' })
    .describe('How many transactions to return per page')
});

