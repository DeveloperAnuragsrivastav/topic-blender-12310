# LinkedIn Post Manager - Supabase Integration Guide

> Complete backend integration with Supabase PostgreSQL database

## 🚀 Quick Start

### 1. Setup Environment Variables
```bash
# Create .env.local in project root
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_WEBHOOK_URL=https://n8n.gignaati.com/webhook-test/07e74f76-8ca8-4b43-87f9-0d95a0ee8bae
```

### 2. Initialize Database
- Create Supabase project at supabase.com
- Go to SQL Editor
- Run `docs/database-schema.sql`

### 3. Start App
```bash
npm install
npm run dev
```

---

## 📚 Documentation

- **[Full Integration Guide](./docs/SUPABASE_INTEGRATION.md)** - Comprehensive setup & reference
- **[Quick Checklist](./SETUP_CHECKLIST.md)** - Step-by-step setup
- **[Implementation Summary](./docs/IMPLEMENTATION_SUMMARY.md)** - What was changed
- **[Database Schema](./docs/database-schema.sql)** - SQL definitions

---

## 🎯 Features Integrated

### Authentication
- ✅ Email/password signup
- ✅ Email/password login
- ✅ Session management
- ✅ Auto-login persistence
- ✅ Row-level security

### Data Storage
- ✅ Save configurations (prompt + topic + image + schedule)
- ✅ Load configurations
- ✅ Update configurations
- ✅ Delete configurations
- ✅ Configuration history

### Submission Tracking
- ✅ Log all webhook submissions
- ✅ Store webhook responses
- ✅ Track submission status (pending/success/failed)
- ✅ Audit trail with timestamps

### Image Management
- ✅ Image upload support
- ✅ Store as base64 or file
- ✅ Image deletion
- ✅ Public URL generation

---

## 📊 Database Tables

### configurations
```sql
-- User's saved prompts & settings
- id, user_id, prompt, topic, image
- scheduled_time, repeat_frequency
- is_active, created_at, updated_at
```

### submissions
```sql
-- History of all webhook submissions
- id, user_id, configuration_id
- prompt, topic, image
- webhook_response, submitted_at, status
```

### webhook_logs
```sql
-- Detailed webhook call logs
- id, user_id, submission_id
- payload, response_status, response_body, created_at
```

### user_profiles
```sql
-- User profile information
- id, username, email, created_at, updated_at
```

---

## 🔐 Security

All data is protected by:
- **Authentication**: Email/password with Supabase Auth
- **Row Level Security**: Database-enforced access control
- **RLS Policies**: Users can only access their own data
- **Environment Variables**: Sensitive keys not in code

---

## 💾 Key Database Functions

### Save Configuration
```typescript
const result = await saveConfiguration(userId, {
  prompt: "...",
  topic: "...",
  image: "...",
  scheduled_time: "7 AM",
  repeat_frequency: "daily"
});
```

### Get Latest Configuration
```typescript
const { data: config } = await getLatestConfiguration(userId);
```

### Submit to Webhook
```typescript
const submission = await createSubmission(userId, configId, data);
await logWebhookCall(userId, submissionId, payload, status);
```

### Get History
```typescript
const submissions = await getSubmissionHistory(userId, limit);
const logs = await getWebhookLogs(userId, limit);
```

---

## 🧪 Testing

### Manual Testing
1. Sign up with test email
2. Create and save configuration
3. Submit to webhook
4. Check Supabase dashboard for data

### Database Queries
```sql
-- Check user data
SELECT * FROM user_profiles;

-- Check configurations
SELECT * FROM configurations WHERE user_id = 'user-id';

-- Check submissions
SELECT * FROM submissions ORDER BY submitted_at DESC;

-- Check webhook logs
SELECT * FROM webhook_logs ORDER BY created_at DESC;
```

---

## 🆘 Troubleshooting

### Auth not working
- Check .env.local has correct keys
- Verify Supabase project URL format
- Check browser console for errors

### Data not saving
- Confirm user is authenticated
- Check RLS policies in Supabase
- Look for error messages in DevTools

### Webhook not submitting
- Check webhook URL in .env.local
- Verify n8n endpoint is active
- Review webhook_logs table

---

## 📁 Project Structure

```
src/
├── lib/
│   ├── supabase.ts       ← Client init
│   ├── types.ts          ← TS interfaces
│   └── db.ts             ← Database functions
├── contexts/
│   └── AuthContext.tsx   ← Auth provider
└── pages/
    ├── Auth.tsx          ← Login/signup
    └── Index.tsx         ← Main page

docs/
├── database-schema.sql
└── SUPABASE_INTEGRATION.md
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────────┐
│   User Sign Up / Login                  │
├─────────────────────────────────────────┤
│   AuthContext with Supabase Auth        │
│   JWT stored in browser session         │
└─────────────────────┬───────────────────┘
                      │
        ┌─────────────┴──────────────┐
        │                             │
┌───────▼──────────────────┐  ┌──────▼─────────────────────┐
│ Create/Save Configuration │  │  Load Configuration        │
│ saveConfiguration()       │  │  getLatestConfiguration()  │
│ Stored in DB             │  │  Auto-load on page mount  │
└───────┬──────────────────┘  └──────────────────────────┘
        │
        │
┌───────▼──────────────────┐
│ Submit to Webhook        │
│ createSubmission()       │
│ fetch() to webhook       │
│ logWebhookCall()         │
│ updateSubmissionStatus() │
└──────────────────────────┘
```

---

## 📈 Performance

- Database indexed for fast lookups
- RLS policies checked at database level
- JWT tokens managed by Supabase
- Connection pooling built-in

---

## 🎓 Learn More

- [Supabase Docs](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Database Guide](https://supabase.com/docs/guides/database)
- [Auth Guide](https://supabase.com/docs/guides/auth)

---

## 📞 Support

1. **Check docs/** folder for detailed guides
2. **Review browser console** for error messages
3. **Check Supabase dashboard** Activity/Logs
4. **Consult Supabase documentation**

---

## ✅ Status

- **Authentication**: ✅ Fully Integrated
- **Database**: ✅ Fully Integrated  
- **Webhook Logging**: ✅ Fully Integrated
- **Error Handling**: ✅ Fully Implemented
- **Loading States**: ✅ Fully Implemented
- **Documentation**: ✅ Complete

---

**Last Updated**: November 2024
**Version**: 1.0.0
**Status**: Production Ready
