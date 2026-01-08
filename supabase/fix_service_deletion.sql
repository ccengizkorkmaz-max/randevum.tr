-- 1. Mevcut kısıtlamayı bulup silelim (İsmi muhtemelen appointments_service_id_fkey)
alter table public.appointments drop constraint if exists appointments_service_id_fkey;

-- 2. Kısıtlamayı ON DELETE CASCADE ile tekrar ekleyelim
-- Bu sayede bir hizmet silindiğinde, o hizmete ait geçmiş randevular da temizlenir ve hata alınmaz.
alter table public.appointments 
add constraint appointments_service_id_fkey 
foreign key (service_id) 
references public.services(id) 
on delete cascade;
