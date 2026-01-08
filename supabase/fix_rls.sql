-- Drop existing policies for profiles
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;

-- Create more comprehensive policies
create policy "Users can insert their own profile" 
on public.profiles for insert 
with check (auth.uid() = id);

create policy "Users can update own profile" 
on public.profiles for update 
using (auth.uid() = id)
with check (auth.uid() = id);

-- Ensure authenticated users can definitely use storage for images
drop policy if exists "Authenticated Upload" on storage.objects;
create policy "Authenticated Upload"
on storage.objects for insert
with check ( bucket_id = 'images' AND (auth.role() = 'authenticated') );
