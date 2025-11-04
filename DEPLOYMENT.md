# Deployment Guide - হুসনুল দুআ

## ⚠️ গুরুত্বপূর্ণ

**বিস্তারিত step-by-step guide:** [PRODUCTION-SETUP.md](./PRODUCTION-SETUP.md) দেখুন

## Production Deployment

এই app production-এ deploy করার জন্য PostgreSQL database প্রয়োজন। SQLite production environment-এ কাজ করে না কারণ file system read-only থাকে।

## Option 1: Supabase (Recommended - Free)

1. **Supabase Project তৈরি করুন:**
   - [supabase.com](https://supabase.com) এ যান
   - নতুন project তৈরি করুন
   - Database → Settings → Connection string copy করুন

2. **Environment Variable সেট করুন:**
   - Vercel/Netlify dashboard এ যান
   - Settings → Environment Variables
   - `DATABASE_URL` key এ PostgreSQL connection string paste করুন
   - Format: `postgresql://user:password@host:port/database?sslmode=require`

3. **Database Migrate করুন:**
   ```bash
   # Production database URL set করুন
   export DATABASE_URL="your-postgresql-connection-string"
   
   # Database schema push করুন
   npx prisma db push
   
   # (Optional) Seed data যোগ করুন
   npm run seed
   ```

## Option 2: Vercel Postgres

1. Vercel dashboard এ যান
2. Project → Storage → Create Database → Postgres
3. Automatically `DATABASE_URL` environment variable set হবে
4. Deploy করুন

## Option 3: Railway, Neon, PlanetScale

কোনো PostgreSQL provider ব্যবহার করতে পারেন:
- [Railway](https://railway.app) - Free tier available
- [Neon](https://neon.tech) - Free tier available
- [PlanetScale](https://planetscale.com) - MySQL compatible

## Deployment Steps (Vercel)

1. **GitHub repository push করুন:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Vercel এ deploy করুন:**
   - [vercel.com](https://vercel.com) এ যান
   - GitHub repository import করুন
   - Environment Variables যোগ করুন:
     - `DATABASE_URL` - Your PostgreSQL connection string
   - Deploy করুন

3. **Post-deployment:**
   ```bash
   # Vercel CLI install করুন (optional)
   npm i -g vercel
   
   # Database migrate করুন
   DATABASE_URL="your-postgresql-url" npx prisma db push
   
   # Seed data (optional)
   DATABASE_URL="your-postgresql-url" npm run seed
   ```

## Local Development (SQLite)

Local development-এ SQLite ব্যবহার করতে:

1. `prisma/schema.sqlite.prisma` file টি copy করুন:
   ```bash
   cp prisma/schema.sqlite.prisma prisma/schema.prisma
   ```

2. `.env` file এ:
   ```
   DATABASE_URL="file:./prisma/dev.db"
   ```

3. Prisma client regenerate করুন:
   ```bash
   npx prisma generate
   ```

## Environment Variables

### Production (Required)
- `DATABASE_URL` - PostgreSQL connection string

### Development (Optional)
- `DATABASE_URL` - SQLite path (default: `file:./prisma/dev.db`)

## Troubleshooting

### Database Connection Error
- Check `DATABASE_URL` environment variable
- Ensure PostgreSQL connection string is correct
- Verify SSL mode if required (`?sslmode=require`)

### Migration Issues
- Run `npx prisma generate` after schema changes
- Use `npx prisma db push` for development
- Use `npx prisma migrate deploy` for production

### Build Errors
- Ensure `DATABASE_URL` is set in deployment platform
- Check Prisma client is generated: `npx prisma generate`
