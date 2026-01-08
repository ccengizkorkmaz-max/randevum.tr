-- Önceki politikaları temizle
drop policy if exists "Anyone can create appointments" on public.appointments;
drop policy if exists "Users can view own appointments" on public.appointments;
drop policy if exists "Users can update own appointments" on public.appointments;

-- 1. Herkes randevu oluşturabilsin (Müşteriler için)
create policy "Anyone can create appointments" 
on public.appointments for insert 
with check (true);

-- 2. İşletme sahibi kendi randevularını görebilsin
create policy "Users can view own appointments" 
on public.appointments for select 
using (auth.uid() = user_id);

-- 3. İşletme sahibi kendi randevularını güncelleyebilsin (Onay/İptal)
create policy "Users can update own appointments" 
on public.appointments for update 
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
