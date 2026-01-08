-- Add customer_email and reminder_sent to appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS customer_email TEXT,
ADD COLUMN IF NOT EXISTS reminder_sent BOOLEAN DEFAULT FALSE;

-- Create an index for querying pending reminders efficiently
CREATE INDEX IF NOT EXISTS idx_appointments_reminders 
ON public.appointments (start_time, reminder_sent, status);
