-- Functions to atomically increment/decrement current_attendees on events

CREATE OR REPLACE FUNCTION increment_attendees(event_id_input UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events
  SET current_attendees = current_attendees + 1
  WHERE id = event_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION decrement_attendees(event_id_input UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE events
  SET current_attendees = GREATEST(current_attendees - 1, 0)
  WHERE id = event_id_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
