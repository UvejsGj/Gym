import { createClient } from "@/lib/supabase/server";
import { estimateOneRepMax } from "@/lib/calculations/one-rep-max";
import { calculateSetVolume } from "@/lib/calculations/volume";
import { ProgressCharts } from "@/components/charts/progress-charts";

export default async function ProgressPage() {
  const supabase = await createClient();
  const { data: weights } = await supabase.from("body_weight_entries").select("date, weight").order("date");
  const { data: workouts } = await supabase.from("workouts").select("date").order("date");
  const { data: setRows } = await supabase
    .from("sets")
    .select("weight, reps, workout_exercises!inner(exercise_id, exercises!inner(name), workouts!inner(date))");
  const setRowsSafe = (setRows ?? []) as Array<{
    weight: number;
    reps: number;
    workout_exercises: Array<{
      workouts: Array<{ date: string }>;
    }>;
  }>;

  const weightTrend = (weights ?? []).map((w) => ({ date: w.date, value: Number(w.weight) }));
  const workoutPerWeek = Object.entries(
    (workouts ?? []).reduce<Record<string, number>>((acc, w) => {
      const week = new Date(w.date).toISOString().slice(0, 10);
      acc[week] = (acc[week] ?? 0) + 1;
      return acc;
    }, {}),
  ).map(([date, value]) => ({ date, value }));
  const volumeTrend = setRowsSafe.map((set) => ({
    date: set.workout_exercises?.[0]?.workouts?.[0]?.date ?? new Date().toISOString().slice(0, 10),
    value: calculateSetVolume(set.weight, set.reps),
  }));
  const oneRmTrend = setRowsSafe.map((set) => ({
    date: set.workout_exercises?.[0]?.workouts?.[0]?.date ?? new Date().toISOString().slice(0, 10),
    value: estimateOneRepMax(set.weight, set.reps),
  }));

  return <ProgressCharts bodyWeight={weightTrend} volume={volumeTrend} oneRm={oneRmTrend} weeklyWorkouts={workoutPerWeek} />;
}
