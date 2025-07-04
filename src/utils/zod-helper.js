import { z } from 'zod';

const dateStringToTimestamp = (val) => {
  const [mm, dd, yyyy] = val.split('/');
  return Math.floor(new Date(`${yyyy}-${mm}-${dd}`).getTime() / 1000);
};

/**
 * Accepts either a UNIX‐timestamp number or a MM/DD/YYYY string,
 * and always returns a nonnegative integer timestamp.
 */
export const dateOrTimestamp = z.preprocess(
  (val) =>
    typeof val === 'string' && /^\d{2}\/\d{2}\/\d{4}$/.test(val)
      ? dateStringToTimestamp(val)
      : val,
  z.number().int().nonnegative()
);