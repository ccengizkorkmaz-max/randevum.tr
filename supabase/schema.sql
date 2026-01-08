-- Create tables for Linka

-- Profiles: Public profile for the service provider
create table public.profiles (
  id uuid references auth.users not null primary key,
  slug text unique not null,
  business_name text not null,
  bio text,
  phone text, -- +90...
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Services: Services offered by the provider
create table public.services (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  title text not null,
  description text,
  duration integer not null, -- in minutes
  price numeric not null,
  currency text default 'TRY',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Appointments: Booking records
create table public.appointments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null, -- Provider
  service_id uuid references public.services(id) not null,
  customer_name text not null,
  customer_phone text not null,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  status text check (status in ('pending', 'confirmed', 'cancelled')) default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies (Basic setup, refine later)
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

alter table public.services enable row level security;
create policy "Services are viewable by everyone" on public.services for select using (true);
create policy "Users can manage own services" on public.services for all using (auth.uid() = user_id);

alter table public.appointments enable row level security;
create policy "Provider can view own appointments" on public.appointments for select using (auth.uid() = user_id);
create policy "Public can insert appointments" on public.appointments for insert with check (true);
