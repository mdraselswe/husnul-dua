#!/bin/bash

# Production setup script
# This script switches the Prisma schema from SQLite to PostgreSQL

echo "🔄 Switching to PostgreSQL for production..."

# Backup current schema
cp prisma/schema.prisma prisma/schema.sqlite.backup

# Update schema to use PostgreSQL
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma

echo "✅ Schema updated to PostgreSQL"
echo "📦 Regenerating Prisma client..."
npx prisma generate

echo "✅ Done! Your schema is now configured for PostgreSQL"
echo ""
echo "⚠️  Make sure to set DATABASE_URL environment variable:"
echo "   export DATABASE_URL='your-postgresql-connection-string'"
echo ""
echo "Then run: npx prisma db push"

