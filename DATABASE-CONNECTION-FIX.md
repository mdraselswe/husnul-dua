# Database Connection Fix - Can't reach database server

## সমস্যা

```
Error: P1001: Can't reach database server at db.awwlhtredgrrmandaxbz.supabase.co:5432
```

## Possible Causes:

1. **Supabase Database Paused** - সবচেয়ে common issue
2. **Wrong Connection String** - Password বা hostname ভুল
3. **Network/Firewall** - Connection blocked
4. **Database Server Down** - Temporary issue

## Step-by-Step Fix

### Step 1: Supabase Dashboard Check করুন

1. **Supabase Dashboard খুলুন:**
   - [app.supabase.com](https://app.supabase.com)
   - Login করুন
   - আপনার project (`awwlhtredgrrmandaxbz`) select করুন

2. **Project Status Check:**
   - Settings → General → **Project Status**
   - যদি **"Paused"** দেখায় → **"Restore"** button click করুন
   - Database restore হতে 1-2 minute লাগবে

3. **Database Active Verify:**
   - Dashboard এ green status দেখতে পাবেন
   - **Table Editor** এ যান, database accessible আছে কিনা check করুন

### Step 2: Connection String Verify করুন

Supabase Dashboard থেকে fresh connection string নিন:

1. **Settings → Database → Connection string**
2. **Connection pooling** tab → **URI** format
3. Connection string copy করুন
4. Password (`Software@141`) URL encode করে যোগ করুন (`Software%40141`)

**Correct Format:**
```
postgresql://postgres:Software%40141@db.awwlhtredgrrmandaxbz.supabase.co:5432/postgres?sslmode=require
```

### Step 3: Alternative - Pooling Connection ব্যবহার করুন

Direct connection কাজ না করলে pooling connection try করুন:

```
postgresql://postgres.awwlhtredgrrmandaxbz:Software%40141@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

### Step 4: Test Connection

```bash
# Connection string set করুন
export DATABASE_URL="postgresql://postgres:Software%40141@db.awwlhtredgrrmandaxbz.supabase.co:5432/postgres?sslmode=require"

# Test connection
npx prisma db push
```

## Alternative Solutions

### Option 1: Vercel Postgres ব্যবহার করুন (Easier)

Vercel এ built-in PostgreSQL আছে:

1. **Vercel Dashboard** → Your Project → **Storage**
2. **Create Database** → **Postgres**
3. Automatically `DATABASE_URL` environment variable set হবে
4. Schema push করুন:
   ```bash
   # Vercel environment variables pull করুন
   vercel env pull .env.production
   
   # Database push করুন
   export DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2 | tr -d '"')
   npx prisma db push
   ```

### Option 2: Railway (Free Tier)

1. [railway.app](https://railway.app) → Sign up
2. New Project → **Provision PostgreSQL**
3. Database → **Connect** → Copy connection string
4. Environment variable set করুন

### Option 3: Neon (Free Tier)

1. [neon.tech](https://neon.tech) → Sign up
2. Create Project → Copy connection string
3. Environment variable set করুন

## Temporary Solution: Local Development Continue করুন

Production deploy করার আগে local development continue করুন:

```bash
# .env file (local)
DATABASE_URL="file:./prisma/dev.db"

# Schema SQLite এ change করুন
# prisma/schema.prisma:
# provider = "postgresql" → provider = "sqlite"
```

Production deploy করার সময়:
1. Schema PostgreSQL এ change করুন
2. Vercel environment variable set করুন
3. Database push করুন

## Quick Checklist

- [ ] Supabase Dashboard → Project Status → Active আছে?
- [ ] Connection string এ password correct আছে?
- [ ] Password URL encoded (`@` → `%40`)?
- [ ] Network/Firewall blocking করছে না?
- [ ] Alternative database provider try করেছেন?

## Still Not Working?

1. **Supabase Support:**
   - Dashboard → Help → Support
   - বা Discord community

2. **Vercel Postgres Use করুন:**
   - Easier setup
   - Automatic environment variable
   - No external service needed

