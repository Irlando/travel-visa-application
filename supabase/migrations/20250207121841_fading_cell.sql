/*
  # Initial schema for visa applications

  1. New Tables
    - applications
      - Base table for all applications (both tourist and agency)
      - Stores common fields for all application types
      - Uses RLS to control access
    - tourist_applications
      - Extends applications table for tourist-specific data
    - agency_applications
      - Extends applications table for agency-specific data
    - application_documents
      - Stores document references (passport copies, etc.)
    
  2. Security
    - RLS enabled on all tables
    - Policies for authenticated users to access their own data
    - Public can create applications (but must provide email)
    
  3. Enums and Types
    - application_status: tracks the state of applications
    - application_type: distinguishes between tourist and agency applications
*/

-- Create enums
CREATE TYPE application_status AS ENUM (
  'pending_payment',
  'payment_received',
  'processing',
  'approved',
  'rejected',
  'cancelled'
);

CREATE TYPE application_type AS ENUM (
  'tourist',
  'agency'
);

-- Create the base applications table
CREATE TABLE applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  type application_type NOT NULL,
  status application_status DEFAULT 'pending_payment',
  reference_number text UNIQUE NOT NULL DEFAULT 'REF-' || substr(md5(random()::text), 1, 8),
  email text NOT NULL,
  given_names text NOT NULL,
  last_names text NOT NULL,
  sex text NOT NULL,
  birth_date date NOT NULL,
  birth_place text NOT NULL,
  residence_country text NOT NULL,
  nationality text NOT NULL,
  passport_number text NOT NULL,
  passport_validity date NOT NULL,
  passport_issuer text NOT NULL,
  flight_number text NOT NULL,
  arrival_date date NOT NULL,
  departure_date date NOT NULL,
  arrival_city text NOT NULL,
  has_existing_visa boolean DEFAULT false,
  accommodation_name text NOT NULL,
  accommodation_address text NOT NULL,
  accommodation_city text NOT NULL,
  payment_amount numeric(10,2),
  payment_currency text DEFAULT 'EUR',
  payment_status text DEFAULT 'pending',
  payment_reference text,
  payment_date timestamptz
);

-- Create tourist applications table
CREATE TABLE tourist_applications (
  id uuid PRIMARY KEY REFERENCES applications(id) ON DELETE CASCADE,
  additional_notes text
);

-- Create agency applications table
CREATE TABLE agency_applications (
  id uuid PRIMARY KEY REFERENCES applications(id) ON DELETE CASCADE,
  agency_name text NOT NULL,
  agency_contact text NOT NULL,
  agency_email text NOT NULL,
  agency_phone text NOT NULL,
  agency_address text NOT NULL,
  credit_balance numeric(10,2) DEFAULT 0
);

-- Create application documents table
CREATE TABLE application_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid REFERENCES applications(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_path text NOT NULL,
  uploaded_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tourist_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE agency_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own applications"
  ON applications
  FOR SELECT
  USING (email = current_user);

CREATE POLICY "Anyone can create applications"
  ON applications
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own tourist applications"
  ON tourist_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = tourist_applications.id
      AND a.email = current_user
    )
  );

CREATE POLICY "Users can view their own agency applications"
  ON agency_applications
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = agency_applications.id
      AND a.email = current_user
    )
  );

CREATE POLICY "Users can view their own documents"
  ON application_documents
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM applications a
      WHERE a.id = application_documents.application_id
      AND a.email = current_user
    )
  );

-- Create indexes
CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_reference ON applications(reference_number);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_agency_applications_agency_email ON agency_applications(agency_email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();