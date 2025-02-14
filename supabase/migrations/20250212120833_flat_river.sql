/*
  # Fix application policies for anonymous submissions

  1. Changes
    - Safely drop and recreate policies using DO blocks
    - Add comprehensive policies for anonymous and authenticated users
    - Enable reference number lookup
    - Allow document uploads for own applications

  2. Security
    - Maintains RLS protection
    - Allows anonymous submissions while preventing unauthorized access
    - Enables reference number-based lookups
    - Restricts document access to application owners
*/

-- Use DO block to safely handle policy cleanup
DO $$ 
BEGIN
  -- Drop existing policies if they exist
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous submissions' AND tablename = 'applications') THEN
    DROP POLICY "Allow anonymous submissions" ON applications;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow reference number lookup' AND tablename = 'applications') THEN
    DROP POLICY "Allow reference number lookup" ON applications;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update own applications' AND tablename = 'applications') THEN
    DROP POLICY "Allow update own applications" ON applications;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow tourist application access' AND tablename = 'tourist_applications') THEN
    DROP POLICY "Allow tourist application access" ON tourist_applications;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow agency application access' AND tablename = 'agency_applications') THEN
    DROP POLICY "Allow agency application access" ON agency_applications;
  END IF;

  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow document access' AND tablename = 'application_documents') THEN
    DROP POLICY "Allow document access" ON application_documents;
  END IF;
END $$;

-- Create new comprehensive policies
CREATE POLICY "Allow anonymous submissions"
  ON applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow reference number lookup"
  ON applications
  FOR SELECT
  TO anon, authenticated
  USING (
    reference_number = current_setting('app.reference_number', true)::text
    OR (auth.jwt() ->> 'email' IS NOT NULL AND email = auth.jwt() ->> 'email')
  );

CREATE POLICY "Allow update own applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');

CREATE POLICY "Allow tourist application access"
  ON tourist_applications
  FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = tourist_applications.id
      AND (
        a.reference_number = current_setting('app.reference_number', true)::text
        OR (auth.jwt() ->> 'email' IS NOT NULL AND a.email = auth.jwt() ->> 'email')
      )
    )
  );

CREATE POLICY "Allow agency application access"
  ON agency_applications
  FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = agency_applications.id
      AND (
        a.reference_number = current_setting('app.reference_number', true)::text
        OR (auth.jwt() ->> 'email' IS NOT NULL AND a.email = auth.jwt() ->> 'email')
      )
    )
  );

CREATE POLICY "Allow document access"
  ON application_documents
  FOR ALL
  TO anon, authenticated
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_documents.application_id
      AND (
        a.reference_number = current_setting('app.reference_number', true)::text
        OR (auth.jwt() ->> 'email' IS NOT NULL AND a.email = auth.jwt() ->> 'email')
      )
    )
  );

-- Create or replace function to set reference number
CREATE OR REPLACE FUNCTION set_reference_number(ref text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.reference_number', ref, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;