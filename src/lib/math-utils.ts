
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


/**
 * Calculates the slope and intercept for a simple linear regression.
 * y = slope * x + intercept
 * @param data - An array of objects with x and y properties.
 * @returns An object with slope and intercept.
 */
export function calculateLinearRegression(data: { x: number; y: number }[]): { slope: number; intercept: number } {
  const n = data.length;
  if (n < 2) {
    return { slope: 0, intercept: 0 }; // Not enough data
  }

  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (const point of data) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}
