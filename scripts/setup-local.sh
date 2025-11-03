#!/bin/bash

# Local development setup script
# This script switches the Prisma schema from PostgreSQL to SQLite

echo "🔄 Switching to SQLite for local development..."

# Update schema to use SQLite
sed -i '' 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.prisma

echo "✅ Schema updated to SQLite"
echo "📦 Regenerating Prisma client..."
npx prisma generate

echo "✅ Done! Your schema is now configured for SQLite"
echo ""
echo "Make sure .env has:"
echo "   DATABASE_URL='file:./prisma/dev.db'"
echo ""
echo "Then run: npx prisma db push"

