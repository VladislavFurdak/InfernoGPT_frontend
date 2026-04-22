-- Add mode column to chat_messages (per-message "fast" or "deep" mode)
ALTER TABLE chat_messages ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT NULL;
