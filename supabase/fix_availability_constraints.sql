-- 1. Önce eski veya çakışan kısıtlamaları temizleyelim
alter table public.availability drop constraint if exists availability_user_id_day_of_week_key;
alter table public.availability drop constraint if exists availability_staff_day_of_week_key;

-- 2. Personel bazlı benzersiz kısıtlama (Personel seçiliyken çakışmayı önler)
alter table public.availability add constraint availability_staff_day_of_week_key unique(staff_id, day_of_week);

-- 3. İşletme bazlı (eski yapı) benzersiz kısıtlama (Personel seçilmemişken çakışmayı önler)
-- Not: PostgREST (Supabase JS) ON CONFLICT 'user_id, day_of_week' dediğinde bu kısıtlamayı arar
alter table public.availability add constraint availability_user_id_day_of_week_key unique(user_id, day_of_week);
