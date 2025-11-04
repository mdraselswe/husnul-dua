# Production Setup Guide - বিস্তারিত নির্দেশনা

## Step 1: Supabase Database তৈরি করা

### 1.1 Supabase Account তৈরি করুন
1. [supabase.com](https://supabase.com) এ যান
2. "Start your project" বা "Sign Up" এ click করুন
3. GitHub/GitLab/Email দিয়ে account তৈরি করুন (Free tier)

### 1.2 New Project তৈরি করুন
1. Dashboard এ "New Project" button click করুন
2. **Organization**: আপনার organization select করুন (বা নতুন তৈরি করুন)
3. **Name**: Project name দিন (যেমন: `husnul-dua`)
4. **Database Password**: একটি strong password দিন (নোট করুন, পরে লাগবে!)
5. **Region**: সবচেয়ে কাছের region select করুন (যেমন: Southeast Asia)
6. **Pricing Plan**: Free plan select করুন
7. "Create new project" click করুন

### 1.3 Database Connection String পাওয়া

**📸 Screenshot Guide:**
1. Project তৈরি হতে 2-3 minute লাগবে
2. Project ready হলে, left sidebar এ **Settings** (⚙️) icon click করুন
3. **Project Settings** → **Database** section এ যান
4. Scroll down করুন **Connection string** section পর্যন্ত
5. **Connection pooling** tab select করুন (Default: Transaction mode)
6. **URI** format select করুন
7. Connection string copy করুন

**Connection String Format:**
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**⚠️ গুরুত্বপূর্ণ:**
- `[YOUR-PASSWORD]` এর জায়গায় আপনার database password দিন যা project তৈরি করার সময় দিয়েছিলেন
- **Password ভুলে গেছেন?** → [SUPABASE-PASSWORD-RESET.md](./SUPABASE-PASSWORD-RESET.md) দেখুন

**🔍 Connection String খুঁজে পাচ্ছেন না?**
- Settings → Database → Connection string section
- **Connection pooling** tab এ যান (URI format)
- **Direct connection** tab এও দেখতে পারেন (port 5432)
- Project creation সময় যে password দিয়েছিলেন, সেটি connection string এ `[YOUR-PASSWORD]` এর জায়গায় replace করুন

## Step 2: Local এ Test করা

### 2.1 Environment Variable Set করা
```bash
# Terminal এ project folder এ যান
cd /Users/shikho/Desktop/Personal/husnul-dua

# PostgreSQL connection string set করুন
export DATABASE_URL="postgresql://postgres.xxxxx:YOUR-PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

### 2.2 Database Schema Push করা
```bash
# Prisma client generate করুন
npx prisma generate

# Database schema push করুন
npx prisma db push
```

**Expected Output:**
```
✔ Generated Prisma Client
✔ Pushed database schema successfully
```

### 2.3 Test Data যোগ করা (Optional)
```bash
# Seed data যোগ করুন
npm run seed
```

### 2.4 Local এ Test করা
```bash
# Dev server চালু করুন
npm run dev
```

Browser এ `http://localhost:3000` এ যান এবং:
1. Homepage load হচ্ছে কিনা check করুন
2. "নতুন দুআ যোগ করুন" click করে একটি দুআ যোগ করুন
3. Save করার পর list এ দেখাচ্ছে কিনা check করুন

**✅ যদি local এ কাজ করে, তাহলে setup ঠিক আছে!**

## Step 3: Vercel এ Deploy করা

### 3.1 GitHub Repository Push করা
```bash
# Git status check করুন
git status

# সব changes add করুন
git add .

# Commit করুন
git commit -m "Ready for production deployment"

# GitHub এ push করুন
git push origin main
```

### 3.2 Vercel Project তৈরি করা
1. [vercel.com](https://vercel.com) এ যান
2. GitHub account দিয়ে login করুন
3. "Add New..." → "Project" click করুন
4. আপনার GitHub repository select করুন (`husnul-dua`)
5. "Import" click করুন

### 3.3 Environment Variable Set করা
Vercel project settings এ:
1. **Environment Variables** section এ যান
2. **Key**: `DATABASE_URL`
3. **Value**: আপনার Supabase PostgreSQL connection string (Step 1.3 থেকে)
4. **Environments**: Production, Preview, Development সব select করুন
5. **Save** click করুন

**Connection String Format:**
```
postgresql://postgres.xxxxx:YOUR-PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

### 3.4 Build Settings Check করা
Vercel automatically detect করবে, কিন্তু verify করুন:
- **Framework Preset**: Next.js
- **Build Command**: `prisma generate && next build --webpack` (auto detect হবে)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

### 3.5 Deploy করা
1. "Deploy" button click করুন
2. Build process চলবে (2-3 minute লাগতে পারে)
3. Build complete হলে "Visit" button click করুন

## Step 4: Post-Deployment Database Setup

### 4.1 Vercel Deployment URL পাওয়ার পর
```bash
# Vercel CLI install করুন (optional)
npm i -g vercel

# Login করুন
vercel login

# Link your project
vercel link

# Environment variable set করুন
vercel env add DATABASE_URL
# (paste your connection string when prompted)
```

### 4.2 Database Schema Push করা
```bash
# Production database URL set করুন
export DATABASE_URL="your-production-postgresql-connection-string"

# Schema push করুন
npx prisma db push

# Seed data (optional)
npm run seed
```

**Alternative - Vercel CLI দিয়ে:**
```bash
# Vercel environment variables pull করুন
vercel env pull .env.production

# Use production database
export DATABASE_URL=$(grep DATABASE_URL .env.production | cut -d '=' -f2)

# Push schema
npx prisma db push
```

## Step 5: Verification (Setup ঠিক আছে কিনা Check করা)

### 5.1 Database Connection Check
Supabase Dashboard এ:
1. **Table Editor** এ যান
2. `Dua` table দেখতে পাচ্ছেন কিনা check করুন
3. Table structure verify করুন

### 5.2 Application Test
Deployed site এ:
1. Homepage load হচ্ছে কিনা
2. Search functionality কাজ করছে কিনা
3. নতুন দুআ যোগ করা যাচ্ছে কিনা
4. Error console check করুন (F12 → Console)

### 5.3 API Test
Browser console এ:
```javascript
// Test API
fetch('/api/duas')
  .then(res => res.json())
  .then(data => console.log('API Working:', data))
  .catch(err => console.error('API Error:', err))
```

## Troubleshooting (সমস্যা সমাধান)

### ❌ Error: "Unable to open the database file"
**সমাধান:**
- ✅ `DATABASE_URL` environment variable set আছে কিনা check করুন
- ✅ Connection string ঠিক আছে কিনা verify করুন
- ✅ Supabase project active আছে কিনা check করুন

### ❌ Error: "P1001: Can't reach database server"
**সমাধান:**
- ✅ Connection string এ password ঠিক আছে কিনা check করুন
- ✅ Supabase database paused হয়ে গেছে কিনা check করুন (Dashboard → Settings → General → Restore)
- ✅ Connection string এ `?sslmode=require` যোগ করুন

### ❌ Error: "Table does not exist"
**সমাধান:**
```bash
# Database schema push করুন
export DATABASE_URL="your-connection-string"
npx prisma db push
```

### ❌ Build Error: "Prisma Client not generated"
**সমাধান:**
- ✅ `package.json` এ `postinstall` script আছে কিনা check করুন
- ✅ Build command এ `prisma generate` আছে কিনা verify করুন

### ❌ API 500 Error
**সমাধান:**
1. Vercel Dashboard → Deployments → Latest deployment → Functions logs check করুন
2. Error message দেখুন
3. Database connection string verify করুন

## Common Issues Checklist

- [ ] Supabase project active আছে
- [ ] Database password মনে আছে
- [ ] Connection string এ password replace করা হয়েছে
- [ ] `DATABASE_URL` environment variable Vercel এ set করা হয়েছে
- [ ] Database schema push করা হয়েছে (`npx prisma db push`)
- [ ] Prisma client generated হয়েছে (`npx prisma generate`)
- [ ] Local এ test করে কাজ করেছে

## Quick Verification Commands

```bash
# 1. Database connection test
npx prisma db push --skip-generate

# 2. Prisma client status
npx prisma generate --schema=./prisma/schema.prisma

# 3. Check database tables
npx prisma studio
# Browser এ open হবে, tables দেখতে পারবেন

# 4. Test API locally
curl http://localhost:3000/api/duas
```

## Quick Links

- **Password Reset Guide**: [SUPABASE-PASSWORD-RESET.md](./SUPABASE-PASSWORD-RESET.md)
- **Supabase Dashboard**: https://app.supabase.com
- **Supabase Docs**: https://supabase.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs

---

**💡 Tips:**
- সবসময় connection string backup রাখুন
- Database password safe place এ save করুন
- Production database এ direct changes করবেন না, Prisma migrations ব্যবহার করুন

