-- Allow users to insert their own task submissions (cloned from group tasks)
-- Previously only admins could insert tasks, but the clone-on-submit flow
-- needs regular users to create personal copies of group tasks.

DROP POLICY IF EXISTS tasks_insert ON tasks;
CREATE POLICY tasks_insert ON tasks FOR INSERT WITH CHECK (
  -- Admins can create any task
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  -- Regular users can only insert tasks assigned to themselves (clone-on-submit)
  OR assigned_to = auth.uid()
);

-- Update SELECT policy to also allow users to see group tasks via target_group
DROP POLICY IF EXISTS tasks_select ON tasks;
CREATE POLICY tasks_select ON tasks FOR SELECT USING (
  assigned_to = auth.uid()
  OR assigned_by = auth.uid()
  OR target_group IS NOT NULL
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
