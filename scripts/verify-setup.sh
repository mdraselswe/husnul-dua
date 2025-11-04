#!/bin/bash

# Setup Verification Script
# এই script চালিয়ে setup ঠিক আছে কিনা check করুন

echo "🔍 Checking Production Setup..."
echo ""

# Check 1: DATABASE_URL environment variable
echo "1️⃣  Checking DATABASE_URL..."
if [ -z "$DATABASE_URL" ]; then
    echo "   ❌ DATABASE_URL not set"
    echo "   💡 Run: export DATABASE_URL='your-postgresql-connection-string'"
else
    if [[ $DATABASE_URL == postgresql* ]]; then
        echo "   ✅ DATABASE_URL is set (PostgreSQL)"
        echo "   📝 URL: ${DATABASE_URL:0:50}..."
    else
        echo "   ⚠️  DATABASE_URL is set but doesn't look like PostgreSQL"
        echo "   📝 URL: ${DATABASE_URL:0:50}..."
    fi
fi
echo ""

# Check 2: Prisma schema
echo "2️⃣  Checking Prisma schema..."
if grep -q "provider = \"postgresql\"" prisma/schema.prisma 2>/dev/null; then
    echo "   ✅ Schema is configured for PostgreSQL"
elif grep -q "provider = \"sqlite\"" prisma/schema.prisma 2>/dev/null; then
    echo "   ⚠️  Schema is configured for SQLite (should be PostgreSQL for production)"
    echo "   💡 Update prisma/schema.prisma: provider = \"postgresql\""
else
    echo "   ❌ Could not determine database provider"
fi
echo ""

# Check 3: Prisma client
echo "3️⃣  Checking Prisma client..."
if [ -d "lib/prisma" ]; then
    echo "   ✅ Prisma client exists"
else
    echo "   ❌ Prisma client not found"
    echo "   💡 Run: npx prisma generate"
fi
echo ""

# Check 4: Database connection test
echo "4️⃣  Testing database connection..."
if [ ! -z "$DATABASE_URL" ]; then
    if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
        echo "   ✅ Database connection successful"
    else
        echo "   ❌ Database connection failed"
        echo "   💡 Check your DATABASE_URL and ensure database is accessible"
    fi
else
    echo "   ⏭️  Skipped (DATABASE_URL not set)"
fi
echo ""

# Check 5: Database tables
echo "5️⃣  Checking database tables..."
if [ ! -z "$DATABASE_URL" ]; then
    if npx prisma db execute --stdin <<< "SELECT name FROM sqlite_master WHERE type='table' AND name='Dua';" > /dev/null 2>&1 || \
       npx prisma db execute --stdin <<< "SELECT tablename FROM pg_tables WHERE tablename='Dua';" > /dev/null 2>&1; then
        echo "   ✅ Dua table exists"
    else
        echo "   ⚠️  Dua table not found"
        echo "   💡 Run: npx prisma db push"
    fi
else
    echo "   ⏭️  Skipped (DATABASE_URL not set)"
fi
echo ""

# Check 6: Package.json scripts
echo "6️⃣  Checking package.json scripts..."
if grep -q "postinstall.*prisma generate" package.json 2>/dev/null; then
    echo "   ✅ postinstall script includes prisma generate"
else
    echo "   ⚠️  postinstall script might be missing"
fi

if grep -q "build.*prisma generate" package.json 2>/dev/null; then
    echo "   ✅ build script includes prisma generate"
else
    echo "   ⚠️  build script might be missing prisma generate"
fi
echo ""

# Check 7: Environment files
echo "7️⃣  Checking environment files..."
if [ -f ".env" ]; then
    echo "   ✅ .env file exists"
    if grep -q "DATABASE_URL" .env; then
        echo "   ✅ DATABASE_URL found in .env"
    else
        echo "   ⚠️  DATABASE_URL not found in .env"
    fi
else
    echo "   ⚠️  .env file not found (optional for production)"
fi
echo ""

echo "✅ Setup verification complete!"
echo ""
echo "📚 For detailed setup instructions, see: PRODUCTION-SETUP.md"


