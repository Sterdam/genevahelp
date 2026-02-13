-- GenevaMap - Initial Schema
-- Run this in Supabase SQL Editor

CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS postgis;

-- Categories enum
CREATE TYPE resource_category AS ENUM (
  'food', 'health', 'legal', 'housing', 'language', 'education',
  'employment', 'clothing', 'hygiene', 'wifi', 'finance', 'children',
  'elderly', 'women', 'addiction', 'social', 'admin', 'emergency', 'other'
);

-- Main resources table
CREATE TABLE resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category resource_category NOT NULL,
  tags TEXT[] DEFAULT '{}',
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  geog GEOGRAPHY(POINT, 4326) GENERATED ALWAYS AS (
    ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
  ) STORED,
  phone TEXT,
  email TEXT,
  website TEXT,
  opening_hours JSONB DEFAULT '{}',
  access_conditions TEXT,
  target_audience TEXT,
  languages_spoken TEXT[] DEFAULT '{fr}',
  wheelchair_accessible BOOLEAN DEFAULT NULL,
  source TEXT,
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  upvotes INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_verified_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_resources_category ON resources(category);
CREATE INDEX idx_resources_geog ON resources USING GIST(geog);
CREATE INDEX idx_resources_name_trgm ON resources USING GIN(name gin_trgm_ops);
CREATE INDEX idx_resources_description_trgm ON resources USING GIN(description gin_trgm_ops);
CREATE INDEX idx_resources_verified ON resources(verified);

-- Suggestions table
CREATE TABLE suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT CHECK (type IN ('new', 'correction', 'closed')) NOT NULL,
  resource_id UUID REFERENCES resources(id),
  name TEXT NOT NULL,
  description TEXT,
  category resource_category,
  address TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  email TEXT,
  website TEXT,
  opening_hours JSONB,
  submitted_by UUID,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Upvotes table
CREATE TABLE upvotes (
  user_id UUID NOT NULL,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, resource_id)
);

-- Reports table
CREATE TABLE reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  resource_id UUID REFERENCES resources(id) ON DELETE CASCADE,
  reason TEXT CHECK (reason IN ('closed', 'wrong_info', 'wrong_location', 'duplicate', 'inappropriate')) NOT NULL,
  details TEXT,
  submitted_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Resources are viewable by everyone" ON resources FOR SELECT USING (true);
CREATE POLICY "Anyone can submit suggestions" ON suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Approved suggestions are viewable" ON suggestions FOR SELECT USING (status = 'approved' OR submitted_by = auth.uid());
CREATE POLICY "Authenticated users can upvote" ON upvotes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can see their upvotes" ON upvotes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can remove their upvotes" ON upvotes FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Anyone can report" ON reports FOR INSERT WITH CHECK (true);

-- Functions
CREATE OR REPLACE FUNCTION nearby_resources(
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  radius_meters INTEGER DEFAULT 2000,
  cat resource_category DEFAULT NULL
)
RETURNS SETOF resources AS $$
  SELECT * FROM resources
  WHERE ST_DWithin(geog, ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, radius_meters)
  AND (cat IS NULL OR category = cat)
  ORDER BY geog <-> ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION search_resources(search_query TEXT)
RETURNS SETOF resources AS $$
  SELECT * FROM resources
  WHERE name ILIKE '%' || search_query || '%'
    OR description ILIKE '%' || search_query || '%'
    OR search_query = ANY(tags)
  ORDER BY
    CASE WHEN name ILIKE '%' || search_query || '%' THEN 0 ELSE 1 END,
    upvotes DESC;
$$ LANGUAGE SQL STABLE;
