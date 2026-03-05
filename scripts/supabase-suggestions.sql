-- Add missing columns to suggestions table
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS submitter_contact text;
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS submitter_name text;
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS submitter_relation text;
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS target_audience text;
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS access_conditions text;
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS languages_spoken text;
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS wheelchair_accessible boolean;
ALTER TABLE suggestions ADD COLUMN IF NOT EXISTS reviewed_at timestamptz;

-- Make submitted_by and resource_id nullable (not needed for anonymous suggestions)
ALTER TABLE suggestions ALTER COLUMN submitted_by DROP NOT NULL;
ALTER TABLE suggestions ALTER COLUMN resource_id DROP NOT NULL;

-- Set defaults
ALTER TABLE suggestions ALTER COLUMN status SET DEFAULT 'pending';
ALTER TABLE suggestions ALTER COLUMN created_at SET DEFAULT now();
ALTER TABLE suggestions ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Drop existing policies if any, then recreate
DROP POLICY IF EXISTS "Anyone can submit suggestions" ON suggestions;
DROP POLICY IF EXISTS "Anyone can read suggestions" ON suggestions;
DROP POLICY IF EXISTS "Anyone can update suggestions" ON suggestions;
DROP POLICY IF EXISTS "Anyone can delete suggestions" ON suggestions;

-- Enable RLS (idempotent)
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to INSERT (anonymous users submit suggestions)
CREATE POLICY "Anyone can submit suggestions"
  ON suggestions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anyone to SELECT (admin reads from frontend)
CREATE POLICY "Anyone can read suggestions"
  ON suggestions FOR SELECT
  TO anon
  USING (true);

-- Allow anyone to UPDATE (admin approves/rejects from frontend)
CREATE POLICY "Anyone can update suggestions"
  ON suggestions FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anyone to DELETE (admin deletes from frontend)
CREATE POLICY "Anyone can delete suggestions"
  ON suggestions FOR DELETE
  TO anon
  USING (true);
