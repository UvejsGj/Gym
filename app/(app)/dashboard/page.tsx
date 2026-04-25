import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { formatDate, formatNumber } from "@/lib/utils/format";

const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export default async function DashboardPage() {
  const supabase = await createClient();
  const [{ count: workoutCount }, latestWorkout, latestWeight, recentSets] = await Promise.all([
    supabase.from("workouts").select("*", { count: "exact", head: true }),
    supabase.from("workouts").select("id, name, date").order("date", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("body_weight_entries").select("weight, date").order("date", { ascending: false }).limit(1).maybeSingle(),
    supabase
      .from("sets")
      .select("weight, reps, workout_exercises!inner(exercise_id, exercises!inner(name), workouts!inner(date))")
      .order("set_number", { ascending: false })
      .limit(10),
  ]);

  const weeklyCount = await supabase
    .from("workouts")
    .select("id, date")
    .gte("date", sevenDaysAgo);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader><CardTitle>Total Workouts</CardTitle></CardHeader><CardContent>{workoutCount ?? 0}</CardContent></Card>
        <Card><CardHeader><CardTitle>Current Weight</CardTitle></CardHeader><CardContent>{latestWeight.data ? `${formatNumber(latestWeight.data.weight, 1)} kg` : "N/A"}</CardContent></Card>
        <Card><CardHeader><CardTitle>Weekly Workouts</CardTitle></CardHeader><CardContent>{weeklyCount.data?.length ?? 0}</CardContent></Card>
        <Card><CardHeader><CardTitle>Latest Workout</CardTitle></CardHeader><CardContent>{latestWorkout.data ? `${latestWorkout.data.name} (${formatDate(latestWorkout.data.date)})` : "No workouts yet"}</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2">
          <Link href="/workouts" className={cn(buttonVariants({ variant: "default" }), "w-full")}>Start Workout</Link>
          <Link href="/body-weight" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>Add Body Weight</Link>
          <Link href="/history" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>View History</Link>
          <Link href="/exercises" className={cn(buttonVariants({ variant: "outline" }), "w-full")}>Manage Exercises</Link>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent Personal-Record Candidates</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          {recentSets.data?.length ? recentSets.data.map((set, idx) => (
            <p key={idx}>
              Set: {set.weight} x {set.reps}
            </p>
          )) : <p className="text-muted-foreground">No set data yet.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
