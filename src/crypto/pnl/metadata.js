import { de } from "zod/v4/locales";

export const PNL_metadata = {
  n: 'PNL',
  t: 20,
  d: 'Subtract each element from A column from B column and return the total sum.',
  a: 'Returns the total of A - B element-wise subtraction across two ranges.',
  p: [
    {
      name: 'A',
      detail: 'The column or array of values to subtract from B (e.g. cost).',
      example: 'A1:A10',
      require: 'm',
      repeat: 'n',
      type: 'range'
    },
    {
      name: 'B',
      detail: 'The column or array of values to subtract A from (e.g. revenue).',
      example: 'B1:B10',
      require: 'm',
      repeat: 'n',
      type: 'range'
    }
  ],
  examples: [{
    title: 'PNL',
    argumentString: "A1:A10, B1:B10",
    description: 'returns the total profit or loss by subtracting the costs in range A1:A10 from the revenues in range B1:B10.'
  },{
    title: 'PNL',
    argumentString: '"{100, 200, 150}", "{250, 300, 200}"',
    description: 'returns the total profit or loss by subtracting the costs {100, 200, 150} from the revenues {250, 300, 200}.'
  }]
}
