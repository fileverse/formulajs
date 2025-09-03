export function flattenObject(obj, parentKey = '', res = {}) {
  for (let key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const newKey = parentKey ? `${parentKey}_${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        continue;
      } else {
        flattenObject(obj[key], newKey, res);
      }
    } else {
      res[newKey] = obj[key];
    }
  }
  return res;
}
