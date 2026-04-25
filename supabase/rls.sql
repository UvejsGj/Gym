alter table public.profiles enable row level security;
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.workout_exercises enable row level security;
alter table public.sets enable row level security;
alter table public.body_weight_entries enable row level security;

create policy "profiles_owner_all" on public.profiles
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "exercises_owner_all" on public.exercises
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workouts_owner_all" on public.workouts
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "body_weight_owner_all" on public.body_weight_entries
for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "workout_exercises_owner_all" on public.workout_exercises
for all
using (
  exists (
    select 1 from public.workouts w
    where w.id = workout_id and w.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.workouts w
    where w.id = workout_id and w.user_id = auth.uid()
  )
);

create policy "sets_owner_all" on public.sets
for all
using (
  exists (
    select 1
    from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.workout_exercises we
    join public.workouts w on w.id = we.workout_id
    where we.id = workout_exercise_id and w.user_id = auth.uid()
  )
);
