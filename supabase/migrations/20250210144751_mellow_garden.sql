/*
  # Update RLS policies for applications

  1. Changes
    - Update the insert policy to allow anonymous users to create applications
    - Add policy for authenticated users to update their own applications
    - Add policy for authenticated users to view their own applications

  2. Security
    - Maintains RLS on applications table
    - Ensures users can only access their own data
    - Allows anonymous users to create applications
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
DROP POLICY IF EXISTS "Anyone can create applications" ON applications;

-- Create new policies
CREATE POLICY "Allow anonymous insert"
  ON applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Users can view their own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can update their own applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (email = auth.jwt() ->> 'email')
  WITH CHECK (email = auth.jwt() ->> 'email');