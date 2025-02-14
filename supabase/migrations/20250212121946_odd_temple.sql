/*
  # Simplify RLS policies for applications

  1. Changes
    - Reset all RLS policies to a simpler, more permissive model
    - Allow all inserts without any restrictions
    - Maintain secure read access via reference number
    - Remove unnecessary complexity

  2. Security
    - Maintains basic data isolation
    - Enables anonymous submissions
    - Preserves reference-based lookups
*/

-- Drop all existing policies
DO $$ 
BEGIN
  -- Drop all policies from all relevant tables
  DROP POLICY IF EXISTS "applications_insert_policy" ON applications;
  DROP POLICY IF EXISTS "applications_select_policy" ON applications;
  DROP POLICY IF EXISTS "tourist_applications_policy" ON tourist_applications;
  DROP POLICY IF EXISTS "agency_applications_policy" ON agency_applications;
  DROP POLICY IF EXISTS "documents_policy" ON application_documents;
END $$;

-- Reset RLS
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE agency_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents DISABLE ROW LEVEL SECURITY;

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

-- Create simplified policies
-- Applications table - Allow all inserts, restrict reads
CREATE POLICY "public_insert_applications"
  ON applications
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "read_own_applications"
  ON applications
  FOR SELECT
  TO public
  USING (
    reference_number = coalesce(current_setting('app.reference_number', true), '')::text
    OR email = coalesce(auth.jwt() ->> 'email', '')::text
  );

-- Tourist applications - Allow access based on parent application
CREATE POLICY "access_tourist_applications"
  ON tourist_applications
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = tourist_applications.id
      AND (
        a.reference_number = coalesce(current_setting('app.reference_number', true), '')::text
        OR a.email = coalesce(auth.jwt() ->> 'email', '')::text
      )
    )
  );

-- Agency applications - Allow access based on parent application
CREATE POLICY "access_agency_applications"
  ON agency_applications
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = agency_applications.id
      AND (
        a.reference_number = coalesce(current_setting('app.reference_number', true), '')::text
        OR a.email = coalesce(auth.jwt() ->> 'email', '')::text
      )
    )
  );

-- Documents - Allow access based on parent application
CREATE POLICY "access_documents"
  ON application_documents
  FOR ALL
  TO public
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_documents.application_id
      AND (
        a.reference_number = coalesce(current_setting('app.reference_number', true), '')::text
        OR a.email = coalesce(auth.jwt() ->> 'email', '')::text
      )
    )
  );

-- Helper function for reference number (unchanged but included for completeness)
CREATE OR REPLACE FUNCTION set_reference_number(ref text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.reference_number', ref, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;