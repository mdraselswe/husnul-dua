# হুসনুল দুআ - ইসলামিক আমল ও দুআ

একটি Progressive Web App (PWA) যা ইসলামিক দুআ, আমল ও জিকির সংরক্ষণ এবং অনুসন্ধান করার জন্য তৈরি করা হয়েছে।

## বৈশিষ্ট্য

- ✅ **দ্রুত অনুসন্ধান**: দুআ, ট্যাগ বা বিষয়বস্তু দিয়ে দ্রুত খুঁজে পাবেন
- ✅ **মাল্টি-পারপাস ট্যাগ**: একই দুআ অনেকগুলো কাজে ব্যবহার করা যাবে (যেমন: মাথা ব্যথা, শরীর ব্যথা, যেকোন ব্যথা)
- ✅ **সম্পূর্ণ বাংলা, আরবি ও উচ্চারণ**: স্পষ্ট ফন্টে সবকিছু প্রদর্শিত হবে
- ✅ **PWA সমর্থন**: মোবাইল এবং ডেস্কটপে ইনস্টল করা যাবে
- ✅ **ডাটাবেস**: সব দুআ SQLite ডাটাবেসে সংরক্ষিত
- ✅ **সহজ যোগ**: নতুন দুআ খুব সহজেই যোগ করা যাবে

## ইনস্টলেশন

1. Dependencies ইনস্টল করুন:
```bash
npm install
```

2. ডাটাবেস তৈরি করুন:
```bash
npx prisma db push
```

3. (ঐচ্ছিক) Sample data যোগ করুন:
```bash
npm run seed
```

4. Development server চালু করুন:
```bash
npm run dev
```

5. ব্রাউজারে খুলুন [http://localhost:3000](http://localhost:3000)

## প্রোডাকশনে ডিপ্লয়

**⚠️ গুরুত্বপূর্ণ:** Production-এ PostgreSQL database প্রয়োজন। SQLite deployment platforms (Vercel, Netlify) এ কাজ করে না।

### Quick Setup (Supabase - Free):

1. **Supabase Project তৈরি করুন:**
   - [supabase.com](https://supabase.com) এ যান
   - Free account তৈরি করুন
   - নতুন project তৈরি করুন
   - Settings → Database → Connection string copy করুন

2. **Environment Variable সেট করুন:**
   - Vercel/Netlify dashboard → Settings → Environment Variables
   - `DATABASE_URL` = আপনার PostgreSQL connection string
   - Format: `postgresql://user:password@host:port/database?sslmode=require`

3. **Database Setup:**
   ```bash
   # Production database URL set করুন
   export DATABASE_URL="your-postgresql-connection-string"
   
   # Schema push করুন
   npx prisma db push
   
   # Seed data (optional)
   npm run seed
   ```

4. **Deploy করুন:**
   ```bash
   npm run build
   npm start
   ```

**বিস্তারিত deployment guide:** [DEPLOYMENT.md](./DEPLOYMENT.md) দেখুন

## ডাটাবেস

### Local Development (SQLite)
Local development-এ SQLite ব্যবহার করা হয় (`prisma/dev.db`)।

### Production (PostgreSQL)
Production-এ PostgreSQL database প্রয়োজন। Supabase, Vercel Postgres, Railway, বা অন্য কোনো PostgreSQL provider ব্যবহার করুন।

Prisma Studio দিয়ে ডাটাবেস দেখতে পারেন:

```bash
npx prisma studio
```

## কীভাবে ব্যবহার করবেন

1. **দুআ খুঁজুন**: হোমপেজে সার্চ বার ব্যবহার করে দুআ খুঁজুন
2. **ট্যাগ দিয়ে ফিল্টার করুন**: উপরের ট্যাগ বোতামগুলো ব্যবহার করুন
3. **নতুন দুআ যোগ করুন**: "নতুন দুআ যোগ করুন" বোতামে ক্লিক করুন

## ট্যাগ সিস্টেম

ট্যাগ সিস্টেমের মাধ্যমে একই দুআ অনেক কাজে ব্যবহার করা যায়:
- উদাহরণ: "মাথা ব্যথা, শরীর ব্যথা, যেকোন ব্যথা" - এই তিনটি ট্যাগ দিয়ে একই দুআ খুঁজে পাওয়া যাবে
- আবার শুধু "মাথা ব্যথা" দিয়েও স্পেসিফিক দুআ খুঁজে পাওয়া যাবে

## প্রযুক্তি

- **Next.js 16** - Latest version with App Router
- **TypeScript** - Type safety
- **Prisma** - Database ORM
- **SQLite** - Database
- **Tailwind CSS** - Styling
- **next-pwa** - PWA support
- **Noto Sans Bengali** - Bengali font
- **Noto Sans Arabic** - Arabic font

## লাইসেন্স

এই প্রজেক্টটি মুক্তভাবে ব্যবহার করা যাবে।

---

**আল্লাহ আমাদের সবাইকে সঠিক আমল করার তৌফিক দিন। আমীন।**