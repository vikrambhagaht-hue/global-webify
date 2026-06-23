import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Automatically increase connection limit for Vercel/Serverless environments
let dbUrl = process.env.DATABASE_URL || '';
if (dbUrl && !dbUrl.includes('connection_limit')) {
  // Set to 1 to prevent 'max_user_connections' error on Hostinger during Next.js static build
  const limit = process.env.DB_CONNECTION_LIMIT || '1';
  dbUrl += dbUrl.includes('?') ? `&connection_limit=${limit}&pool_timeout=60` : `?connection_limit=${limit}&pool_timeout=60`;
  process.env.DATABASE_URL = dbUrl;
}

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: dbUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;
