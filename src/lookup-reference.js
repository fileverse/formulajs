import jStat from 'jstat'

import * as error from './utils/error.js'
import * as utils from './utils/common.js'

/**
 * Chooses a value from a list of values.
 *
 * Category: Lookup and reference
 *
 * @param {*} index_num Specifies which value argument is selected. Index_num must be a number between 1 and 254, or a formula or reference to a value containing a number between 1 and 254. If index_num is 1, CHOOSE returns value1; if it is 2, CHOOSE returns value2; and so on. If index_num is less than 1 or greater than the number of the last value in the list, CHOOSE returns the #VALUE! error value. If index_num is a fraction, it is truncated to the lowest integer before being used.
 - If index_num is 1, CHOOSE returns value1; if it is 2, CHOOSE returns value2; and so on.
 - If index_num is less than 1 or greater than the number of the last value in the list, CHOOSE returns the #VALUE! error value.
 - If index_num is a fraction, it is truncated to the lowest integer before being used.
 * @param {*} args value1, value2, ... Value 1 is required, subsequent values are optional. 1 to 254 value arguments from which CHOOSE selects a value or an action to perform based on index_num. The arguments can be numbers, value references, defined names, formulas, functions, or text.
 * @returns
 */
export function CHOOSE() {
  if (arguments.length < 2) {
    return error.na
  }

  const index = arguments[0]

  if (index < 1 || index > 254) {
    return error.value
  }

  if (arguments.length < index + 1) {
    return error.value
  }

  return arguments[index]
}

/**
 * Returns the column number of a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} reference the value or range of values for which you want to return the column number.
 * @param {*} index
 * @returns
 */
export function COLUMN(reference, index) {
  if (arguments.length !== 2) {
    return error.na
  }

  if (index < 0) {
    return error.num
  }

  if (!(reference instanceof Array) || typeof index !== 'number') {
    return error.value
  }

  if (reference.length === 0) {
    return undefined
  }

  return jStat.col(reference, index)
}

/**
 * Returns the number of columns in a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array or array formula, or a reference to a range of values for which you want the number of columns.
 * @returns
 */
export function COLUMNS(array) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (!(array instanceof Array)) {
    return error.value
  }

  if (array.length === 0) {
    return 0
  }

  return jStat.cols(array)
}

/**
 * Looks in the top row of an array and returns the value of the indicated value.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value to be found in the first row of the table. Lookup_value can be a value, a reference, or a text string.
 * @param {*} table_array A table of information in which data is looked up. Use a reference to a range or a range name.
 * @param {*} row_index_num The row number in table_array from which the matching value will be returned. A row_index_num of 1 returns the first row value in table_array, a row_index_num of 2 returns the second row value in table_array, and so on. If row_index_num is less than 1, HLOOKUP returns the #VALUE! error value; if row_index_num is greater than the number of rows on table_array, HLOOKUP returns the #REF! error value.
 * @param {*} range_lookup Optional. A logical value that specifies whether you want HLOOKUP to find an exact match or an approximate match. If TRUE or omitted, an approximate match is returned. In other words, if an exact match is not found, the next largest value that is less than lookup_value is returned. If FALSE, HLOOKUP will find an exact match. If one is not found, the error value #N/A is returned.
 * @returns
 */
export function HLOOKUP(lookup_value, table_array, row_index_num, range_lookup) {
  return VLOOKUP(lookup_value, utils.transpose(table_array), row_index_num, range_lookup)
}

/**
 * Uses an index to choose a value from a reference or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array A range of values or an array constant.
 - If array contains only one row or column, the corresponding row_num or column_num argument is optional.
 - If array has more than one row and more than one column, and only row_num or column_num is used, INDEX returns an array of the entire row or column in array.
 * @param {*} row_num Required, unless column_num is present. Selects the row in array from which to return a value. If row_num is omitted, column_num is required.
 * @param {*} column_num Optional. Selects the column in array from which to return a value. If column_num is omitted, row_num is required.
 * @returns
 */
export function INDEX(array, row_num, column_num) {
  const someError = utils.anyError(array, row_num, column_num)

  if (someError) {
    return someError
  }

  if (!Array.isArray(array)) {
    return error.value
  }

  const isOneDimensionRange = array.length > 0 && !Array.isArray(array[0])

  if (isOneDimensionRange && !column_num) {
    column_num = row_num
    row_num = 1
  } else {
    column_num = column_num || 1
    row_num = row_num || 1
  }

  if (column_num < 0 || row_num < 0) {
    return error.value
  }

  if (isOneDimensionRange && row_num === 1 && column_num <= array.length) {
    return array[column_num - 1]
  } else if (row_num <= array.length && column_num <= array[row_num - 1].length) {
    return array[row_num - 1][column_num - 1]
  }

  return error.ref
}

/**
 * Looks up values in a vector or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value A value that LOOKUP searches for in an array. The lookup_value argument can be a number, text, a logical value, or a name or reference that refers to a value.
 - If LOOKUP can't find the value of lookup_value, it uses the largest value in the array that is less than or equal to lookup_value.
 - If the value of lookup_value is smaller than the smallest value in the first row or column (depending on the array dimensions), LOOKUP returns the #N/A error value.
 * @param {*} array A range of values that contains text, numbers, or logical values that you want to compare with lookup_value. The array form of LOOKUP is very similar to the HLOOKUP and VLOOKUP functions. The difference is that HLOOKUP searches for the value of lookup_value in the first row, VLOOKUP searches in the first column, and LOOKUP searches according to the dimensions of array.
* @param {*} result_array Optional. A range that contains only one row or column. The result_array argument must be the same size as lookup_value. It has to be the same size.
 * @returns
 */
export function LOOKUP(lookup_value, array, result_array) {
  array = utils.flatten(array)
  result_array = result_array ? utils.flatten(result_array) : array

  const isNumberLookup = typeof lookup_value === 'number'
  let result = error.na

  for (let i = 0; i < array.length; i++) {
    if (array[i] === lookup_value) {
      return result_array[i]
    } else if (
      (isNumberLookup && array[i] <= lookup_value) ||
      (typeof array[i] === 'string' && array[i].localeCompare(lookup_value) < 0)
    ) {
      result = result_array[i]
    } else if (isNumberLookup && array[i] > lookup_value) {
      return result
    }
  }

  return result
}

/**
 * Looks up values in a reference or array.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value that you want to match in lookup_array. For example, when you look up someone's number in a telephone book, you are using the person's name as the lookup value, but the telephone number is the value you want.The lookup_value argument can be a value (number, text, or logical value) or a value reference to a number, text, or logical value.
 * @param {*} lookup_array The range of values being searched.
 * @param {*} match_type Optional. The number -1, 0, or 1. The match_type argument specifies how Excel matches lookup_value with values in lookup_array. The default value for this argument is 1.
 * @returns
 */
export function MATCH(lookup_value, lookup_array, match_type) {
  if ((!lookup_value && lookup_value !== 0) || !lookup_array) {
    return error.na
  }

  if (arguments.length === 2) {
    match_type = 1
  }

  lookup_array = utils.flatten(lookup_array)

  if (!(lookup_array instanceof Array)) {
    return error.na
  }

  if (match_type !== -1 && match_type !== 0 && match_type !== 1) {
    return error.na
  }

  let index
  let indexValue

  for (let idx = 0; idx < lookup_array.length; idx++) {
    if (match_type === 1) {
      if (lookup_array[idx] === lookup_value) {
        return idx + 1
      } else if (lookup_array[idx] < lookup_value) {
        if (!indexValue) {
          index = idx + 1
          indexValue = lookup_array[idx]
        } else if (lookup_array[idx] > indexValue) {
          index = idx + 1
          indexValue = lookup_array[idx]
        }
      }
    } else if (match_type === 0) {
      if (typeof lookup_value === 'string' && typeof lookup_array[idx] === 'string') {
        const lookupValueStr = lookup_value
          .toLowerCase()
          .replace(/\?/g, '.')
          .replace(/\*/g, '.*')
          .replace(/~/g, '\\')
          .replace(/\+/g, '\\+')
          .replace(/\(/g, '\\(')
          .replace(/\)/g, '\\)')
          .replace(/\[/g, '\\[')
          .replace(/\]/g, '\\]')

        const regex = new RegExp('^' + lookupValueStr + '$')

        if (regex.test(lookup_array[idx].toLowerCase())) {
          return idx + 1
        }
      } else {
        if (lookup_array[idx] === lookup_value) {
          return idx + 1
        }
      }
    } else if (match_type === -1) {
      if (lookup_array[idx] === lookup_value) {
        return idx + 1
      } else if (lookup_array[idx] > lookup_value) {
        if (!indexValue) {
          index = idx + 1
          indexValue = lookup_array[idx]
        } else if (lookup_array[idx] < indexValue) {
          index = idx + 1
          indexValue = lookup_array[idx]
        }
      }
    }
  }

  return index || error.na
}

/**
 * Returns the number of rows in a reference.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array, an array formula, or a reference to a range of values for which you want the number of rows.
 * @returns
 */
export function ROWS(array) {
  if (arguments.length !== 1) {
    return error.na
  }

  if (!(array instanceof Array)) {
    return error.value
  }

  if (array.length === 0) {
    return 0
  }

  return jStat.rows(array)
}
/**
 * Returns a sorted array of the elements in an array. The returned array is the same shape as the provided array argument.
 *
 * Category: Lookup and reference
 *
 * @param {*} array Array to sort
 * @param {*} sort_index Optional. A number indicating the row or column to sort by
 * @param {*} sort_order Optional. A number indicating the desired sort order; 1 for ascending order (default), -1 for descending order
 * @param {*} by_col Optional. A logical value indicating the desired sort direction; FALSE to sort by row (default), TRUE to sort by column
 * @returns
 */
export function SORT(inputArray, sortIndex = 1, isAscending, sortByColumn = false) {
  if (!inputArray || !Array.isArray(inputArray)) return error.na;
  if (inputArray.length === 0) return 0;

  let sortColumnIndex = utils.parseNumber(sortIndex);
  if (!sortColumnIndex || sortColumnIndex < 1) return error.value;
  sortColumnIndex = sortColumnIndex - 1;

  const sortDirection = isAscending?.toLowerCase() === 'false' ? -1 : 1;
  const parsedSortDirection = utils.parseNumber(sortDirection);
  if (parsedSortDirection !== 1 && parsedSortDirection !== -1) return error.value;


  const isSortByColumn = utils.parseBool(sortByColumn);
  if (typeof isSortByColumn !== "boolean") return error.name;


  const normalizedMatrix = utils.fillMatrix(inputArray);
  const orientedMatrix = isSortByColumn
    ? utils.transpose(normalizedMatrix)
    : normalizedMatrix;

  if (!orientedMatrix.length || !orientedMatrix[0] || sortColumnIndex >= orientedMatrix[0].length) {
    return error.value;
  }

  const isBlank = (value) => value === "" || value === null || value === undefined;

  // Comparator for sorting values
  const compareValues = (a, b) => {
    const aBlank = isBlank(a);
    const bBlank = isBlank(b);
    if (aBlank && bBlank) return 0;
    if (aBlank) return 1;
    if (bBlank) return -1;

    // Numeric comparison if possible
    const parsedA = utils.parseNumber(a);
    const parsedB = utils.parseNumber(b);
    const isANumber = Number.isFinite(parsedA);
    const isBNumber = Number.isFinite(parsedB);

    if (isANumber && isBNumber) {
      if (parsedA < parsedB) return -1;
      if (parsedA > parsedB) return 1;
      return 0;
    }

    // Fallback: case-insensitive string comparison
    const stringA = (utils.parseString(a) ?? "").toString().toLowerCase();
    const stringB = (utils.parseString(b) ?? "").toString().toLowerCase();
    if (stringA < stringB) return -1;
    if (stringA > stringB) return 1;
    return 0;
  };

  const rowsWithOriginalIndex = orientedMatrix.map((row, rowIndex) => ({ row, rowIndex }));

  rowsWithOriginalIndex.sort((rowA, rowB) => {
    const baseComparison = compareValues(rowA.row[sortColumnIndex], rowB.row[sortColumnIndex]);
    if (baseComparison !== 0) return baseComparison * parsedSortDirection;
    return rowA.rowIndex - rowB.rowIndex;
  });

  // Extract sorted rows
  const sortedMatrix = rowsWithOriginalIndex.map((item) => item.row);

  // Return rows or columns depending on orientation
  return isSortByColumn ? utils.transpose(sortedMatrix) : sortedMatrix;
}



/**
 * Returns the transpose of an array.
 *
 * Category: Lookup and reference
 *
 * @param {*} array An array or range of values on a worksheet that you want to transpose. The transpose of an array is created by using the first row of the array as the first column of the new array, the second row of the array as the second column of the new array, and so on. If you're not sure of how to enter an array formula, see Create an array formula.
 * @returns
 */
export function TRANSPOSE(array) {
  if (!array) {
    return error.na
  }

  const matrix = utils.fillMatrix(array)

  return utils.transpose(matrix)
}

/**
 * Returns a list of unique values in a list or range.
 *
 * Category: Lookup and reference
 *
 * @returns
 */
export function UNIQUE() {
  const result = []

  for (let i = 0; i < arguments.length; ++i) {
    let hasElement = false
    const element = arguments[i]

    // Check if we've already seen this element.

    for (let j = 0; j < result.length; ++j) {
      hasElement = result[j] === element

      if (hasElement) {
        break
      }
    }

    // If we did not find it, add it to the result.
    if (!hasElement) {
      result.push(element)
    }
  }

  return result
}

/**
 * Looks in the first column of an array and moves across the row to return the value of a value.
 *
 * Category: Lookup and reference
 *
 * @param {*} lookup_value The value to be found in the first row of the table. Lookup_value can be a value, a reference, or a text string.
 * @param {*} table_array A table of information in which data is looked up. Use a reference to a range or a range name.
 * @param {*} col_index_num The row number in table_array from which the matching value will be returned. A row_index_num of 1 returns the first row value in table_array, a row_index_num of 2 returns the second row value in table_array, and so on. If row_index_num is less than 1, HLOOKUP returns the #VALUE! error value; if row_index_num is greater than the number of rows on table_array, HLOOKUP returns the #REF! error value.
 * @param {*} range_lookup Optional. A logical value that specifies whether you want HLOOKUP to find an exact match or an approximate match. If TRUE or omitted, an approximate match is returned. In other words, if an exact match is not found, the next largest value that is less than lookup_value is returned. If FALSE, HLOOKUP will find an exact match. If one is not found, the error value #N/A is returned.
 * @returns
 */
export function VLOOKUP(lookup_value, table_array, col_index_num, range_lookup) {
  if (!table_array || !col_index_num) {
    return error.na
  }

  range_lookup = !(range_lookup === 0 || range_lookup === false)

  let result = error.na
  let exactMatchOnly = false

  const isNumberLookup = typeof lookup_value === 'number'
  const lookupValue = typeof lookup_value === 'string' ? lookup_value.toLowerCase() : lookup_value

  for (let i = 0; i < table_array.length; i++) {
    const row = table_array[i]
    const rowValue = typeof row[0] === 'string' ? row[0].toLowerCase() : row[0]

    if (rowValue === lookupValue) {
      result = col_index_num < row.length + 1 ? row[col_index_num - 1] : error.ref
      break
    } else if (
      !exactMatchOnly &&
      ((isNumberLookup && range_lookup && rowValue <= lookup_value) ||
        (range_lookup && typeof rowValue === 'string' && rowValue.localeCompare(lookup_value) < 0))
    ) {
      result = col_index_num < row.length + 1 ? row[col_index_num - 1] : error.ref
    }

    if (isNumberLookup && rowValue > lookup_value) {
      exactMatchOnly = true
    }
  }

  return result
}

export function XLOOKUP(search_key, lookup_range, result_range, isColV, missing_value,match_mode, search_mode) {
  let isCol = isColV === "true" ? true : false
  
  // Validate required parameters
  if (search_key === undefined || search_key === null) {
    return new Error('search_key')
  }
  
  if (!lookup_range) {
    return new Error('lookup_range')
  }
    if (!result_range) {
    return new Error('result_range')
  }
  
  // Validate and normalize lookup_range (must be singular row or column)
  let lookup_array = normalizeLookupRange(lookup_range)
  if (!lookup_array) {
    return new Error('lookup_range_single')
  }
  
  // Validate and normalize result_range
  let result_array = normalizeResultRange(result_range)
  if (!result_array) {
    return new Error('result_range_invalid')
  }
  
  // Validate that lookup and result ranges have compatible dimensions
  // Exception: if result_range is a single row, it can be returned regardless of lookup_range length  
result_array.map((row) => {
    if (row.length !== lookup_array.length) {
      return new Error('lookup_range_and_result_range')
    }
  })
  
  // Set default parameter values Error: Didn't find value in XLOOKUP evaluation
  missing_value = missing_value !== undefined ? missing_value : new Error("not_found")
  match_mode = match_mode !== undefined ? match_mode : 0
  search_mode = search_mode !== undefined ? search_mode : 1
  isCol = isCol !== undefined ? isCol : false
  
  // Validate match_mode
  if (![0, 1, -1, 2].includes(match_mode)) {
    return new Error('match_mode_must')
  }
  
  // Validate search_mode
  if (![1, -1, 2, -2].includes(search_mode)) {
    return new Error('search_mode_must')
  }
  
  // Validate binary search requirements
  if (Math.abs(search_mode) === 2 && match_mode === 2) {
    return new Error('binary_search_and_wildcard')
  }
    
  let res = performLookup(search_key, lookup_array, result_array, missing_value, match_mode, search_mode, isCol);
  res = isCol ? Array.isArray(res)?res.map((item) => [item.toString()]):res : [res];
  return res
}

function normalizeLookupRange(lookup_range) {
  if (!Array.isArray(lookup_range)) {
    return null
  }
  
  // If it's a 1D array, it's already a column
  if (!Array.isArray(lookup_range[0])) {
    return lookup_range
  }
  
  // If it's a 2D array, check if it's a single row or single column
  const rows = lookup_range.length
  const cols = lookup_range[0].length
  
  if (rows === 1) {
    // Single row - extract as array
    return lookup_range[0]
  } else if (cols === 1) {
    // Single column - extract first element of each row
    return lookup_range.map(row => row[0])
  } else {
    // Multiple rows and columns - not allowed
    return null
  }
}

function normalizeResultRange(result_range) {
  if (!Array.isArray(result_range)) {
    return null
  }
  
  // If it's a 1D array, convert to 2D single column for consistency
  if (!Array.isArray(result_range[0])) {
    return result_range.map(value => [value])
  }
  
  // If it's already 2D, return as is
  return result_range
}

function performLookup(search_key, lookup_array, result_array, missing_value, match_mode, search_mode, isCol) {
    
  let foundIndex = -1
  
  // Handle different match modes
  switch (match_mode) {
    case 0: // Exact match
      foundIndex = findExactMatch(search_key, lookup_array, search_mode)
      break
    case 1: // Exact match or next larger
      foundIndex = findExactOrNextLarger(search_key, lookup_array, search_mode)
      break
    case -1: // Exact match or next smaller
      foundIndex = findExactOrNextSmaller(search_key, lookup_array, search_mode)
      break
    case 2: // Wildcard match
      foundIndex = findWildcardMatch(search_key, lookup_array, search_mode)
      break
  }
  
  if (foundIndex === -1) {
        // Return missing_value (single value): "yoo"
        return missing_value
  }
    // Multiple result rows
    if (isCol) {
      // Return the foundIndex column from all rows: ["e", "r"]
      const columnValues = result_array.map(row => row[foundIndex])
      return columnValues
    } else {
      // Return the entire matched row: ["e", 3, "s", "hj"]
      return result_array[foundIndex]
    }
}

function findExactMatch(search_key, lookup_array, search_mode) {
  const processedSearchKey = typeof search_key === 'string' ? search_key.toLowerCase().trim() : search_key
  
  if (Math.abs(search_mode) === 2) {
    // Binary search
    return binarySearchExact(processedSearchKey, lookup_array, search_mode > 0)
  } else {
    // Linear search
    const indices = getSearchIndices(lookup_array.length, search_mode)
    
    for (const i of indices) {
      const value = lookup_array[i]
      const processedValue = typeof value === 'string' ? value.toLowerCase().trim() : value
      
      if (processedValue === processedSearchKey) {
        return i
      }
    }
  }
  
  return -1
}

function findExactOrNextLarger(search_key, lookup_array, search_mode) {
  const isNumber = typeof search_key === 'number'
  const processedSearchKey = typeof search_key === 'string' ? search_key.toLowerCase().trim() : search_key
  
  if (Math.abs(search_mode) === 2) {
    // Binary search for exact or next larger
    return binarySearchNextLarger(processedSearchKey, lookup_array, search_mode > 0)
  }
  
  const indices = getSearchIndices(lookup_array.length, search_mode)
  let bestIndex = -1
  
  for (const i of indices) {
    const value = lookup_array[i]
    const processedValue = typeof value === 'string' ? value.toLowerCase().trim() : value
    
    // Exact match
    if (processedValue === processedSearchKey) {
      return i
    }
    
    // Next larger value
    if (isNumber && typeof value === 'number' && value > search_key) {
      if (bestIndex === -1 || value < lookup_array[bestIndex]) {
        bestIndex = i
      }
    } else if (!isNumber && typeof value === 'string' && processedValue > processedSearchKey) {
      if (bestIndex === -1 || processedValue < (typeof lookup_array[bestIndex] === 'string' ? lookup_array[bestIndex].toLowerCase().trim() : lookup_array[bestIndex])) {
        bestIndex = i
      }
    }
  }
  
  return bestIndex
}

function findExactOrNextSmaller(search_key, lookup_array, search_mode) {
  const isNumber = typeof search_key === 'number'
  const processedSearchKey = typeof search_key === 'string' ? search_key.toLowerCase().trim() : search_key
  
  if (Math.abs(search_mode) === 2) {
    // Binary search for exact or next smaller
    return binarySearchNextSmaller(processedSearchKey, lookup_array, search_mode > 0)
  }
  
  const indices = getSearchIndices(lookup_array.length, search_mode)
  let bestIndex = -1
  
  for (const i of indices) {
    const value = lookup_array[i]
    const processedValue = typeof value === 'string' ? value.toLowerCase().trim() : value
    
    // Exact match
    if (processedValue === processedSearchKey) {
      return i
    }
    
    // Next smaller value
    if (isNumber && typeof value === 'number' && value < search_key) {
      if (bestIndex === -1 || value > lookup_array[bestIndex]) {
        bestIndex = i
      }
    } else if (!isNumber && typeof value === 'string' && processedValue < processedSearchKey) {
      if (bestIndex === -1 || processedValue > (typeof lookup_array[bestIndex] === 'string' ? lookup_array[bestIndex].toLowerCase().trim() : lookup_array[bestIndex])) {
        bestIndex = i
      }
    }
  }
  
  return bestIndex
}

function findWildcardMatch(search_key, lookup_array, search_mode) {
  if (typeof search_key !== 'string') {
    return -1 // Wildcard only works with strings
  }
  
  // Convert wildcard pattern to regex
  const pattern = search_key
    .toLowerCase()
    .replace(/\*/g, '.*')  // * matches any sequence of characters
    .replace(/\?/g, '.')   // ? matches any single character
    .replace(/[.*+?^${}()|[\]\\]/g, '\\$&') // Escape other regex chars
    .replace(/\\\.\*/g, '.*')  // Restore our wildcards
    .replace(/\\\./g, '.')
  
  const regex = new RegExp(`^${pattern}$`, 'i')
  
  const indices = getSearchIndices(lookup_array.length, search_mode)
  
  for (const i of indices) {
    const value = lookup_array[i]
    if (typeof value === 'string' && regex.test(value)) {
      return i
    }
  }
  
  return -1
}

function getSearchIndices(length, search_mode) {
  if (search_mode === -1) {
    // Last to first
    return Array.from({ length }, (_, i) => length - 1 - i)
  } else {
    // First to last (default)
    return Array.from({ length }, (_, i) => i)
  }
}

function binarySearchExact(search_key, lookup_array, ascending) {
  let left = 0
  let right = lookup_array.length - 1
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midValue = lookup_array[mid]
    const processedMidValue = typeof midValue === 'string' ? midValue.toLowerCase().trim() : midValue
    
    if (processedMidValue === search_key) {
      return mid
    }
    
    const comparison = ascending ? 
      (processedMidValue < search_key) : 
      (processedMidValue > search_key)
    
    if (comparison) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
  
  return -1
}

function binarySearchNextLarger(search_key, lookup_array, ascending) {
  let left = 0
  let right = lookup_array.length - 1
  let result = -1
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midValue = lookup_array[mid]
    const processedMidValue = typeof midValue === 'string' ? midValue.toLowerCase().trim() : midValue
    
    if (processedMidValue === search_key) {
      return mid // Exact match
    }
    
    if (ascending) {
      if (processedMidValue > search_key) {
        result = mid
        right = mid - 1
      } else {
        left = mid + 1
      }
    } else {
      if (processedMidValue < search_key) {
        result = mid
        left = mid + 1
      } else {
        right = mid - 1
      }
    }
  }
  
  return result
}

function binarySearchNextSmaller(search_key, lookup_array, ascending) {
  let left = 0
  let right = lookup_array.length - 1
  let result = -1
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2)
    const midValue = lookup_array[mid]
    const processedMidValue = typeof midValue === 'string' ? midValue.toLowerCase().trim() : midValue
    
    if (processedMidValue === search_key) {
      return mid // Exact match
    }
    
    if (ascending) {
      if (processedMidValue < search_key) {
        result = mid
        left = mid + 1
      } else {
        right = mid - 1
      }
    } else {
      if (processedMidValue > search_key) {
        result = mid
        right = mid - 1
      } else {
        left = mid + 1
      }
    }
  }
  
  return result
}
