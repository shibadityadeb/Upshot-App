-- Add the 'host' role to the user_role enum.
--
-- This MUST live in its own migration. Postgres allows ALTER TYPE ... ADD VALUE
-- inside a transaction block (PG12+), but the new value cannot be *referenced*
-- until that transaction commits. Migration 022 creates the hosts table and the
-- policies that compare against 'host'.

ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'host';
