# Quick Fix - Project Run করলে Error আসছে

## সমস্যা

Dev server run করলে database connection error আসছে:
```
Can't reach database server at db.awwlhtredgrrmandaxbz.supabase.co:5432
```

## দ্রুত সমাধান

### Step 1: Dev Server Restart করুন

**⚠️ গুরুত্বপূর্ণ:** `.env` file change করার পর dev server **restart করতে হবে!**

```bash
# 1. Dev server বন্ধ করুন (Ctrl+C)

# 2. আবার চালু করুন
npm run dev
```

### Step 2: .env File Verify করুন

`.env` file এ connection string ঠিক আছে কিনা check করুন:

```bash
cat .env
```

**Expected format:**
```
DATABASE_URL="postgresql://postgres:Rasel%40141@db.awwlhtredgrrmandaxbz.supabase.co:5432/postgres?sslmode=require"
```

### Step 3: Database Connection Test করুন

Terminal এ:
```bash
# Connection test
export DATABASE_URL="postgresql://postgres:Rasel%40141@db.awwlhtredgrrmandaxbz.supabase.co:5432/postgres?sslmode=require"
npx prisma db push
```

### Step 4: Supabase Project Status Check

1. [app.supabase.com](https://app.supabase.com) → আপনার project
2. Settings → General
3. **Project Status** → Active আছে কিনা
4. যদি Paused থাকে → **Restore** করুন

## Alternative: Local SQLite ব্যবহার করুন

যদি production database connection না হয়ে থাকে, temporary local SQLite ব্যবহার করুন:

```bash
# 1. Schema SQLite এ change করুন
cp prisma/schema.sqlite.prisma prisma/schema.prisma

# 2. .env file update করুন
echo 'DATABASE_URL="file:./prisma/dev.db"' > .env

# 3. Prisma regenerate করুন
npx prisma generate
npx prisma db push

# 4. Dev server restart করুন
npm run dev
```

## Still Not Working?

1. **Supabase Dashboard Check:**
   - Project active আছে?
   - Database password correct?
   - Connection string correct?

2. **Network Check:**
   - Internet connection আছে?
   - VPN/Firewall blocking?

3. **Prisma Client Regenerate:**
   ```bash
   npx prisma generate
   ```

