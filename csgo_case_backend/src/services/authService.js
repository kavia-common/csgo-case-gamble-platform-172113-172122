import { getPrisma } from '../db/index.js';

/**
 * PUBLIC_INTERFACE
 * ensureDemoUser
 * Creates or loads a demo user and returns user profile.
 */
export async function ensureDemoUser() {
  /** Upserts demo user with a starting balance if missing. */
  const prisma = getPrisma();
  const user = await prisma.user.upsert({
    where: { username: 'demo' },
    update: {},
    create: {
      username: 'demo',
      steamId: null,
      balance: '250.00',
    },
  });
  return user;
}

/**
 * PUBLIC_INTERFACE
 * findOrCreateSteamUser
 * Find or create a user by Steam profile. Minimal stub for now.
 */
export async function findOrCreateSteamUser({ steamId, username }) {
  /** Upsert a user based on steamId with optional username fallback. */
  const prisma = getPrisma();
  if (!steamId) throw new Error('Missing steamId');
  const user = await prisma.user.upsert({
    where: { steamId },
    update: { username: username || 'steam-user' },
    create: {
      steamId,
      username: username || 'steam-user',
      balance: '250.00',
    },
  });
  return user;
}

/**
 * PUBLIC_INTERFACE
 * getSessionPayload
 * Transforms DB user into session-friendly payload object for frontend.
 */
export function getSessionPayload(user) {
  /** Returns safe session payload */
  if (!user) return { user: null, balance: 0 };
  return {
    user: {
      id: user.id,
      username: user.username,
      steamId: user.steamId || null,
    },
    balance: Number(user.balance),
  };
}
