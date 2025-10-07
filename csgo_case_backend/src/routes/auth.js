import express from 'express';
import passport from 'passport';
import { Strategy as SteamStrategy } from 'passport-steam';
import { buildConfig } from '../config.js';
import { ensureDemoUser, findOrCreateSteamUser, getSessionPayload } from '../services/authService.js';

const router = express.Router();
const cfg = buildConfig();

// Configure Passport only if Steam API key present
if (cfg.STEAM_API_KEY) {
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((obj, done) => done(null, obj));

  passport.use(
    new SteamStrategy(
      {
        returnURL: cfg.STEAM_RETURN_TO || `${cfg.APP_BASE_URL}/auth/steam/return`,
        realm: cfg.STEAM_REALM || cfg.APP_BASE_URL,
        apiKey: cfg.STEAM_API_KEY,
      },
      async (identifier, profile, done) => {
        try {
          const steamId = (profile && profile.id) || identifier?.split('/').pop();
          const username = profile?.displayName || 'steam-user';
          const user = await findOrCreateSteamUser({ steamId, username });
          return done(null, { id: user.id, steamId: user.steamId, username: user.username });
        } catch (e) {
          return done(e);
        }
      }
    )
  );

  router.use(passport.initialize());
  router.use(passport.session && passport.session()); // harmless if not using express-session

  // PUBLIC_INTERFACE
  router.get('/steam/login', passport.authenticate('steam'), (_req, _res) => {
    /** Initiates Steam OpenID login */
  });

  // PUBLIC_INTERFACE
  router.get(
    '/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    async (req, res) => {
      /** Handles Steam OpenID return; set minimal cookie session for frontend consumption. */
      const user = req.user;
      if (user) {
        req.session.user = { id: user.id, username: user.username, steamId: user.steamId };
      }
      res.redirect(cfg.FRONTEND_ORIGIN);
    }
  );
}

// PUBLIC_INTERFACE
router.get('/dev-login', async (req, res) => {
  /** Development-only login: creates demo session if Steam is not configured. */
  if (cfg.STEAM_API_KEY) {
    return res.status(400).json({ error: 'Dev login disabled when Steam is configured' });
  }
  const user = await ensureDemoUser();
  req.session.user = { id: user.id, username: user.username, steamId: user.steamId || null };
  res.json(getSessionPayload(user));
});

// PUBLIC_INTERFACE
router.get('/session', async (req, res) => {
  /** Returns current session user and balance for frontend Redux. */
  const sessUser = req.session?.user;
  if (!sessUser) return res.json({ user: null, balance: 0 });
  // fetch user to get latest balance
  const { getPrisma } = await import('../db/index.js');
  const prisma = getPrisma();
  const dbUser = await prisma.user.findUnique({ where: { id: Number(sessUser.id) } });
  return res.json(getSessionPayload(dbUser));
});

// PUBLIC_INTERFACE
router.post('/logout', (req, res) => {
  /** Clears session cookie and returns ok */
  req.session = null;
  res.json({ ok: true });
});

// PUBLIC_INTERFACE
router.get('/logout', (req, res) => {
  /** Convenience GET logout for anchor links */
  req.session = null;
  res.redirect(cfg.FRONTEND_ORIGIN);
});

export default router;
