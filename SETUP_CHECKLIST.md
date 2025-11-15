# Supabase Integration - Quick Setup Checklist

## Before Running the App

### ☐ Step 1: Create Supabase Project
- [ ] Go to [supabase.com](https://supabase.com)
- [ ] Sign up / Login
- [ ] Create new project
- [ ] Note the project URL and API keys

### ☐ Step 2: Set Environment Variables
- [ ] Create `.env.local` file in project root
- [ ] Add `VITE_SUPABASE_URL=your_url_here`
- [ ] Add `VITE_SUPABASE_ANON_KEY=your_key_here`
- [ ] Add `VITE_WEBHOOK_URL=...` (optional)

### ☐ Step 3: Initialize Database
- [ ] Go to Supabase SQL Editor
- [ ] Create new query
- [ ] Copy contents of `docs/database-schema.sql`
- [ ] Paste and execute
- [ ] Wait for completion

### ☐ Step 4: Create Storage Bucket
- [ ] Go to Storage tab
- [ ] Click "New Bucket"
- [ ] Name: `post-images`
- [ ] Make it Public
- [ ] Create bucket

### ☐ Step 5: Install Dependencies
```bash
npm install
```

### ☐ Step 6: Start Dev Server
```bash
npm run dev
```

### ☐ Step 7: Test Authentication
- [ ] Go to http://localhost:5173
- [ ] Sign up with test account
- [ ] Should redirect to home page
- [ ] Check Supabase Auth dashboard for new user

### ☐ Step 8: Test Configuration Save
- [ ] Enter prompt and topic
- [ ] Click "Save Configuration"
- [ ] Should see success message
- [ ] Go to Supabase > configurations table
- [ ] Should see your entry

### ☐ Step 9: Test Webhook Submit
- [ ] Click "Deploy to Webhook"
- [ ] Should see success message
- [ ] Check Supabase > submissions table
- [ ] Check webhook_logs table

---

## Troubleshooting Quick Fixes

### "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### "Missing Supabase environment variables"
- Check if `.env.local` exists
- Verify correct keys are used
- Restart dev server after editing `.env.local`

### "User not authenticated"
- Ensure user is logged in
- Check browser console for auth errors
- Clear browser cookies and try again

### "Permission denied" errors
- Normal if accessing other users' data (RLS protection)
- Check if RLS policies are correct in Supabase

---

## Important Notes

1. **Never commit `.env.local`** to git (add to .gitignore)
2. **API Key Security**: The `anon` key is public - this is intentional with RLS
3. **Production**: Set environment variables in your hosting platform
4. **Rate Limits**: Supabase has generous free tier limits

---

## File Structure

```
src/
├── lib/
│   ├── supabase.ts       ← Supabase client
│   ├── types.ts          ← TypeScript interfaces
│   └── db.ts             ← Database functions
├── contexts/
│   └── AuthContext.tsx   ← Auth provider (updated)
└── pages/
    ├── Auth.tsx          ← Login/signup (updated)
    └── Index.tsx         ← Main page (updated)

docs/
├── database-schema.sql   ← SQL schema
└── SUPABASE_INTEGRATION.md ← Full guide

.env.local.example       ← Copy to .env.local
.env.local               ← (Create this locally)
```

---

## Useful Queries for Testing

### Check all users
```sql
SELECT id, email, created_at FROM auth.users;
```

### Get user's configurations
```sql
SELECT * FROM configurations WHERE user_id = 'your-user-id';
```

### Get all submissions
```sql
SELECT * FROM submissions ORDER BY submitted_at DESC;
```

### Check webhook logs
```sql
SELECT * FROM webhook_logs ORDER BY created_at DESC LIMIT 10;
```

---

## Debugging Commands

```bash
# Check environment variables are loaded
npm run dev

# Monitor network requests in browser DevTools (F12)
# Check Console tab for errors

# Check Supabase dashboard for real-time activity
# Go to SQL Editor and run test queries
```

---

## Need Help?

1. Check `docs/SUPABASE_INTEGRATION.md` for detailed guide
2. Check browser console (F12) for specific error messages
3. Check Supabase dashboard Activity Log
4. Review `src/lib/db.ts` for available functions

---

**Last Updated**: November 2024
