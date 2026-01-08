-- Create customers table
create table if not exists public.customers (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null, -- Provider
  name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.customers enable row level security;

-- Policies for customers
create policy "Users can view own customers" 
  on public.customers for select 
  using (auth.uid() = user_id);

create policy "Users can insert own customers" 
  on public.customers for insert 
  with check (auth.uid() = user_id);

create policy "Users can update own customers" 
  on public.customers for update 
  using (auth.uid() = user_id);

create policy "Users can delete own customers" 
  on public.customers for delete 
  using (auth.uid() = user_id);

-- Add customer_id to appointments
alter table public.appointments 
add column if not exists customer_id uuid references public.customers(id);

-- Index for searching customers by phone (for deduplication/auto-complete)
create index if not exists idx_customers_user_phone on public.customers(user_id, phone);
create index if not exists idx_customers_user_name on public.customers(user_id, name);
