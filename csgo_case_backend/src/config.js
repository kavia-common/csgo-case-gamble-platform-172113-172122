import 'dotenv/config';

/**
 * PUBLIC_INTERFACE
 * buildConfig
 * Build and validate configuration from environment variables.
 */
export function buildConfig() {
  /** Returns validated config object used by the server */
  const {
    PORT = '4000',
    FRONTEND_ORIGIN = 'http://localhost:3000',
    SESSION_SECRET = 'dev-secret-change',
    APP_BASE_URL = 'http://localhost:4000',
    STEAM_API_KEY,
    STEAM_REALM,
    STEAM_RETURN_TO,
  } = process.env;

  return {
    PORT: Number(PORT) || 4000,
    FRONTEND_ORIGIN,
    SESSION_SECRET,
    APP_BASE_URL,
    STEAM_API_KEY: STEAM_API_KEY || null,
    STEAM_REALM: STEAM_REALM || null,
    STEAM_RETURN_TO: STEAM_RETURN_TO || null,
  };
}

export default buildConfig;
