"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";
import type { Workout } from "@/types/database";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const supabase = useMemo(() => createClient(), []);
  const [all, setAll] = useState<Workout[]>([]);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");

  async function load() {
    const { data, error } = await supabase.from("workouts").select("*").order("date", { ascending: false });
    if (error) return toast.error(error.message);
    setAll((data ?? []) as Workout[]);
  }

  useEffect(() => { void load(); }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this workout?")) return;
    const { error } = await supabase.from("workouts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Workout deleted.");
    await load();
  }

  const filtered = all.filter((w) => {
    const byName = w.name.toLowerCase().includes(query.toLowerCase());
    const byDate = date ? w.date === date : true;
    return byName && byDate;
  });

  return (
    <Card>
      <CardHeader><CardTitle>Workout History</CardTitle></CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid gap-2 md:grid-cols-2">
          <Input placeholder="Search by name..." value={query} onChange={(e) => setQuery(e.target.value)} />
          <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          {filtered.map((workout) => (
            <div key={workout.id} className="flex items-center justify-between rounded-md border p-3">
              <div>
                <p className="font-medium">{workout.name}</p>
                <p className="text-sm text-muted-foreground">{formatDate(workout.date)}</p>
              </div>
              <div className="flex gap-2">
                <Link className={cn(buttonVariants({ variant: "outline" }))} href={`/history/${workout.id}`}>View</Link>
                <Button variant="destructive" onClick={() => void onDelete(workout.id)}>Delete</Button>
              </div>
            </div>
          ))}
          {!filtered.length && <p className="text-sm text-muted-foreground">No workouts found.</p>}
        </div>
      </CardContent>
    </Card>
  );
}
