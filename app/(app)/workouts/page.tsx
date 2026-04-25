"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray, type Control, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { workoutSchema, type WorkoutInput } from "@/lib/validations/workout";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Exercise } from "@/types/database";

interface ExerciseSectionProps {
  idx: number;
  exercises: Exercise[];
  control: Control<WorkoutInput>;
  register: UseFormRegister<WorkoutInput>;
  setValue: UseFormSetValue<WorkoutInput>;
  selectedExerciseId: string;
  onRemove: () => void;
}

function ExerciseSection({
  idx,
  exercises,
  control,
  register,
  setValue,
  selectedExerciseId,
  onRemove,
}: ExerciseSectionProps) {
  const setArray = useFieldArray({ control, name: `exercises.${idx}.sets` });

  return (
    <div className="rounded-md border p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Select value={selectedExerciseId} onValueChange={(v) => setValue(`exercises.${idx}.exercise_id`, v ?? "")}>
          <SelectTrigger className="w-full md:w-[280px]"><SelectValue placeholder="Exercise" /></SelectTrigger>
          <SelectContent>{exercises.map((ex) => <SelectItem key={ex.id} value={ex.id}>{ex.name}</SelectItem>)}</SelectContent>
        </Select>
        <Button variant="destructive" type="button" onClick={onRemove}>Remove Exercise</Button>
      </div>
      <div className="flex flex-col gap-2">
        {setArray.fields.map((set, setIdx) => (
          <div key={set.id} className="grid gap-2 md:grid-cols-5">
            <Input type="number" step="0.5" placeholder="Weight" {...register(`exercises.${idx}.sets.${setIdx}.weight`, { valueAsNumber: true })} />
            <Input type="number" placeholder="Reps" {...register(`exercises.${idx}.sets.${setIdx}.reps`, { valueAsNumber: true })} />
            <Input type="number" step="0.5" placeholder="RPE (optional)" {...register(`exercises.${idx}.sets.${setIdx}.rpe`, { valueAsNumber: true })} />
            <Input placeholder="Set notes" {...register(`exercises.${idx}.sets.${setIdx}.notes`)} />
            <Button type="button" variant="outline" onClick={() => setArray.remove(setIdx)}>Remove Set</Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={() => setArray.append({ weight: 0, reps: 8, rpe: null, notes: "" })}>Add Set</Button>
      </div>
    </div>
  );
}

export default function WorkoutsPage() {
  const supabase = useMemo(() => createClient(), []);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const form = useForm<WorkoutInput>({
    resolver: zodResolver(workoutSchema) as never,
    defaultValues: { name: "", date: new Date().toISOString().slice(0, 10), notes: "", exercises: [] },
  });
  const fields = useFieldArray({ control: form.control, name: "exercises" });

  useEffect(() => {
    void supabase.from("exercises").select("*").then(({ data }) => setExercises((data ?? []) as Exercise[]));
  }, []);

  async function onSubmit(values: WorkoutInput) {
    const { data: workout, error } = await supabase.from("workouts").insert({ name: values.name, date: values.date, notes: values.notes || null }).select("id").single();
    if (error || !workout) return toast.error(error?.message ?? "Could not create workout.");

    for (let i = 0; i < values.exercises.length; i += 1) {
      const ex = values.exercises[i];
      const { data: row, error: weError } = await supabase
        .from("workout_exercises")
        .insert({ workout_id: workout.id, exercise_id: ex.exercise_id, order_index: i, notes: ex.notes || null })
        .select("id")
        .single();
      if (weError || !row) return toast.error(weError?.message ?? "Could not create workout exercise.");
      const payload = ex.sets.map((set, idx) => ({ workout_exercise_id: row.id, set_number: idx + 1, weight: set.weight, reps: set.reps, rpe: set.rpe || null, notes: set.notes || null }));
      const { error: setError } = await supabase.from("sets").insert(payload);
      if (setError) return toast.error(setError.message);
    }
    toast.success("Workout saved.");
    form.reset({ name: "", date: new Date().toISOString().slice(0, 10), notes: "", exercises: [] });
  }

  return (
    <Card>
      <CardHeader><CardTitle>Create Workout</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="flex flex-col gap-2"><Label>Name</Label><Input {...form.register("name")} /></div>
            <div className="flex flex-col gap-2"><Label>Date</Label><Input type="date" {...form.register("date")} /></div>
          </div>
          <div className="flex flex-col gap-2"><Label>Notes</Label><Textarea {...form.register("notes")} /></div>
          <Button type="button" variant="outline" onClick={() => fields.append({ exercise_id: exercises[0]?.id ?? "", notes: "", sets: [{ weight: 0, reps: 8, rpe: null, notes: "" }] })}>Add Exercise</Button>
          {fields.fields.map((field, idx) => (
            <ExerciseSection
              key={field.id}
              idx={idx}
              exercises={exercises}
              control={form.control}
              register={form.register}
              setValue={form.setValue}
              selectedExerciseId={form.watch(`exercises.${idx}.exercise_id`)}
              onRemove={() => fields.remove(idx)}
            />
          ))}
          <div className="flex gap-2">
            <Button type="submit">Save Workout</Button>
            <Button type="button" variant="outline" onClick={() => form.reset()}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
