import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieSession from 'cookie-session';
import morgan from 'morgan';
import { getPrisma, healthCheck } from './db/index.js';
import { buildConfig } from './config.js';
import authRouter from './routes/auth.js';
import casesRouter from './routes/cases.js';
import inventoryRouter from './routes/inventory.js';

/**
 * Entry point server for csgo_case_backend.
 * Sets up CORS with credentials, cookie-based sessions, and registers REST routes.
 * Environment variables:
 * - PORT: server port
 * - FRONTEND_ORIGIN: CORS allowed origin
 * - SESSION_SECRET: cookie-session secret
 * - APP_BASE_URL: backend base url (used by Steam)
 * - STEAM_API_KEY, STEAM_REALM, STEAM_RETURN_TO: for Steam OAuth (optional)
 */
async function main() {
  const cfg = buildConfig();

  const app = express();

  // Middleware
  app.use(
    cors({
      origin: cfg.FRONTEND_ORIGIN,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(
    cookieSession({
      name: 'session',
      secret: cfg.SESSION_SECRET,
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // local/dev only. For production behind HTTPS set true.
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })
  );
  app.use(morgan('dev'));

  // Health
  app.get('/health', async (_req, res) => {
    const ok = await healthCheck();
    res.json({ ok });
  });

  // Routes
  app.use('/auth', authRouter);
  app.use('/cases', casesRouter);
  app.use('/inventory', inventoryRouter);

  // 404
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // Error handler
  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error('Error handler:', err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
  });

  // Ensure DB is reachable at startup and seed demo balance if needed
  const prisma = getPrisma();
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (e) {
    console.error('Database not reachable:', e);
  }

  const port = cfg.PORT;
  app.listen(port, () => {
    console.log(`csgo_case_backend listening on http://localhost:${port}`);
    console.log(`CORS origin: ${cfg.FRONTEND_ORIGIN}`);
  });
}

main().catch((e) => {
  console.error('Fatal server error:', e);
  process.exit(1);
});
