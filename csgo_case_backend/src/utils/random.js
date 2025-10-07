 /**
  * PUBLIC_INTERFACE
  * weightedRandom
  * Given items[] and weights[] (positive integers), returns selected index.
  */
export function weightedRandom(items, weights) {
  /** Performs a weighted selection and returns the index of the chosen item */
  if (!Array.isArray(items) || !Array.isArray(weights)) {
    throw new Error('Invalid inputs');
  }
  if (items.length !== weights.length || items.length === 0) {
    throw new Error('Items and weights must be same length and non-empty');
  }
  const total = weights.reduce((acc, w) => acc + Math.max(0, Number(w) || 0), 0);
  if (total <= 0) {
    // fallback to uniform if all weights are zero/non-positive
    return Math.floor(Math.random() * items.length);
  }
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= Math.max(0, Number(weights[i]) || 0);
    if (r <= 0) return i;
  }
  return items.length - 1;
}
