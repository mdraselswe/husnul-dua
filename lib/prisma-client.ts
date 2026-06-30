import { PrismaClient } from './prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import path from 'path'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Ensure DATABASE_URL is set correctly
if (!process.env.DATABASE_URL) {
  const dbPath = path.join(process.cwd(), 'prisma', 'dev.db')
  process.env.DATABASE_URL = `file:${dbPath}`
} else if (process.env.DATABASE_URL.startsWith('file:./')) {
  // Convert relative path to absolute path for Next.js
  const relativePath = process.env.DATABASE_URL.replace('file:', '')
  const absolutePath = path.join(process.cwd(), relativePath)
  process.env.DATABASE_URL = `file:${absolutePath}`
}

// Use the pg driver adapter (queryCompiler) so no Rust query-engine binary is
// needed — required for Vercel serverless, where the engine binary is dropped.
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
