-- ============================================================
-- 015 — Referral reward function (SECURITY DEFINER)
-- ============================================================
-- Awards coins to an ambassador when someone registers with their code.
-- Runs with elevated privileges to bypass RLS on coin_transactions
-- and ambassadors tables.

CREATE OR REPLACE FUNCTION award_referral_coins(
  referrer_ambassador_id UUID,
  referred_user_id UUID,
  coin_amount INT DEFAULT 20
)
RETURNS VOID AS $$
DECLARE
  referrer_user_id UUID;
BEGIN
  -- Look up the ambassador's user_id
  SELECT user_id INTO referrer_user_id
  FROM ambassadors WHERE id = referrer_ambassador_id;

  IF referrer_user_id IS NULL THEN
    RETURN;
  END IF;

  -- Insert coin transaction for the referrer
  INSERT INTO coin_transactions (user_id, type, amount, description, reference_type, reference_id)
  VALUES (referrer_user_id, 'earned', coin_amount, 'Referral reward', 'referral', referred_user_id::text);

  -- Update ambassador's total_coins_earned
  UPDATE ambassadors
  SET total_coins_earned = total_coins_earned + coin_amount
  WHERE id = referrer_ambassador_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
