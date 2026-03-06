-- Database schema for gallery products
-- Run this SQL in your Supabase SQL Editor

-- Create gallery_products table
CREATE TABLE IF NOT EXISTS gallery_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  category TEXT,
  image_url TEXT,
  image_path TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security)
ALTER TABLE gallery_products ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to gallery_products"
  ON gallery_products FOR SELECT
  TO public
  USING (true);

-- Allow service role full access
CREATE POLICY "Allow service role full access to gallery_products"
  ON gallery_products
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_gallery_products_is_active 
  ON gallery_products(is_active);

CREATE INDEX IF NOT EXISTS idx_gallery_products_created_at 
  ON gallery_products(created_at DESC);
