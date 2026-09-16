import { PrismaClient } from '../../generated/prisma/index.js'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { attachDatabasePool } from '@vercel/functions'

const globalForPrisma = globalThis

const pool = globalForPrisma.pgPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 1,
})

attachDatabasePool(pool)

const adapter = new PrismaPg(pool)

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pgPool = pool
  globalForPrisma.prisma = prisma
}
