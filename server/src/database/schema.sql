-- Gallery Products Table Schema
-- Run this SQL in your Supabase SQL Editor to create the required table

-- Create the gallery_products table
CREATE TABLE IF NOT EXISTS gallery_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  image_path TEXT,
  category VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE gallery_products ENABLE ROW LEVEL SECURITY;

-- Create policies for the gallery_products table
-- Allow public read access
CREATE POLICY "Allow public read access" ON gallery_products
  FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated insert" ON gallery_products
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update
CREATE POLICY "Allow authenticated update" ON gallery_products
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Allow authenticated delete" ON gallery_products
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gallery_products_category ON gallery_products(category);
CREATE INDEX IF NOT EXISTS idx_gallery_products_is_active ON gallery_products(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_products_created_at ON gallery_products(created_at DESC);

-- Create storage bucket for images (run in Supabase dashboard or via API)
-- Storage bucket: gallery-images
-- Configure as public bucket
