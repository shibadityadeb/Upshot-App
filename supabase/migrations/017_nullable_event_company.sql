-- Allow events without a company (user-hosted events from hosting applications)
ALTER TABLE events ALTER COLUMN company_id DROP NOT NULL;
