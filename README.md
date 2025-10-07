# csgo-case-gamble-platform-172113-172122

Frontend: React app for browsing and opening CS:GO cases, built with a lightweight custom UI following the Ocean Professional theme.

Getting started
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