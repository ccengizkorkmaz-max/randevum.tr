-- Tüm eski profil politikalarını temizle
drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert their own profile" on public.profiles;

-- Herkes profilleri görebilsin
create policy "Allow public select" 
on public.profiles for select 
using (true);

-- Oturum açmış kullanıcı kendi profilini her şekilde yönetsin (insert, update, delete)
create policy "Allow owner manage" 
on public.profiles for all 
using (auth.uid() = id);

-- NOT: Eğer hata devam ederse RLS'yi geçici olarak kapatıp deneyebilirsiniz:
-- alter table public.profiles disable row level security;
