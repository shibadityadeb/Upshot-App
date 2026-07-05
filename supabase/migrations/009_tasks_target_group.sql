-- Allow tasks to be assigned to a group instead of a specific user
ALTER TABLE tasks ALTER COLUMN assigned_to DROP NOT NULL;

ALTER TABLE tasks ADD COLUMN IF NOT EXISTS target_group TEXT
  CHECK (target_group IN ('campus_cartel', 'students', 'ambassadors'));
