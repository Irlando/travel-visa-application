/*
  # Update application policies for anonymous access

  1. Changes
    - Add policy for anonymous users to view their own applications by reference number
    - Update insert policy to allow anonymous submissions
    - Add policy for viewing application status

  2. Security
    - Maintains RLS on applications table
    - Allows anonymous application submissions
    - Restricts access to only the relevant application data
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow anonymous insert" ON applications;
DROP POLICY IF EXISTS "Allow reference number lookup" ON applications;

-- Create new policies
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