-- 1. Staff (Ekip Üyeleri) Tablosu
create table if not exists public.staff (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  title text, -- Örn: Uzman Berber, Stilist
  avatar_url text,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Politikaları
alter table public.staff enable row level security;
create policy "Staff viewable by everyone" on public.staff for select using (true);
create policy "Users can manage own staff" on public.staff for all using (auth.uid() = user_id);

-- 2. Appointments (Randevular) Tablosuna staff_id ekle
alter table public.appointments 
add column if not exists staff_id uuid references public.staff(id) on delete set null;

-- 3. Availability (Çalışma Saatleri) Tablosuna staff_id ekle
-- Not: Her çalışanın kendi çalışma saati olabilir.
alter table public.availability 
add column if not exists staff_id uuid references public.staff(id) on delete cascade;

-- Benzersiz kısıtlamayı güncelle (user_id + day_of_week yerine staff_id + day_of_week)
alter table public.availability drop constraint if exists availability_user_id_day_of_week_key;
alter table public.availability add constraint availability_staff_day_of_week_key unique(staff_id, day_of_week);
