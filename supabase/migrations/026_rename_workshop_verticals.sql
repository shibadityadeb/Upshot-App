-- Rename the two workshop verticals to their new brand names.
--
--   iRISE     -> Events
--   iBelieve  -> Growth Solutions
--
-- Only the display name and tagline change. The slugs stay `irise` / `ibelieve`
-- because they are identifiers, not copy: they appear in deep links
-- (`/opportunities?vertical=irise`), in the theme's colour map, and as the key
-- every screen matches on. Renaming them would break existing links and require
-- re-pointing events.vertical_id for no user-visible gain.
--
-- The old taglines named the previous identities ("women who lead",
-- "entrepreneurs"), so they are replaced rather than left contradicting the new
-- names. Adjust the wording freely — nothing keys off it.

UPDATE verticals
SET name    = 'Events',
    tagline = 'Conferences, summits and meetups across India'
WHERE slug = 'irise';

UPDATE verticals
SET name    = 'Growth Solutions',
    tagline = 'Programmes that help businesses and founders grow'
WHERE slug = 'ibelieve';
