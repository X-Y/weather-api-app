// Join api response data with its units. 
export function getDataSliceWithUnit(data, category, type) {
  // TODO: verify with zod
  const unit = data[`${category}_units`][type];
  const values = data[category][type];

  // values can be an array, or a single value
  return Array.isArray(values) ? values.map(one => `${one} ${unit}`) : `${values} ${unit}`;
}