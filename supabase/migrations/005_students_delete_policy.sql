-- Allow authenticated users to delete their own student record (withdraw application)
CREATE POLICY students_delete ON students FOR DELETE USING (auth.uid() = user_id);

-- Add status column for admin approval flow
ALTER TABLE students ADD COLUMN status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected'));
