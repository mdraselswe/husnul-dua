# Vercel Deployment Error Fix

## সমস্যা: Production এ 500 Error

```
GET https://husnul-dua.vercel.app/api/duas/tags 500 (Internal Server Error)
```

## দ্রুত সমাধান

### Step 1: Vercel এ Environment Variable Set করুন

1. **Vercel Dashboard এ যান:**
   - [vercel.com](https://vercel.com) → আপনার project
   - **Settings** → **Environment Variables**

2. **DATABASE_URL যোগ করুন:**
   - **Key**: `DATABASE_URL`
   - **Value**: আপনার Supabase PostgreSQL connection string
   ```
   postgresql://postgres:Software%40141@db.awwlhtredgrrmandaxbz.supabase.co:5432/postgres?sslmode=require
   ```
   - **Environments**: Production, Preview, Development সব select করুন
   - **Save** click করুন

3. **Redeploy করুন:**
   - **Deployments** tab → Latest deployment → **...** menu → **Redeploy**

### Step 2: Schema PostgreSQL এ Change করুন

**Production এর জন্য schema PostgreSQL এ change করতে হবে:**

```bash
# 1. Schema file edit করুন
# prisma/schema.prisma file এ:
# provider = "sqlite" → provider = "postgresql"
```

**অথবা:**

```bash
# Schema file backup করুন
cp prisma/schema.prisma prisma/schema.sqlite.backup

# PostgreSQL schema restore করুন (আমি এখন করব)
```

### Step 3: Database Schema Push করুন

```bash
# Production database URL set করুন
export DATABASE_URL="postgresql://postgres:Software%40141@db.awwlhtredgrrmandaxbz.supabase.co:5432/postgres?sslmode=require"

# Schema push করুন
npx prisma db push

# Seed data (optional)
npm run seed
```

### Step 4: Code Push এবং Redeploy

```bash
# Schema change commit করুন
git add prisma/schema.prisma
git commit -m "Switch to PostgreSQL for production"
git push

# Vercel automatically redeploy করবে
```

## Important Checklist

- [ ] Vercel Dashboard → Settings → Environment Variables → `DATABASE_URL` set আছে
- [ ] `prisma/schema.prisma` → `provider = "postgresql"`
- [ ] Supabase database active আছে (paused না)
- [ ] Database schema pushed হয়েছে (`npx prisma db push`)
- [ ] Code pushed হয়েছে GitHub এ
- [ ] Vercel redeployed হয়েছে

## Vercel Logs Check করুন

1. Vercel Dashboard → Your Project
2. **Deployments** → Latest deployment
3. **Functions** tab → Error logs দেখুন
4. Error message check করুন

## Alternative: Vercel Postgres ব্যবহার করুন

যদি Supabase connection কাজ না করে:

1. Vercel Dashboard → Your Project → **Storage**
2. **Create Database** → **Postgres**
3. Automatically `DATABASE_URL` set হবে
4. Schema push করুন:
   ```bash
   # Vercel environment variables pull করুন
   vercel env pull .env.production
   
   # Database push করুন
   npx prisma db push
   ```

## Still Not Working?

1. **Vercel Functions Logs Check:**
   - Deployments → Latest → Functions → Logs
   - Error message দেখুন

2. **Database Connection Test:**
   ```bash
   # Local এ test করুন
   export DATABASE_URL="your-production-connection-string"
   npx prisma db push
   ```

3. **Supabase Status:**
   - Dashboard → Settings → General
   - Project active আছে?

