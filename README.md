# csgo-case-gamble-platform-172113-172122

Frontend: React app for browsing and opening CS:GO cases, built with a lightweight custom UI following the Ocean Professional theme.

## Getting started - Frontend
- cd csgo_case_frontend
- Copy .env.example to .env and set values
- npm install
- npm start

Key environment variables
- REACT_APP_API_BASE_URL: Backend REST base URL (cookie auth)
- REACT_APP_STEAM_REALM: Steam OAuth realm (your site origin)
- REACT_APP_STEAM_RETURN_TO: Redirect URL for OAuth callback
- REACT_APP_APP_NAME: Display name

Auth
- Axios is configured with withCredentials=true; backend must set CORS to allow credentials.

---

## Backend workspace (csgo_case_backend)
Node.js + Express backend with Prisma + SQLite. Provides cookie-based auth (Steam OpenID if configured or dev login), cases, and inventory APIs.

### Setup
1) cd csgo_case_backend
2) Copy .env.example to .env and adjust variables if needed
3) Install dependencies:
   - npm install
4) Generate Prisma client:
   - npm run prisma:generate
5) Run initial migration (creates SQLite file and tables):
   - npm run prisma:migrate
6) Seed initial data (demo user, items, cases, drop weights):
   - npm run prisma:seed
7) Start the API:
   - npm run dev   # with nodemon
   - or npm start  # plain node
8) Optional: open Prisma Studio to inspect data:
   - npm run prisma:studio

By default, DATABASE_URL points to file:./dev.db (SQLite). You can replace with another path or switch providers later.

### API Overview
- CORS: origin = FRONTEND_ORIGIN, credentials enabled; cookies use httpOnly, sameSite=lax, secure=false (local).
- Auth:
  - GET /auth/session -> { user, balance }
  - GET /auth/dev-login -> creates a demo session (only when STEAM_API_KEY not set)
  - POST /auth/logout or GET /auth/logout
  - If Steam enabled:
    - GET /auth/steam/login
    - GET /auth/steam/return (callback)
- Cases:
  - GET /cases
  - GET /cases/:id
  - POST /cases/:id/open (requires session)
- Inventory:
  - GET /inventory (requires session)
  - POST /inventory/:inventoryId/sell (optional)
  - POST /inventory/:inventoryId/withdraw (optional stub)

### Notes
- Reusable Prisma client is exported from src/db/index.js (getPrisma()).
- Seed creates:
  - User: username "demo" with 250.00 starting balance and a couple of starter items.
  - Items: A small catalog with rarity and values.
  - Cases: Starter, Pro, Elite with weighted drop tables.
- Randomness: utils/random.js implements weightedRandom to simulate case openings.
- Sessions: cookie-session with SESSION_SECRET; adjust secure flag for production HTTPS.
