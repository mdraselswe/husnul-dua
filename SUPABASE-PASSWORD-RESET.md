# Supabase Database Password Reset Guide

## Password ভুলে গেলে কী করবেন

### Method 1: Supabase Dashboard থেকে Reset (সবচেয়ে সহজ)

1. **Supabase Dashboard এ login করুন**
   - [app.supabase.com](https://app.supabase.com) এ যান
   - আপনার account দিয়ে login করুন

2. **Project Select করুন**
   - আপনার project (`husnul-dua` বা যে নাম দিয়েছিলেন) click করুন

3. **Settings এ যান**
   - Left sidebar এ **Settings** (⚙️) icon click করুন
   - **Project Settings** section এ যান

4. **Database Password Reset করুন**
   - **Database** section এ scroll down করুন
   - **Database Password** section খুঁজুন
   - **Reset Database Password** button click করুন
   - নতুন password দিন (নোট করুন!)
   - **Reset Password** confirm করুন

5. **Connection String আপডেট করুন**
   - Password reset করার পর, **Connection string** section এ যান
   - **Connection pooling** tab select করুন
   - **URI** format select করুন
   - Connection string এ নতুন password replace করুন
   - নতুন connection string copy করুন

### Method 2: Project Settings → General

1. **Settings → General** section এ যান
2. **Database** subsection এ যান
3. **Reset Database Password** button খুঁজুন
4. নতুন password set করুন

## Connection String আপডেট

Password reset করার পর:

1. **Local .env file update করুন:**
   ```bash
   # .env file এ
   DATABASE_URL="postgresql://postgres.xxxxx:NEW-PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
   ```

2. **Vercel Environment Variable update করুন:**
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - `DATABASE_URL` variable edit করুন
   - নতুন password দিয়ে connection string update করুন
   - **Save** click করুন
   - **Redeploy** করুন

## Password Format

Connection string format:
```
postgresql://postgres.PROJECT_REF:YOUR_PASSWORD@aws-0-REGION.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

**Example:**
```
postgresql://postgres.abcdefghijklmnop:MyNewPassword123!@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require
```

## ⚠️ গুরুত্বপূর্ণ

- Password reset করার পর **সব জায়গায়** update করতে হবে:
  - Local `.env` file
  - Vercel Environment Variables
  - কোনো deployment platform environment variables
- Password backup রাখুন safe place এ
- Strong password ব্যবহার করুন (minimum 8 characters, uppercase, lowercase, numbers)

## Troubleshooting

### Password reset button খুঁজে পাচ্ছেন না?

1. **Project Owner/Admin check করুন**
   - আপনি project owner/admin কিনা verify করুন
   - Owner না হলে, owner কে reset করতে বলুন

2. **Different Location Check করুন**
   - Settings → Database
   - Settings → General → Database section
   - Project Settings → Database

### Connection Error হচ্ছে?

1. **Password Correct কিনা Verify করুন**
   ```bash
   # Test connection
   export DATABASE_URL="your-connection-string-with-new-password"
   npx prisma db push --skip-generate
   ```

2. **Connection String Format Check করুন**
   - Password এ special characters থাকলে URL encode করতে হতে পারে
   - Example: `@` → `%40`, `#` → `%23`

### Password URL Encoding

Special characters URL encode করতে:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `%` → `%25`
- `&` → `%26`
- `+` → `%2B`
- `=` → `%3D`
- `?` → `%3F`
- ` ` (space) → `%20`

**Example:**
```
Password: My@Pass#123
Encoded: My%40Pass%23123
```

## Alternative: Supabase CLI ব্যবহার

Supabase CLI install করে password reset করতে পারেন:

```bash
# Supabase CLI install
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref your-project-ref

# Database password reset
supabase db reset
```

---

**💡 Tips:**
- Password safe password manager এ save করুন (LastPass, 1Password, etc.)
- Connection string একটি safe file এ backup রাখুন
- Production password কখনো share করবেন না


