/*
  # Fix RLS policies for anonymous submissions

  1. Changes
    - Drop and recreate policies with proper permissions
    - Enable anonymous submissions without authentication
    - Fix reference number lookup functionality
    - Ensure proper access control for all tables

  2. Security
    - Maintains data isolation
    - Allows anonymous form submissions
    - Enables reference-based lookups
    - Restricts sensitive operations appropriately
*/

-- Drop existing policies
DO $$ 
BEGIN
  -- Applications table
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow anonymous submissions' AND tablename = 'applications') THEN
    DROP POLICY "Allow anonymous submissions" ON applications;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow reference number lookup' AND tablename = 'applications') THEN
    DROP POLICY "Allow reference number lookup" ON applications;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Allow update own applications' AND tablename = 'applications') THEN
    DROP POLICY "Allow update own applications" ON applications;
  END IF;

  -- Related tables
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

-- Temporarily disable RLS to ensure clean slate
ALTER TABLE applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE agency_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

-- Create new policies with proper permissions
-- Applications table policies
CREATE POLICY "applications_insert_policy" 
  ON applications FOR INSERT 
  WITH CHECK (true);  -- Allow all inserts

CREATE POLICY "applications_select_policy" 
  ON applications FOR SELECT 
  USING (
    CASE
      WHEN current_setting('app.reference_number', true) IS NOT NULL 
        THEN reference_number = current_setting('app.reference_number', true)::text
      WHEN auth.jwt() ->> 'email' IS NOT NULL 
        THEN email = auth.jwt() ->> 'email'
      ELSE false
    END
  );

-- Tourist applications policies
CREATE POLICY "tourist_applications_policy" 
  ON tourist_applications FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = tourist_applications.id
      AND (
        CASE
          WHEN current_setting('app.reference_number', true) IS NOT NULL 
            THEN a.reference_number = current_setting('app.reference_number', true)::text
          WHEN auth.jwt() ->> 'email' IS NOT NULL 
            THEN a.email = auth.jwt() ->> 'email'
          ELSE false
        END
      )
    )
  );

-- Agency applications policies
CREATE POLICY "agency_applications_policy" 
  ON agency_applications FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = agency_applications.id
      AND (
        CASE
          WHEN current_setting('app.reference_number', true) IS NOT NULL 
            THEN a.reference_number = current_setting('app.reference_number', true)::text
          WHEN auth.jwt() ->> 'email' IS NOT NULL 
            THEN a.email = auth.jwt() ->> 'email'
          ELSE false
        END
      )
    )
  );

-- Documents policies
CREATE POLICY "documents_policy" 
  ON application_documents FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_documents.application_id
      AND (
        CASE
          WHEN current_setting('app.reference_number', true) IS NOT NULL 
            THEN a.reference_number = current_setting('app.reference_number', true)::text
          WHEN auth.jwt() ->> 'email' IS NOT NULL 
            THEN a.email = auth.jwt() ->> 'email'
          ELSE false
        END
      )
    )
  );

-- Create helper function for reference number
CREATE OR REPLACE FUNCTION set_reference_number(ref text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.reference_number', ref, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;