-- Drop the cartoon avatars.
--
-- The profile screen used to offer four DiceBear illustrations to pick from,
-- and that picker was the only thing that ever wrote profiles.avatar_url —
-- sign-up sets it to NULL and Google sign-in never touches it. With the picker
-- gone, the URLs it stored would keep rendering wherever a person appears
-- (participant lists, the admin directory, host and ambassador profiles), so
-- clear them and let those fall back to initials.
--
-- Scoped to DiceBear URLs rather than blanking the column, so anything set from
-- another source is left alone.
UPDATE profiles
SET avatar_url = NULL
WHERE avatar_url LIKE '%api.dicebear.com%';
