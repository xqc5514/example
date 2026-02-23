/*
  # Online Shark Tank Platform Schema

  ## Overview
  This migration creates the complete database schema for an online Shark Tank platform
  where users can browse startups, view funding details, and see investor information.

  ## New Tables
  
  ### 1. `sectors`
  Stores different business sectors/categories for startups
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text, unique) - Sector name (e.g., Technology, Healthcare)
  - `description` (text) - Brief description of the sector
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. `startups`
  Main table storing all startup information
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Startup name
  - `description` (text) - Detailed description
  - `sector_id` (uuid, foreign key) - Reference to sectors table
  - `logo_url` (text) - URL to startup logo/image
  - `profit_margin` (decimal) - Profit margin percentage
  - `funding_needed` (decimal) - Amount of funding needed
  - `equity_offered` (decimal) - Percentage of equity offered
  - `founded_year` (integer) - Year the startup was founded
  - `website` (text) - Startup website URL
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. `investors`
  Stores investor information linked to startups
  - `id` (uuid, primary key) - Unique identifier
  - `startup_id` (uuid, foreign key) - Reference to startups table
  - `name` (text) - Investor full name
  - `phone` (text) - Investor phone number
  - `email` (text) - Investor email address
  - `investment_amount` (decimal, nullable) - Amount invested
  - `created_at` (timestamptz) - Record creation timestamp

  ## Security
  All tables have Row Level Security (RLS) enabled with public read access.
  This allows anyone to view startup and investor information (read-only access).
*/

-- Create sectors table
CREATE TABLE IF NOT EXISTS sectors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create startups table
CREATE TABLE IF NOT EXISTS startups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text DEFAULT '',
  sector_id uuid REFERENCES sectors(id) ON DELETE SET NULL,
  logo_url text DEFAULT '',
  profit_margin decimal(5,2) DEFAULT 0,
  funding_needed decimal(15,2) DEFAULT 0,
  equity_offered decimal(5,2) DEFAULT 0,
  founded_year integer DEFAULT EXTRACT(YEAR FROM now())::integer,
  website text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create investors table
CREATE TABLE IF NOT EXISTS investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id uuid REFERENCES startups(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  phone text DEFAULT '',
  email text DEFAULT '',
  investment_amount decimal(15,2),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE sectors ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE investors ENABLE ROW LEVEL SECURITY;

-- Create public read access policies
CREATE POLICY "Anyone can view sectors"
  ON sectors FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view startups"
  ON startups FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view investors"
  ON investors FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_startups_sector_id ON startups(sector_id);
CREATE INDEX IF NOT EXISTS idx_startups_name ON startups(name);
CREATE INDEX IF NOT EXISTS idx_investors_startup_id ON investors(startup_id);