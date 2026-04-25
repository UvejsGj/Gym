import { createClient } from "@/lib/supabase/server";
import { detectPersonalRecords } from "@/lib/calculations/personal-records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate, formatNumber } from "@/lib/utils/format";

export default async function RecordsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sets")
    .select("weight, reps, workout_exercises!inner(exercise_id, exercises!inner(name), workouts!inner(date))");
  const rows = (data ?? []) as Array<{
    weight: number;
    reps: number;
    workout_exercises: Array<{
      exercise_id: string;
      exercises: Array<{ name: string }>;
      workouts: Array<{ date: string }>;
    }>;
  }>;

  const candidates = rows.map((set) => ({
    exerciseId: set.workout_exercises?.[0]?.exercise_id ?? "unknown",
    exerciseName: set.workout_exercises?.[0]?.exercises?.[0]?.name ?? "Unknown Exercise",
    date: set.workout_exercises?.[0]?.workouts?.[0]?.date ?? new Date().toISOString().slice(0, 10),
    weight: set.weight,
    reps: set.reps,
  }));
  const records = detectPersonalRecords(candidates);

  return (
    <Card>
      <CardHeader><CardTitle>Personal Records</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-2">
        {records.map((record, index) => (
          <div key={`${record.exerciseId}-${record.type}-${index}`} className="rounded-md border p-3 text-sm">
            <p className="font-medium">{record.exerciseName}</p>
            <p>{record.type}: {formatNumber(record.value)}</p>
            <p className="text-muted-foreground">Date: {formatDate(record.date)}</p>
          </div>
        ))}
        {!records.length && <p className="text-sm text-muted-foreground">No records yet.</p>}
      </CardContent>
    </Card>
  );
}
