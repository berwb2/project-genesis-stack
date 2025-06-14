
-- Add a new column to track assistant-specific chat sessions
ALTER TABLE public.ai_sessions ADD COLUMN assistant_identifier TEXT;
