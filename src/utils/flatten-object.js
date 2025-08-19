export function flattenObject(obj, parentKey = '', res = {}) {
  for (let key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;
    const newKey = parentKey ? `${parentKey}_${key}` : key;

    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      flattenObject(obj[key], newKey, res);
    } else if (Array.isArray(obj[key])) {
      obj[key].forEach((val, i) => {
        if (typeof val === 'object' && val !== null) {
          flattenObject(val, `${newKey}_${i}`, res);
        } else {
          res[`${newKey}_${i}`] = val;
        }
      });
    } else {
      res[newKey] = obj[key];
    }
  }
  return res;
}