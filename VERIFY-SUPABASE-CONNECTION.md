# Supabase Connection String Verify - Step by Step

## ⚠️ Connection Error হচ্ছে? এই Steps Follow করুন:

### Step 1: Supabase Dashboard এ Connection String Verify করুন

1. **Supabase Dashboard খুলুন:**
   - [app.supabase.com](https://app.supabase.com) এ যান
   - Login করুন
   - আপনার project (`awwlhtredgrrmandaxbz`) select করুন

2. **Settings → Database এ যান:**
   - Left sidebar → Settings (⚙️)
   - Project Settings → Database

3. **Connection String Section:**
   - Scroll down করুন
   - **Connection string** section খুঁজুন
   - **Connection pooling** tab select করুন
   - **URI** format select করুন

4. **Connection String Copy করুন:**
   - সেখানে দেখবেন:
   ```
   postgresql://postgres.awwlhtredgrrmandaxbz:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

5. **Password Replace করুন:**
   - `[YOUR-PASSWORD]` এর জায়গায় আপনার password দিন
   - **Important:** Password এ `@` থাকলে `%40` এ convert করুন
   - Example: `Rasel@141` → `Rasel%40141`

### Step 2: Project Status Check করুন

**Database Paused হয়ে গেছে কিনা check করুন:**

1. Supabase Dashboard → Your Project
2. Left sidebar → Settings → General
3. **Project Status** দেখুন
4. যদি "Paused" থাকে → **Restore** button click করুন

### Step 3: Correct Connection String Format

**Option A: Pooling Connection (Recommended)**
```
postgresql://postgres.awwlhtredgrrmandaxbz:Rasel%40141@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

**Option B: Direct Connection (Alternative)**
```
postgresql://postgres:Rasel%40141@db.awwlhtredgrrmandaxbz.supabase.co:5432/postgres?sslmode=require
```

**Note:** 
- Pooling এ username: `postgres.awwlhtredgrrmandaxbz`
- Direct এ username: `postgres`
- Password এ `@` → `%40` encode করতে হবে

### Step 4: Region Check করুন

Supabase Dashboard এ:
1. Settings → General
2. **Region** দেখুন (যেমন: `Southeast Asia (Singapore)`)
3. Connection string এ correct region hostname ব্যবহার করুন:
   - `ap-southeast-1` for Southeast Asia
   - `us-east-1` for US East
   - etc.

### Step 5: Test Connection

```bash
# .env file এ connection string set করুন
# তারপর test করুন:

npx prisma db push
```

## Troubleshooting

### Error: "Can't reach database server"
**Possible Causes:**
1. ✅ Database paused → Restore করুন
2. ✅ Wrong hostname → Dashboard থেকে verify করুন
3. ✅ Wrong region → Correct region hostname ব্যবহার করুন
4. ✅ Password wrong → Password verify করুন
5. ✅ Network/Firewall → VPN off করুন

### Error: "Tenant or user not found"
**Possible Causes:**
1. ✅ Wrong username format → Pooling এ `postgres.awwlhtredgrrmandaxbz`, Direct এ `postgres`
2. ✅ Project reference wrong → Dashboard থেকে verify করুন

### Error: "Password authentication failed"
**Possible Causes:**
1. ✅ Password wrong → Reset করুন
2. ✅ Password encoding wrong → `@` → `%40` check করুন

## Quick Test Commands

```bash
# 1. Connection string test (password hidden)
echo $DATABASE_URL | sed 's/:[^@]*@/:****@/'

# 2. Prisma connection test
npx prisma db push

# 3. Direct SQL test (if psql installed)
psql "$DATABASE_URL" -c "SELECT 1;"
```

## Still Not Working?

1. **Supabase Support:**
   - Dashboard → Help → Support
   - বা Discord community

2. **Alternative:**
   - Vercel Postgres ব্যবহার করুন (Vercel dashboard থেকে)
   - বা Railway, Neon, PlanetScale try করুন


