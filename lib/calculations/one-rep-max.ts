export function estimateOneRepMax(weight: number, reps: number): number {
  return Number((weight * (1 + reps / 30)).toFixed(2));
}
