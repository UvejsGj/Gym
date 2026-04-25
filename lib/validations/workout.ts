import { z } from "zod";
import { workoutSetSchema } from "@/lib/validations/common";

export const workoutSchema = z.object({
  name: z.string().min(2).max(120),
  date: z.string().min(1),
  notes: z.string().max(1000).optional().nullable(),
  exercises: z
    .array(
      z.object({
        exercise_id: z.string().uuid(),
        notes: z.string().max(1000).optional().nullable(),
        sets: z.array(workoutSetSchema).min(1),
      }),
    )
    .min(1),
});

export type WorkoutInput = z.infer<typeof workoutSchema>;
