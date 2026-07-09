-- Allow ambassadors to update their own record (e.g. auto-generate referral code)
DROP POLICY IF EXISTS ambassadors_update ON ambassadors;
CREATE POLICY ambassadors_update ON ambassadors FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  OR auth.uid() = user_id
);
