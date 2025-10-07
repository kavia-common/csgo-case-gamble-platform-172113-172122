import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

/**
 * PUBLIC_INTERFACE
 * getPrisma
 * Returns a singleton PrismaClient for database access.
 */
let prisma;

/**
 * PUBLIC_INTERFACE
 */
export function getPrisma() {
  /** Return a shared PrismaClient instance to interact with the database. */
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

/**
 * PUBLIC_INTERFACE
 */
export async function healthCheck() {
  /** Simple health check that pings the DB. Returns true if OK, false otherwise. */
  try {
    const client = getPrisma();
    await client.$queryRaw`SELECT 1`;
    return true;
  } catch (e) {
    return false;
  }
}

export default getPrisma;
