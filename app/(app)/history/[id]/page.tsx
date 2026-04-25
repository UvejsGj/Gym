import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateSetVolume, calculateWorkoutVolume } from "@/lib/calculations/volume";
import { formatDate, formatNumber } from "@/lib/utils/format";

export default async function WorkoutDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: workout } = await supabase.from("workouts").select("*").eq("id", id).maybeSingle();
  if (!workout) return notFound();

  const { data: exerciseRows } = await supabase
    .from("workout_exercises")
    .select("id, notes, exercises(name)")
    .eq("workout_id", id)
    .order("order_index", { ascending: true });

  const normalized = await Promise.all((exerciseRows ?? []).map(async (row) => {
    const { data: sets } = await supabase.from("sets").select("*").eq("workout_exercise_id", row.id).order("set_number");
    const total = calculateWorkoutVolume((sets ?? []).map((s) => ({ weight: s.weight, reps: s.reps })));
    return { row, sets: sets ?? [], total };
  }));

  const workoutVolume = normalized.reduce((total, item) => total + item.total, 0);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader><CardTitle>{workout.name}</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Date: {formatDate(workout.date)}</p>
          <p>Notes: {workout.notes ?? "None"}</p>
          <p>Total workout volume: {formatNumber(workoutVolume)} kg</p>
        </CardContent>
      </Card>
      {normalized.map((item) => (
        <Card key={item.row.id}>
          <CardHeader><CardTitle>{(item.row.exercises as Array<{ name: string }>)?.[0]?.name ?? "Exercise"}</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            {item.sets.map((set) => (
              <p key={set.id} className="text-sm">
                Set {set.set_number}: {set.weight} x {set.reps} {set.rpe ? `(RPE ${set.rpe})` : ""} - Volume {calculateSetVolume(set.weight, set.reps)}
              </p>
            ))}
            <p className="text-sm font-medium">Exercise volume: {formatNumber(item.total)} kg</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
