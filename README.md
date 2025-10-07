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
- When Steam is not configured on the backend, clicking "Login" will attempt /auth/dev-login to create a demo session automatically.

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

---

## End-to-end local verification checklist

1) Environment
   - Backend: cp csgo_case_backend/.env.example csgo_case_backend/.env and adjust if needed.
   - Frontend: cp csgo_case_frontend/.env.example csgo_case_frontend/.env and adjust if needed.
   - Ensure:
     - FRONTEND_ORIGIN=http://localhost:3000
     - REACT_APP_API_BASE_URL=http://localhost:4000

2) Backend database
   - cd csgo_case_backend
   - npm install
   - npm run prisma:generate
   - npm run prisma:migrate
   - npm run prisma:seed
   - npm run dev (starts on http://localhost:4000)

3) Frontend
   - cd csgo_case_frontend
   - npm install
   - npm start (opens http://localhost:3000)

4) CORS / cookies
   - Access-Control-Allow-Credentials must be true (backend already configured).
   - Origin must be http://localhost:3000 (configured via FRONTEND_ORIGIN).
   - Session cookie is httpOnly, sameSite=lax, secure=false (local dev).

5) API validation
   - GET /cases -> list loads on Home page.
   - GET /cases/:id -> Case details page.
   - POST /cases/:id/open -> Requires auth; after login it should return item + newBalance.
   - GET /inventory -> Inventory modal shows items.

6) Auth flows
   - If Steam NOT configured (no STEAM_API_KEY): Clicking "Login" triggers /auth/dev-login and refreshes session (user=demo).
   - If Steam configured: "Login" redirects to Steam via /auth/steam/login and callback sets session.

7) Functional flow
   - Home loads cases.
   - Click Login and verify header shows balance.
   - Open a case: balance decreases, modal shows result item.
   - Open Inventory: new item appears with value/rarity.
