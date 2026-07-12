-- Allow admins to read all coin transactions (for dashboard stats)
DROP POLICY IF EXISTS coin_transactions_select ON coin_transactions;
CREATE POLICY coin_transactions_select ON coin_transactions FOR SELECT USING (
  user_id = auth.uid()
  OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
