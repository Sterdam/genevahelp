-- Visit counter
CREATE TABLE site_stats (
  id TEXT PRIMARY KEY DEFAULT 'global',
  visit_count BIGINT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO site_stats (id, visit_count) VALUES ('global', 0);

-- Atomic increment function (SECURITY DEFINER bypasses RLS for the UPDATE)
CREATE OR REPLACE FUNCTION increment_visits()
RETURNS BIGINT AS $$
  UPDATE site_stats
  SET visit_count = visit_count + 1, updated_at = NOW()
  WHERE id = 'global'
  RETURNING visit_count;
$$ LANGUAGE SQL VOLATILE SECURITY DEFINER;

-- RLS
ALTER TABLE site_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read stats" ON site_stats FOR SELECT USING (true);

-- Allow anonymous users to call the increment function
GRANT EXECUTE ON FUNCTION increment_visits() TO anon;
GRANT EXECUTE ON FUNCTION increment_visits() TO authenticated;
