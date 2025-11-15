# Migration Guide: From LocalStorage to Supabase

## Overview

This guide helps you migrate from the old localStorage-based system to the new Supabase database system.

---

## Before You Start

- Create a Supabase project (follow SETUP_CHECKLIST.md)
- Initialize database schema
- Set up .env.local with Supabase credentials
- Have your old data backed up

---

## What Changed

### Authentication

**Before (Old System)**
```typescript
// Dummy login - no password validation
const login = (username: string, password: string) => {
  localStorage.setItem('dummyUser', JSON.stringify({ username }));
};
```

**After (New System)**
```typescript
// Real authentication with Supabase
const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
};
```

**Impact**: 
- Users need to create new accounts with email/password
- Old username-only accounts won't work
- No data loss - this is intentional

### Data Storage

**Before (Old System)**
```typescript
// Stored in localStorage as JSON
const data = { prompt: "...", topic: "...", image: "..." };
localStorage.setItem('webhookData', JSON.stringify(data));
```

**After (New System)**
```typescript
// Stored in PostgreSQL database
const result = await saveConfiguration(userId, {
  prompt: "...",
  topic: "...",
  image: "...",
  scheduled_time: "7 AM",
  repeat_frequency: "daily"
});
```

**Benefits**:
- Data persists across browsers
- Multi-device access
- Complete submission history
- Webhook audit trail
- Team collaboration ready

---

## Migration Steps

### Step 1: Update Your Account

1. Create new Supabase project
2. Set up database and environment variables
3. Sign up with your email address

### Step 2: Manually Migrate Data (Optional)

If you want to preserve your old configuration:

#### Option A: Manual Entry
1. Log in to new system
2. Look at your old configuration (stored in browser)
3. Re-enter prompt and topic
4. Click "Save Configuration"

#### Option B: Programmatic Migration

Add this temporary code to migrate old localStorage data:

```typescript
// Run this in browser console after logging in
const oldData = localStorage.getItem('webhookData');
if (oldData) {
  const parsed = JSON.parse(oldData);
  // Manually call saveConfiguration with the data
  console.log('Old config to migrate:', parsed);
  // Then manually create new one through UI
}
```

### Step 3: Test Everything

- [ ] Sign up works
- [ ] Login works
- [ ] Can create configuration
- [ ] Configuration saves to database
- [ ] Can load configuration on page reload
- [ ] Can submit to webhook
- [ ] Submission shows in history

### Step 4: Clean Up Old Data (Optional)

Once everything works, clear old localStorage:

```javascript
// Run in browser console
localStorage.removeItem('webhookData');
localStorage.removeItem('dummyUser');
```

---

## Side-by-Side Comparison

| Feature | Old System | New System |
|---------|-----------|-----------|
| **Storage** | Browser localStorage | Supabase PostgreSQL |
| **Authentication** | Dummy (no password) | Email/password (secure) |
| **Multi-device** | ❌ No | ✅ Yes |
| **Data Backup** | Manual | Automatic |
| **History** | Last submission only | Complete history |
| **Webhook Logs** | Not stored | Fully logged |
| **Offline Access** | Limited | Read latest cached |
| **Data Export** | Manual copy | SQL query |
| **Security** | None | RLS policies |
| **Collaboration** | N/A | Ready for teams |

---

## FAQ

### Q: Will I lose my data?

**A**: Old localStorage data stays in your browser. You can manually migrate it or re-enter. No automatic data loss.

### Q: Can I use my old username?

**A**: No. New system uses email addresses. But you'll see "Welcome, {username}" based on profile setup.

### Q: How do I migrate my submission history?

**A**: Previous submissions aren't automatically migrated (they were stored locally). You can start fresh with the new audit trail.

### Q: Can I use the old system alongside the new one?

**A**: Yes, temporarily. The new system uses Supabase, old system uses localStorage. They won't interfere. But migrate fully for best experience.

### Q: What if I forgot my email?

**A**: Create new Supabase account with any email address. The system uses email as the primary identifier.

### Q: Can I export all my data?

**A**: Yes! Run SQL queries in Supabase SQL Editor to export data.

```sql
-- Export your configurations
SELECT * FROM configurations 
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC;

-- Export your submissions
SELECT * FROM submissions 
WHERE user_id = 'your-user-id'
ORDER BY submitted_at DESC;
```

---

## Verification Checklist

After migration, verify:

### Authentication
- [ ] Can sign up with new email
- [ ] Can log in with that email
- [ ] Can log out
- [ ] Session persists after page refresh
- [ ] Can't log in with wrong password

### Configuration
- [ ] Can create new configuration
- [ ] Sees success message
- [ ] Configuration loads on page reload
- [ ] Can edit configuration
- [ ] Can view saved data

### Webhook Integration
- [ ] Can submit to webhook
- [ ] Sees success message
- [ ] In Supabase, can see:
  - New record in `submissions` table
  - New records in `webhook_logs` table

### Security
- [ ] Can't see other users' data
- [ ] Logged in user has proper ID
- [ ] Configuration has correct user_id

---

## Rollback Plan

If something goes wrong:

1. **Keep old browser**: Old localStorage data stays intact
2. **Check Supabase logs**: Any errors show in Activity
3. **Reset environment**: Delete .env.local and start over
4. **Create new Supabase project**: Can always restart

---

## Troubleshooting

### "My old data disappeared"

Old data is still in browser localStorage until you clear it manually. Check:
```javascript
// In browser console
console.log(localStorage.getItem('webhookData'));
```

### "I can't log in to new system"

1. Check you're using correct email/password
2. Verify Supabase project is created
3. Check .env.local has correct credentials
4. Check browser console for errors

### "Saved configuration isn't loading"

1. Ensure user is logged in (check useAuth hook)
2. Verify Supabase database has tables
3. Check RLS policies aren't blocking access
4. Check browser console for errors

---

## Timeline

### Week 1: Setup
- [ ] Create Supabase project
- [ ] Set up database
- [ ] Deploy new code

### Week 2: Testing
- [ ] Test with small set of users
- [ ] Verify data migration
- [ ] Check webhook integration

### Week 3: Production
- [ ] All users migrated
- [ ] Monitor for issues
- [ ] Keep old system as backup

### Week 4: Cleanup
- [ ] Remove old localStorage code
- [ ] Archive old data
- [ ] Full documentation

---

## Performance Notes

### Old System (localStorage)
- Fast (browser memory)
- Limited (5-10MB per domain)
- No sync across devices
- Data stuck in browser

### New System (Supabase)
- Slightly slower (network call)
- Unlimited storage
- Sync across all devices
- Professional-grade backup

**Overall**: Faster for power users, better experience.

---

## Data Privacy

### What changed:
- Data now stored on Supabase servers (encrypted)
- User credentials validated by Supabase
- RLS policies control data access
- Webhook interactions logged and stored

### What stayed the same:
- Webhook URL remains the same
- Prompts still sent to n8n
- Image handling similar
- Local configuration still works

### Your responsibility:
- Keep .env.local file private
- Don't share Supabase API keys
- Review submitted data before webhook
- Monitor webhook logs for issues

---

## Support

If you have issues:

1. **Check docs/** - Complete guides available
2. **Browser console** - Error messages are logged
3. **Supabase dashboard** - Check Activity/Logs
4. **Database status** - Query tables directly in SQL Editor

---

## After Migration

### You Can Now:
- ✅ Access data from any device
- ✅ Share configurations (foundation for teams)
- ✅ Track submission history
- ✅ Debug webhook issues
- ✅ Export all data
- ✅ Schedule submissions (ready)
- ✅ Add team members (ready)

### Next Steps:
1. Verify all features work
2. Clean up old localStorage data
3. Review webhook submissions
4. Consider advanced features
5. Set up monitoring

---

**Migration Difficulty**: ⭐⭐ (Easy)
**Time to Complete**: 30 minutes
**Data Loss Risk**: ⭐ (None if careful)

**Last Updated**: November 2024
