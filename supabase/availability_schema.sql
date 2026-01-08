-- Availability: Working hours for the provider
create table public.availability (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  day_of_week text not null, -- 'Pazartesi', 'Salı', etc.
  start_time time not null,
  end_time time not null,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, day_of_week)
);

alter table public.availability enable row level security;
create policy "Availability viewable by everyone" on public.availability for select using (true);
create policy "Users can manage own availability" on public.availability for all using (auth.uid() = user_id);
