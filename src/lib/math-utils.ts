
export const Z_SCORE_THRESHOLD = 2.5; // Common threshold for anomaly detection

/**
 * Calculates the mean (average) of a set of numbers.
 * @param data - An array of numbers.
 * @returns The mean of the numbers.
 */
function calculateMean(data: number[]): number {
  if (data.length === 0) return 0;
  const sum = data.reduce((acc, value) => acc + value, 0);
  return sum / data.length;
}

/**
 * Calculates the standard deviation of a set of numbers.
 * @param data - An array of numbers.
 * @param mean - The mean of the numbers.
 * @returns The standard deviation.
 */
function calculateStdDev(data: number[], mean: number): number {
  if (data.length < 2) return 0; // Std dev requires at least 2 points
  const squareDiffs = data.map(value => {
    const diff = value - mean;
    return diff * diff;
  });
  const avgSquareDiff = calculateMean(squareDiffs);
  return Math.sqrt(avgSquareDiff);
}

/**
 * Calculates the Z-Score for a given value in a dataset.
 * The Z-Score measures how many standard deviations a data point is from the mean.
 * @param value - The data point to calculate the Z-score for.
 * @param data - The dataset (an array of numbers).
 * @returns The Z-score.
 */
export function calculateZScore(value: number, data: number[]): number {
  const mean = calculateMean(data);
  const stdDev = calculateStdDev(data, mean);
  if (stdDev === 0) return 0; // Avoid division by zero
  return (value - mean) / stdDev;
}
