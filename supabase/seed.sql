insert into public.exercises (user_id, name, muscle_group, equipment, notes)
values
  (auth.uid(), 'Bench Press', 'Chest', 'Barbell', null),
  (auth.uid(), 'Squat', 'Legs', 'Barbell', null),
  (auth.uid(), 'Deadlift', 'Back', 'Barbell', null),
  (auth.uid(), 'Overhead Press', 'Shoulders', 'Barbell', null),
  (auth.uid(), 'Pull Up', 'Back', 'Bodyweight', null),
  (auth.uid(), 'Barbell Row', 'Back', 'Barbell', null),
  (auth.uid(), 'Dumbbell Curl', 'Biceps', 'Dumbbell', null),
  (auth.uid(), 'Triceps Pushdown', 'Triceps', 'Cable', null),
  (auth.uid(), 'Leg Press', 'Legs', 'Machine', null),
  (auth.uid(), 'Plank', 'Core', 'Bodyweight', null);
