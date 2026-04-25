import { z } from "zod";

export const muscleGroups = [
  "Chest",
  "Back",
  "Shoulders",
  "Biceps",
  "Triceps",
  "Legs",
  "Glutes",
  "Core",
  "Full body",
  "Cardio",
] as const;

export const equipmentOptions = [
  "Barbell",
  "Dumbbell",
  "Machine",
  "Cable",
  "Bodyweight",
  "Kettlebell",
  "Other",
] as const;

export const exerciseSchema = z.object({
  name: z.string().min(2).max(100),
  muscle_group: z.enum(muscleGroups),
  equipment: z.enum(equipmentOptions),
  notes: z.string().max(1000).optional().nullable(),
});

export const bodyWeightSchema = z.object({
  date: z.string().min(1),
  weight: z.coerce.number().positive().max(1000),
  notes: z.string().max(1000).optional().nullable(),
});

export const workoutSetSchema = z.object({
  weight: z.coerce.number().min(0),
  reps: z.coerce.number().int().positive().max(200),
  rpe: z.coerce.number().min(1).max(10).optional().nullable(),
  notes: z.string().max(1000).optional().nullable(),
});
