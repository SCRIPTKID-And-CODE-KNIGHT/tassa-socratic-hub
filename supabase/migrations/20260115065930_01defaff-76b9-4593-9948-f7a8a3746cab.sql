-- Add event_start_date and event_end_date columns to almanac_events
ALTER TABLE public.almanac_events 
ADD COLUMN IF NOT EXISTS event_start_date date,
ADD COLUMN IF NOT EXISTS event_end_date date;

-- Update existing rows to use event_date for both start and end dates
UPDATE public.almanac_events 
SET event_start_date = event_date, 
    event_end_date = event_date 
WHERE event_start_date IS NULL;