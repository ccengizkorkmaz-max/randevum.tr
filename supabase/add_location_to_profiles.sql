-- profiles tablosuna adres ve konum linki sütunlarını ekle
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS location_url TEXT;

-- RLS politikaları zaten var olduğu için (user_id check) ek işlem gerekmez.
