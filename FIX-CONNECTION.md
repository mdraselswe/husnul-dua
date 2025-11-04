# Connection Error Fix - Can't reach database server

## সমস্যা

Error: `Can't reach database server at db.awwlhtredgrrmandaxbz.supabase.co:6543`

## সমাধান

### Step 1: Connection String Format Check করুন

আপনার connection string এ এই format থাকতে হবে:

```
postgresql://postgres.awwlhtredgrrmandaxbz:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

**গুরুত্বপূর্ণ:**
- ✅ `postgres.awwlhtredgrrmandaxbz` - আপনার project reference
- ✅ `YOUR_PASSWORD` - আপনার database password
- ✅ `aws-0-ap-southeast-1.pooler.supabase.com` - Pooler hostname
- ✅ Port `6543` - Pooling port
- ✅ `?pgbouncer=true&sslmode=require` - Required parameters

### Step 2: Connection String এর Format

Supabase Dashboard থেকে নেওয়া connection string এ সাধারণত password থাকে না। আপনি নিজে যোগ করতে হবে:

**Supabase Dashboard এ দেখবেন:**
```
postgresql://postgres.awwlhtredgrrmandaxbz:[YOUR-PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**আপনাকে করতে হবে:**
`[YOUR-PASSWORD]` এর জায়গায় আপনার actual password দিন।

### Step 3: .env File Check করুন

`.env` file এ connection string এ password আছে কিনা verify করুন:

```bash
# .env file এ
DATABASE_URL="postgresql://postgres.awwlhtredgrrmandaxbz:YOUR_ACTUAL_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
```

### Step 4: Password Special Characters

Password এ special characters (`@`, `#`, `$`, etc.) থাকলে URL encode করতে হবে:

**URL Encoding:**
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- ` ` (space) → `%20` বা `+`

**Example:**
```
Password: My@Pass#123
Encoded: My%40Pass%23123
```

### Step 5: Connection Test করুন

```bash
# Connection string set করুন
export DATABASE_URL="postgresql://postgres.awwlhtredgrrmandaxbz:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

# Test করুন
npx prisma db push
```

## Alternative: Direct Connection (Port 5432)

যদি pooling connection কাজ না করে, direct connection চেষ্টা করুন:

```
postgresql://postgres.awwlhtredgrrmandaxbz:YOUR_PASSWORD@db.awwlhtredgrrmandaxbz.supabase.co:5432/postgres?sslmode=require
```

**Note:** Direct connection এ port `5432` এবং hostname `db.awwlhtredgrrmandaxbz.supabase.co`

## Quick Fix Command

```bash
# 1. .env file edit করুন
# nano .env বা code editor এ খুলুন

# 2. DATABASE_URL check করুন, format হবে:
DATABASE_URL="postgresql://postgres.awwlhtredgrrmandaxbz:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

# 3. Password verify করুন
# 4. Test করুন
npx prisma db push
```

## Common Issues

### Issue 1: Password Missing
**Error:** Connection string এ password নেই
**Solution:** Connection string এ `:YOUR_PASSWORD@` যোগ করুন

### Issue 2: Wrong Hostname
**Error:** `db.awwlhtredgrrmandaxbz.supabase.co` ব্যবহার করছেন
**Solution:** Pooling connection এ `aws-0-ap-southeast-1.pooler.supabase.com` ব্যবহার করুন

### Issue 3: SSL Mode Missing
**Error:** SSL connection error
**Solution:** Connection string এ `&sslmode=require` যোগ করুন

### Issue 4: Password Special Characters
**Error:** Password parsing error
**Solution:** Special characters URL encode করুন

## Verification

Connection string ঠিক আছে কিনা verify করুন:

```bash
# Connection string print করুন (password hidden)
echo $DATABASE_URL | sed 's/:[^@]*@/:****@/'

# Test connection
npx prisma db execute --stdin <<< "SELECT 1;"
```

## Still Not Working?

1. **Supabase Dashboard Check করুন:**
   - Database → Settings → Connection string
   - **Connection pooling** tab → **URI** format
   - Copy করুন এবং password যোগ করুন

2. **Supabase Project Status Check করুন:**
   - Project paused হয়ে গেছে কিনা
   - Settings → General → Restore project

3. **Region Check করুন:**
   - আপনার project এর region verify করুন
   - Connection string এ correct region ব্যবহার করুন (ap-southeast-1, etc.)


