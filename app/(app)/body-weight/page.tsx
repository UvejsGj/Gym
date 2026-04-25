"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { bodyWeightSchema } from "@/lib/validations/common";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { formatDate } from "@/lib/utils/format";
import type { BodyWeightEntry } from "@/types/database";

const initial = { date: new Date().toISOString().slice(0, 10), weight: "", notes: "" };

export default function BodyWeightPage() {
  const supabase = useMemo(() => createClient(), []);
  const [entries, setEntries] = useState<BodyWeightEntry[]>([]);
  const [form, setForm] = useState(initial);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    const { data, error } = await supabase.from("body_weight_entries").select("*").order("date", { ascending: true });
    if (error) return toast.error(error.message);
    setEntries((data ?? []) as BodyWeightEntry[]);
  }

  useEffect(() => { void load(); }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = bodyWeightSchema.safeParse({ date: form.date, weight: form.weight, notes: form.notes || null });
    if (!parsed.success) return toast.error("Check body weight values.");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) return toast.error("You must be logged in to add body weight.");
    const request = editingId
      ? supabase.from("body_weight_entries").update(parsed.data).eq("id", editingId)
      : supabase.from("body_weight_entries").insert({ ...parsed.data, user_id: user.id });
    const { error } = await request;
    if (error) return toast.error(error.message);
    toast.success(editingId ? "Entry updated." : "Entry added.");
    setForm(initial);
    setEditingId(null);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this weight entry?")) return;
    const { error } = await supabase.from("body_weight_entries").delete().eq("id", id);
    if (error) return toast.error(error.message);
    await load();
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[360px_1fr]">
      <Card>
        <CardHeader><CardTitle>{editingId ? "Edit Entry" : "Add Body Weight"}</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <div className="flex flex-col gap-2"><Label>Date</Label><Input type="date" value={form.date} onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))} /></div>
            <div className="flex flex-col gap-2"><Label>Weight (kg)</Label><Input type="number" step="0.1" value={form.weight} onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))} /></div>
            <div className="flex flex-col gap-2"><Label>Notes</Label><Textarea value={form.notes} onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))} /></div>
            <Button type="submit">{editingId ? "Update Entry" : "Add Entry"}</Button>
          </form>
        </CardContent>
      </Card>
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader><CardTitle>Weight Over Time</CardTitle></CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={entries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="var(--color-chart-1)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Entries</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-2">
            {entries.slice().reverse().map((entry) => (
              <div className="flex items-center justify-between rounded-md border p-3" key={entry.id}>
                <div>
                  <p className="font-medium">{entry.weight} kg</p>
                  <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setEditingId(entry.id); setForm({ date: entry.date, weight: String(entry.weight), notes: entry.notes ?? "" }); }}>Edit</Button>
                  <Button variant="destructive" onClick={() => void remove(entry.id)}>Delete</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
