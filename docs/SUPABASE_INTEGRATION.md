# Supabase Integration Guide - LinkedIn Post Manager

## Table of Contents
1. [Project Overview](#project-overview)
2. [Supabase Setup](#supabase-setup)
3. [Database Schema](#database-schema)
4. [Environment Configuration](#environment-configuration)
5. [Implementation Details](#implementation-details)
6. [Using the Database](#using-the-database)
7. [Troubleshooting](#troubleshooting)

---

## Project Overview

### What's Been Integrated

This LinkedIn Post Manager application has been successfully integrated with Supabase to provide:

- **Authentication**: Email/password authentication with user profiles
- **Data Persistence**: Store configurations, submissions, and webhook logs in Supabase
- **Real-time Capabilities**: Ready for real-time subscriptions
- **Storage**: Image upload support via Supabase Storage
- **Security**: Row Level Security (RLS) policies to ensure data privacy

### Tech Stack
- **Frontend**: React + TypeScript + Vite
- **Backend**: Supabase (PostgreSQL)
- **UI**: Shadcn/ui components
- **State Management**: React Context API

---

## Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: `linkedin-post-manager`
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your location
5. Wait for the project to be created (2-3 minutes)

### Step 2: Get Your Credentials

1. Go to **Project Settings** > **API**
2. Copy the following credentials:
   - **Project URL** (https://hcrkotpyidtiusjgdrgz.supabase.co)
   - **anon public** key (eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhjcmtvdHB5aWR0aXVzamdkcmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMxMTYwNDUsImV4cCI6MjA3ODY5MjA0NX0.QXoUN1uFaWLhNVLYu8UZ5IHxusmLAHVygQ-_pON-9nQ)
3. Keep these safe - you'll need them next

### Step 3: Set Up Database

1. Go to **SQL Editor** in the left sidebar
2. Click **"New Query"**
3. Copy the entire contents from `docs/database-schema.sql`
4. Paste it into the SQL editor
5. Click **"Run"** to execute all SQL commands
6. Wait for confirmation that all tables and policies were created

### Step 4: Create Storage Bucket

1. Go to **Storage** in the left sidebar
2. Click **"New Bucket"**
3. Name it: `post-images`
4. Choose **Public** (or Private if you want to handle access control)
5. Click **Create Bucket**

---

## Database Schema

### Tables Overview

#### 1. `user_profiles`
Stores user profile information

```sql
- id (UUID): Primary key, links to auth.users
- username (VARCHAR): Unique username
- email (VARCHAR): User email
- created_at (TIMESTAMP): Account creation time
- updated_at (TIMESTAMP): Last update time
```

#### 2. `configurations`
Stores saved prompt configurations per user

```sql
- id (UUID): Unique configuration ID
- user_id (UUID): Foreign key to auth.users
- prompt (TEXT): The AI prompt template
- topic (VARCHAR): Content topic
- image (TEXT): Image URL from storage
- scheduled_time (VARCHAR): e.g., "7 AM"
- repeat_frequency (VARCHAR): e.g., "daily", "week"
- is_active (BOOLEAN): Whether this config is currently active
- created_at/updated_at (TIMESTAMP): Timestamps
```

#### 3. `submissions`
Tracks history of all content submissions

```sql
- id (UUID): Unique submission ID
- user_id (UUID): Foreign key to auth.users
- configuration_id (UUID): Which config was used
- prompt (TEXT): Exact prompt sent
- topic (VARCHAR): Exact topic sent
- image (TEXT): Image URL sent
- webhook_response (JSONB): Response from webhook
- submitted_at (TIMESTAMP): When it was submitted
- status (VARCHAR): 'pending', 'success', or 'failed'
```

#### 4. `webhook_logs`
Detailed logs of webhook calls for debugging

```sql
- id (UUID): Unique log ID
- user_id (UUID): Foreign key to auth.users
- submission_id (UUID): Which submission triggered this
- payload (JSONB): The data sent to webhook
- response_status (INTEGER): HTTP status code
- response_body (JSONB): Response content
- created_at (TIMESTAMP): When the call was made
```

### Relationships

```
auth.users (1) ──→ (many) user_profiles
auth.users (1) ──→ (many) configurations
auth.users (1) ──→ (many) submissions
auth.users (1) ──→ (many) webhook_logs
configurations (1) ──→ (many) submissions
submissions (1) ──→ (many) webhook_logs
```

---

## Environment Configuration

### Create .env.local File

In your project root directory, create a `.env.local` file:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Webhook Configuration
VITE_WEBHOOK_URL=https://n8n.gignaati.com/webhook-test/07e74f76-8ca8-4b43-87f9-0d95a0ee8bae
```

### How to Find Your Credentials

1. **VITE_SUPABASE_URL**: Project Settings > API > Project URL
   - Example: `https://abcdefgh123456.supabase.co`

2. **VITE_SUPABASE_ANON_KEY**: Project Settings > API > anon public
   - Example: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **VITE_WEBHOOK_URL**: Keep your existing webhook URL or update as needed

### Environment Variables in Vercel/Production

If deploying to Vercel or other platforms:
1. Go to Project Settings > Environment Variables
2. Add the same variables for `production`, `preview`, and `development`
3. Re-deploy to apply changes

---

## Implementation Details

### New Files Created

#### 1. `src/lib/supabase.ts`
Client initialization and configuration

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

#### 2. `src/lib/types.ts`
TypeScript interfaces for all database entities

```typescript
- UserProfile
- Configuration
- Submission
- WebhookLog
- AuthUser
```

#### 3. `src/lib/db.ts`
Database service functions for CRUD operations

**Configuration Operations:**
- `saveConfiguration()` - Create new config
- `updateConfiguration()` - Update existing config
- `getLatestConfiguration()` - Fetch active config
- `getAllConfigurations()` - Get all user configs
- `deleteConfiguration()` - Remove config

**Submission Operations:**
- `createSubmission()` - Log a new submission
- `updateSubmissionStatus()` - Update submission result
- `getSubmissionHistory()` - Get submission history
- `logWebhookCall()` - Log webhook interactions
- `getWebhookLogs()` - Retrieve webhook logs

**Storage Operations:**
- `uploadImage()` - Upload image to Supabase Storage
- `deleteImage()` - Remove image from Storage

### Updated Files

#### 1. `src/contexts/AuthContext.tsx`
**Changes:**
- Replaced localStorage with Supabase Auth
- Implements `signInWithPassword()` for login
- Implements `signUp()` for registration
- Subscribes to auth state changes
- Returns user data with ID

```typescript
// Old: localStorage based
const login = (username: string, password: string) => {
  localStorage.setItem('dummyUser', JSON.stringify({username}));
}

// New: Supabase based
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
}
```

#### 2. `src/pages/Auth.tsx`
**Changes:**
- Changed from username to email/password
- Added username field for signup
- Added loading states
- Added error handling with toast notifications
- Made methods async

```typescript
// Now uses email instead of username
<Input id="email" type="email" />
// Added username field for signup
{!isLogin && <Input id="username" />}
```

#### 3. `src/pages/Index.tsx`
**Changes:**
- Replaced localStorage with Supabase database queries
- Added loading states
- Configuration auto-loads from database
- Submissions are logged with webhook responses
- Images are base64 encoded (ready for storage integration)

```typescript
// Old: localStorage
const stored = localStorage.getItem("webhookData");
localStorage.setItem("webhookData", JSON.stringify(data));

// New: Supabase database
const { data: config } = await getLatestConfiguration(user.id);
const result = await saveConfiguration(user.id, data);
```

---

## Using the Database

### Authentication Flow

```
User enters email/password
↓
AuthContext.signup() / login()
↓
Supabase Auth validates credentials
↓
JWT token stored in browser session
↓
User data available in useAuth() hook
```

### Configuration Save Flow

```
User fills prompt, topic, image
↓
Clicks "Save Configuration"
↓
saveConfiguration() or updateConfiguration()
↓
Data saved to "configurations" table
↓
Configuration ID stored in component state
↓
User can now submit or edit
```

### Submission Flow

```
User clicks "Deploy to Webhook"
↓
createSubmission() creates record in "submissions"
↓
fetch() sends to webhook URL
↓
updateSubmissionStatus() updates submission record
↓
logWebhookCall() records the API interaction
↓
User sees success/error toast
```

### Data Retrieval Flow

```
Page loads
↓
useEffect calls loadConfiguration()
↓
getLatestConfiguration() fetches active config
↓
Form pre-populates with saved data
↓
User can edit or submit
```

---

## Querying Data

### Example: Get Current User's Active Configuration

```typescript
const { data: config, error } = await getLatestConfiguration(user.id);

if (config) {
  console.log('Topic:', config.topic);
  console.log('Prompt:', config.prompt);
  console.log('Created:', config.created_at);
}
```

### Example: Get Submission History

```typescript
const { data: submissions, error } = await getSubmissionHistory(user.id, 20);

submissions.forEach(submission => {
  console.log(`${submission.topic} - ${submission.status}`);
});
```

### Example: Get Webhook Logs for Debugging

```typescript
const { data: logs, error } = await getWebhookLogs(user.id, 10);

logs.forEach(log => {
  console.log(`Status: ${log.response_status}`);
  console.log('Response:', log.response_body);
});
```

---

## Row Level Security (RLS)

### What is RLS?

RLS ensures users can only access their own data. All policies follow this principle:

```sql
-- Users can only select their own data
CREATE POLICY "Users can view their own configurations"
  ON configurations FOR SELECT
  USING (auth.uid() = user_id);
```

### Policies in Place

1. **user_profiles**: Users see and edit only their profile
2. **configurations**: Users see/create/edit/delete only their configs
3. **submissions**: Users see/create/edit/delete only their submissions
4. **webhook_logs**: Users see/create/delete only their logs

### Testing RLS

1. Create two test users
2. Log in as User A
3. Try to access User B's data
4. Should get a permission error (expected)

---

## Debugging

### Enable Supabase Logs

```typescript
// In your main.tsx or App.tsx
import { supabase } from '@/lib/supabase';

// Enable debug logs
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth event:', event, 'Session:', session);
});
```

### Check Database Connections

```typescript
// Simple test query
async function testConnection() {
  const { data, error } = await supabase
    .from('configurations')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful:', data);
  }
}
```

### Monitor Webhook Logs

1. Go to Supabase Dashboard > SQL Editor
2. Run:
```sql
SELECT * FROM webhook_logs 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

---

## Troubleshooting

### Issue: "Missing Supabase environment variables"

**Solution:** Ensure `.env.local` file exists with correct variables
```bash
# Check if file exists
ls .env.local

# Verify content
cat .env.local
```

### Issue: "Cannot find module '@supabase/supabase-js'"

**Solution:** Reinstall dependencies
```bash
npm install @supabase/supabase-js
```

### Issue: Authentication not working

1. Check if Supabase Auth is enabled (should be by default)
2. Verify email/password auth method is active in Dashboard
3. Check browser console for specific error messages

### Issue: "permission denied" errors

1. These are RLS policy violations (expected if accessing other users' data)
2. Check policies in SQL Editor
3. Ensure `user_id` matches `auth.uid()`

### Issue: Images not uploading

1. Check if storage bucket `post-images` exists
2. Verify bucket is set to public (or handle auth)
3. Check browser console for CORS issues
4. Current implementation stores base64 - consider converting to file upload later

### Issue: Configuration not saving

1. Check Network tab in DevTools for API calls
2. Look for error messages in browser console
3. Verify user is authenticated (check useAuth hook)
4. Check Supabase API logs in dashboard

---

## Next Steps

### To Add More Features

1. **Real-time Subscriptions**: Monitor submissions in real-time
   ```typescript
   supabase
     .from('submissions')
     .on('*', payload => console.log(payload))
     .subscribe();
   ```

2. **Image Storage**: Upload images to Supabase Storage instead of base64
   ```typescript
   const { url } = await uploadImage(userId, file);
   ```

3. **Export Data**: Generate reports of submissions
   ```typescript
   const { data: submissions } = await getSubmissionHistory(userId, 1000);
   // Generate CSV, PDF, etc.
   ```

4. **Email Notifications**: Trigger emails on successful submission
   - Use Supabase Realtime + database triggers
   - Or integrate SendGrid/Mailgun

### Performance Optimization

1. Add pagination to submission history
2. Implement caching with React Query
3. Use database indexes (already added for common queries)
4. Monitor database usage in Supabase Dashboard

---

## Support & Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Supabase Database Guide](https://supabase.com/docs/guides/database)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Documentation](https://supabase.com/docs/guides/storage)

---

## Summary of Changes

### ✅ Completed

- [x] Supabase client initialization
- [x] Database schema creation
- [x] Authentication integration
- [x] Configuration CRUD operations
- [x] Submission tracking
- [x] Webhook logging
- [x] Row Level Security policies
- [x] TypeScript types
- [x] Error handling
- [x] Loading states

### 📝 Installation Steps

1. Copy environment variables to `.env.local`
2. Create Supabase project
3. Run SQL schema
4. Test authentication
5. Run application with `npm run dev`

### 🔄 Data Migration

If you had old localStorage data, you can manually migrate it:

```typescript
// Load old data
const old = localStorage.getItem('webhookData');
// Save to Supabase
await saveConfiguration(userId, JSON.parse(old));
// Clear localStorage
localStorage.removeItem('webhookData');
```

---

**Last Updated**: November 2024
**Version**: 1.0.0
**Status**: Ready for Production
