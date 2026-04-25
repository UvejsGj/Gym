"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { exerciseSchema, muscleGroups, equipmentOptions } from "@/lib/validations/common";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import type { Exercise } from "@/types/database";
import type { Equipment, MuscleGroup } from "@/types/database";

const initial = { name: "", muscle_group: "Chest", equipment: "Barbell", notes: "" };

export default function ExercisesPage() {
  const supabase = useMemo(() => createClient(), []);
  const [items, setItems] = useState<Exercise[]>([]);
  const [form, setForm] = useState(initial);
  const [filter, setFilter] = useState<string>("all");
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase.from("exercises").select("*").order("created_at", { ascending: false });
    if (error) return toast.error(error.message);
    setItems((data ?? []) as Exercise[]);
  }

  useEffect(() => { void load(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = exerciseSchema.safeParse({ ...form, notes: form.notes || null });
    if (!parsed.success) return toast.error("Please check exercise fields.");

    const payload = { ...parsed.data, notes: parsed.data.notes ?? null };
    const request = editingId
      ? supabase.from("exercises").update(payload).eq("id", editingId)
      : supabase.from("exercises").insert(payload);
    const { error } = await request;
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Exercise updated." : "Exercise added.");
    setForm(initial);
    setEditingId(null);
    await load();
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this exercise?")) return;
    const { error } = await supabase.from("exercises").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Exercise deleted.");
    await load();
  }

  const list = filter === "all" ? items : items.filter((x) => x.muscle_group === filter);

  return (
    <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
      <Card>
        <CardHeader><CardTitle>{editingId ? "Edit Exercise" : "Add Exercise"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-2"><Label>Name</Label><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
            <div className="flex flex-col gap-2"><Label>Muscle Group</Label><Select value={form.muscle_group} onValueChange={(v) => setForm((p) => ({ ...p, muscle_group: (v ?? "Chest") as MuscleGroup }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{muscleGroups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></div>
            <div className="flex flex-col gap-2"><Label>Equipment</Label><Select value={form.equipment} onValueChange={(v) => setForm((p) => ({ ...p, equipment: (v ?? "Barbell") as Equipment }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{equipmentOptions.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select></div>
            <div className="flex flex-col gap-2"><Label>Notes</Label><Textarea value={form.notes ?? ""} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} /></div>
            <div className="flex gap-2"><Button type="submit">{editingId ? "Update" : "Add"}</Button>{editingId && <Button variant="outline" type="button" onClick={() => { setEditingId(null); setForm(initial); }}>Cancel</Button>}</div>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Exercises</CardTitle></CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Select value={filter} onValueChange={(v) => setFilter(v ?? "all")}><SelectTrigger><SelectValue placeholder="Filter by muscle group" /></SelectTrigger><SelectContent><SelectItem value="all">All muscle groups</SelectItem>{muscleGroups.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
          <div className="flex flex-col gap-2">
            {list.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.muscle_group} - {item.equipment}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setEditingId(item.id); setForm({ name: item.name, muscle_group: item.muscle_group, equipment: item.equipment, notes: item.notes ?? "" }); }}>Edit</Button>
                  <Button variant="destructive" onClick={() => void onDelete(item.id)}>Delete</Button>
                </div>
              </div>
            ))}
            {!list.length && <p className="text-sm text-muted-foreground">No exercises found.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
