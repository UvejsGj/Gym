import { estimateOneRepMax } from "@/lib/calculations/one-rep-max";
import { calculateSetVolume } from "@/lib/calculations/volume";

export type RecordType = "Heaviest Weight" | "Best Estimated 1RM" | "Highest Volume Set" | "Most Reps";

export interface RecordCandidate {
  exerciseId: string;
  exerciseName: string;
  date: string;
  weight: number;
  reps: number;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  type: RecordType;
  value: number;
  date: string;
}

export function detectPersonalRecords(candidates: RecordCandidate[]): PersonalRecord[] {
  const grouped = new Map<string, RecordCandidate[]>();
  for (const candidate of candidates) {
    const key = `${candidate.exerciseId}:${candidate.exerciseName}`;
    grouped.set(key, [...(grouped.get(key) ?? []), candidate]);
  }

  const records: PersonalRecord[] = [];
  for (const [, values] of grouped) {
    if (values.length === 0) continue;
    const [sample] = values;
    const heaviest = [...values].sort((a, b) => b.weight - a.weight)[0];
    const best1rm = [...values].sort(
      (a, b) => estimateOneRepMax(b.weight, b.reps) - estimateOneRepMax(a.weight, a.reps),
    )[0];
    const bestVolume = [...values].sort(
      (a, b) => calculateSetVolume(b.weight, b.reps) - calculateSetVolume(a.weight, a.reps),
    )[0];
    const mostReps = [...values].sort((a, b) => b.reps - a.reps)[0];

    records.push(
      { exerciseId: sample.exerciseId, exerciseName: sample.exerciseName, type: "Heaviest Weight", value: heaviest.weight, date: heaviest.date },
      { exerciseId: sample.exerciseId, exerciseName: sample.exerciseName, type: "Best Estimated 1RM", value: estimateOneRepMax(best1rm.weight, best1rm.reps), date: best1rm.date },
      { exerciseId: sample.exerciseId, exerciseName: sample.exerciseName, type: "Highest Volume Set", value: calculateSetVolume(bestVolume.weight, bestVolume.reps), date: bestVolume.date },
      { exerciseId: sample.exerciseId, exerciseName: sample.exerciseName, type: "Most Reps", value: mostReps.reps, date: mostReps.date },
    );
  }

  return records;
}
