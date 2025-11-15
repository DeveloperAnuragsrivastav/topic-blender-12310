-- ============================================
-- SUPABASE DATABASE SCHEMA FOR LINKEDIN POST MANAGER
-- ============================================
-- This schema sets up all necessary tables and RLS policies
-- for the LinkedIn Post Manager application

-- ============================================
-- 1. ENABLE REQUIRED EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 2. USER PROFILES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- 3. CONFIGURATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS configurations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prompt TEXT NOT NULL,
  topic VARCHAR(500) NOT NULL,
  image TEXT, -- Stores the image URL from storage
  scheduled_time VARCHAR(50), -- e.g., "7 AM", "2 PM"
  repeat_frequency VARCHAR(50), -- e.g., "daily", "week", "2days"
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  CONSTRAINT configurations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_configurations_user_id ON configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_configurations_created_at ON configurations(created_at DESC);

-- ============================================
-- 4. SUBMISSIONS TABLE (History of posted content)
-- ============================================
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  configuration_id UUID REFERENCES configurations(id) ON DELETE SET NULL,
  prompt TEXT NOT NULL,
  topic VARCHAR(500) NOT NULL,
  image TEXT, -- Image URL
  webhook_response JSONB, -- Stores the response from webhook
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  
  CONSTRAINT submissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT submissions_configuration_id_fkey FOREIGN KEY (configuration_id) REFERENCES configurations(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);

-- ============================================
-- 5. WEBHOOK LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  
  CONSTRAINT webhook_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  CONSTRAINT webhook_logs_submission_id_fkey FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_webhook_logs_user_id ON webhook_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_submission_id ON webhook_logs(submission_id);
CREATE INDEX IF NOT EXISTS idx_webhook_logs_created_at ON webhook_logs(created_at DESC);

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles RLS
CREATE POLICY "Users can view their own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Configurations RLS
CREATE POLICY "Users can view their own configurations"
  ON configurations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create configurations"
  ON configurations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own configurations"
  ON configurations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own configurations"
  ON configurations FOR DELETE
  USING (auth.uid() = user_id);

-- Submissions RLS
CREATE POLICY "Users can view their own submissions"
  ON submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create submissions"
  ON submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own submissions"
  ON submissions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own submissions"
  ON submissions FOR DELETE
  USING (auth.uid() = user_id);

-- Webhook Logs RLS
CREATE POLICY "Users can view their own webhook logs"
  ON webhook_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create webhook logs"
  ON webhook_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own webhook logs"
  ON webhook_logs FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 7. STORAGE BUCKET SETUP
-- ============================================
-- Create storage bucket for post images
-- Note: This should be created via Supabase Dashboard or API

-- Storage RLS policies (if needed):
-- CREATE POLICY "Users can upload their own images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'post-images' AND auth.uid() = owner);

-- CREATE POLICY "Users can access their own images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'post-images' AND auth.uid() = owner);

-- CREATE POLICY "Users can delete their own images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'post-images' AND auth.uid() = owner);

-- ============================================
-- 8. TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- Apply trigger to configurations
CREATE TRIGGER update_configurations_updated_at
  BEFORE UPDATE ON configurations
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();

-- ============================================
-- 9. SAMPLE QUERIES
-- ============================================
-- Get latest active configuration for a user:
-- SELECT * FROM configurations 
-- WHERE user_id = auth.uid() AND is_active = TRUE 
-- ORDER BY created_at DESC LIMIT 1;

-- Get submission history:
-- SELECT * FROM submissions 
-- WHERE user_id = auth.uid() 
-- ORDER BY submitted_at DESC LIMIT 10;

-- Get webhook logs for debugging:
-- SELECT * FROM webhook_logs 
-- WHERE user_id = auth.uid() 
-- ORDER BY created_at DESC LIMIT 20;
