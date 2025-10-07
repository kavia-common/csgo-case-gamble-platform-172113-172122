import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

// Create axios instance with cookie-based session support.
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// PUBLIC_INTERFACE
export function getLoginUrl() {
  /** Returns login URL for Steam OAuth on the backend or dev-login when Steam not configured. */
  const realm = process.env.REACT_APP_STEAM_REALM || window.location.origin;
  const returnTo = process.env.REACT_APP_STEAM_RETURN_TO || `${window.location.origin}/auth/callback`;
  // Prefer Steam endpoint with realm/return_to hints; backend will ignore if not needed.
  return `${baseURL}/auth/steam/login?realm=${encodeURIComponent(realm)}&return_to=${encodeURIComponent(returnTo)}`;
}

// PUBLIC_INTERFACE
export function getLogoutUrl() {
  /** Returns logout URL for the backend */
  return `${baseURL}/auth/logout`;
}

// PUBLIC_INTERFACE
export async function devLogin() {
  /** Development-only login endpoint when backend Steam is not configured. */
  const { data } = await api.get('/auth/dev-login');
  return data;
}

// PUBLIC_INTERFACE
export async function getSession() {
  /** Fetch current session/user profile */
  const { data } = await api.get('/auth/session');
  return data;
}

// PUBLIC_INTERFACE
export async function fetchCases() {
  /** Fetch list of cases */
  const { data } = await api.get('/cases');
  return data;
}

// PUBLIC_INTERFACE
export async function fetchCaseDetails(id) {
  /** Fetch single case details by id */
  const { data } = await api.get(`/cases/${id}`);
  return data;
}

// PUBLIC_INTERFACE
export async function openCase(id) {
  /** Open case and return result (winnings) */
  const { data } = await api.post(`/cases/${id}/open`);
  return data;
}

// PUBLIC_INTERFACE
export async function fetchInventory() {
  /** Fetch current user's inventory */
  const { data } = await api.get('/inventory');
  return data;
}

export default api;
