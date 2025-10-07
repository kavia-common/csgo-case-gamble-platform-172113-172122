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
A minimal Node.js backend workspace with Prisma + SQLite to manage users, items, cases, and case openings.

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
7) Optional: open Prisma Studio to inspect data:
   - npm run prisma:studio

By default, DATABASE_URL points to file:./dev.db (SQLite). You can replace with another path or switch providers later.

### Notes
- Reusable Prisma client is exported from src/db/index.js (getPrisma()).
- Seed creates:
  - User: username "demo" with 250.00 starting balance and a couple of starter items.
  - Items: A small catalog with rarity and values.
  - Cases: Starter, Pro, Elite with weighted drop tables.
- This backend workspace currently provides DB layer only; API routes/services can be added in subsequent steps.
