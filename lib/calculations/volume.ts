export function calculateSetVolume(weight: number, reps: number): number {
  return Number((weight * reps).toFixed(2));
}

export function calculateWorkoutVolume(
  sets: Array<{ weight: number; reps: number }>,
): number {
  return Number(
    sets.reduce((total, set) => total + calculateSetVolume(set.weight, set.reps), 0).toFixed(2),
  );
}
