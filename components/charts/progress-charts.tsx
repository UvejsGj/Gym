"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface Point { date: string; value: number; }
interface ProgressChartsProps {
  bodyWeight: Point[];
  volume: Point[];
  oneRm: Point[];
  weeklyWorkouts: Point[];
}

export function ProgressCharts({ bodyWeight, volume, oneRm, weeklyWorkouts }: ProgressChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {["Body Weight Over Time", "Workout Volume Over Time", "Estimated 1RM Over Time", "Workouts Completed Per Week"].map((title) => (
          <Card key={title}>
            <CardHeader><CardTitle>{title}</CardTitle></CardHeader>
            <CardContent className="h-64 md:h-72" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card><CardHeader><CardTitle>Body Weight Over Time</CardTitle></CardHeader><CardContent className="h-64 md:h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={bodyWeight}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="value" stroke="var(--color-chart-1)" /></LineChart></ResponsiveContainer></CardContent></Card>
      <Card><CardHeader><CardTitle>Workout Volume Over Time</CardTitle></CardHeader><CardContent className="h-64 md:h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={volume}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="value" stroke="var(--color-chart-2)" /></LineChart></ResponsiveContainer></CardContent></Card>
      <Card><CardHeader><CardTitle>Estimated 1RM Over Time</CardTitle></CardHeader><CardContent className="h-64 md:h-72"><ResponsiveContainer width="100%" height="100%"><LineChart data={oneRm}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="value" stroke="var(--color-chart-3)" /></LineChart></ResponsiveContainer></CardContent></Card>
      <Card><CardHeader><CardTitle>Workouts Completed Per Week</CardTitle></CardHeader><CardContent className="h-64 md:h-72"><ResponsiveContainer width="100%" height="100%"><BarChart data={weeklyWorkouts}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="value" fill="var(--color-chart-4)" /></BarChart></ResponsiveContainer></CardContent></Card>
    </div>
  );
}
