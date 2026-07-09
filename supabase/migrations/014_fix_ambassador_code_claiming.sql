-- ============================================================
-- 014 — Allow authenticated users to claim ambassador codes
-- ============================================================
-- The existing policy only lets admins modify ambassador_codes.
-- During registration, a non-admin user needs to mark a code
-- as claimed. This policy allows that.

CREATE POLICY ambassador_codes_claim ON ambassador_codes
  FOR UPDATE
  USING (is_active = true AND is_claimed = false)
  WITH CHECK (is_claimed = true AND assigned_to = auth.uid());
