-- Create comments table (guestbook)
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name text NOT NULL DEFAULT '',
  message text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz
);

-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Anyone can insert (visitors leave comments)
DROP POLICY IF EXISTS "Anyone can submit comments" ON comments;
CREATE POLICY "Anyone can submit comments"
  ON comments FOR INSERT
  TO anon
  WITH CHECK (true);

-- Anyone can read approved comments (public display)
DROP POLICY IF EXISTS "Anyone can read comments" ON comments;
CREATE POLICY "Anyone can read comments"
  ON comments FOR SELECT
  TO anon
  USING (true);

-- Anyone can update (admin approves/rejects from frontend)
DROP POLICY IF EXISTS "Anyone can update comments" ON comments;
CREATE POLICY "Anyone can update comments"
  ON comments FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Anyone can delete (admin deletes from frontend)
DROP POLICY IF EXISTS "Anyone can delete comments" ON comments;
CREATE POLICY "Anyone can delete comments"
  ON comments FOR DELETE
  TO anon
  USING (true);
