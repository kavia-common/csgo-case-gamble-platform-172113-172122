import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

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
  /** Returns login URL for Steam OAuth on the backend */
  return `${baseURL}/auth/steam/login`;
}

// PUBLIC_INTERFACE
export function getLogoutUrl() {
  /** Returns logout URL for the backend */
  return `${baseURL}/auth/logout`;
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
