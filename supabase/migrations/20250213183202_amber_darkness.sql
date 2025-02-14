/*
  # Create storage bucket for documents

  1. New Storage
    - Create 'documents' bucket for storing passport copies and other application documents
  
  2. Security
    - Enable public access for uploads and downloads
    - Set up appropriate bucket policies
*/

-- Enable storage by creating the documents bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', true);

-- Create storage policies for the documents bucket
CREATE POLICY "Allow public uploads"
  ON storage.objects
  FOR INSERT
  TO public
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow public downloads"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'documents');

-- Create policy for deleting own files
CREATE POLICY "Allow users to delete own files"
  ON storage.objects
  FOR DELETE
  TO public
  USING (bucket_id = 'documents' AND (auth.uid() = owner OR auth.uid() IS NULL));