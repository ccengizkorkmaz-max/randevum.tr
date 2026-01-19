-- Add role column if it doesn't exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Update the specific user to admin
DO $$
DECLARE
    target_user_id uuid;
BEGIN
    -- Try to find the user in auth.users
    SELECT id INTO target_user_id FROM auth.users WHERE email = 'Ccengizkorkmaz@gmail.com';
    
    -- If found, update the profile
    IF target_user_id IS NOT NULL THEN
        UPDATE public.profiles SET role = 'admin' WHERE id = target_user_id;
    END IF;
END $$;
