-- Migration 003: Add profession and organisation_name to students table

ALTER TABLE students
  ADD COLUMN IF NOT EXISTS profession TEXT,
  ADD COLUMN IF NOT EXISTS organisation_name TEXT;
