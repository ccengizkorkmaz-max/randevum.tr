-- Email onayı bekleyen tüm kullanıcıları onayla
-- UYARI: Bu işlem geri alınamaz! Sadece development ortamında kullanın.

UPDATE auth.users
SET 
    email_confirmed_at = NOW()
WHERE 
    email_confirmed_at IS NULL;

-- Kaç kullanıcının onaylandığını görmek için:
-- SELECT COUNT(*) FROM auth.users WHERE email_confirmed_at IS NOT NULL;
