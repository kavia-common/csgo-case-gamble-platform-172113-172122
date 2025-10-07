import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getSession } from '../../api/client';

// PUBLIC_INTERFACE
export const loadSession = createAsyncThunk('auth/loadSession', async () => {
  /** Loads current session from backend. */
  const session = await getSession();
  return session;
});

// PUBLIC_INTERFACE
export const handleAuthCallback = createAsyncThunk('auth/handleAuthCallback', async (queryString) => {
  /**
   * Handle OAuth callback. Backend should have set cookies; we just refresh session.
   * queryString is available for future needs (e.g., state verification), currently unused.
   */
  const session = await getSession();
  return session;
});

const initialState = {
  user: null,
  balance: 0,
  status: 'idle',
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // PUBLIC_INTERFACE
    clearAuthError(state) {
      /** Clear auth error state. */
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadSession.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload?.user || null;
        state.balance = action.payload?.balance ?? 0;
      })
      .addCase(loadSession.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(handleAuthCallback.fulfilled, (state, action) => {
        state.user = action.payload?.user || null;
        state.balance = action.payload?.balance ?? 0;
        state.status = 'succeeded';
      });
  }
});

export const { clearAuthError } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectBalance = (state) => state.auth.balance;
export const selectAuthStatus = (state) => state.auth.status;

// PUBLIC_INTERFACE
export const getLoginUrl = (state) => {
  /** Compute login URL. Prefer backend endpoint which sets cookies. */
  const realm = process.env.REACT_APP_STEAM_REALM || window.location.origin;
  const returnTo = process.env.REACT_APP_STEAM_RETURN_TO || `${window.location.origin}/auth/callback`;
  // In many backends this is proxied, but we still provide env fallbacks above if needed.
  return `${process.env.REACT_APP_API_BASE_URL || ''}/auth/steam/login?realm=${encodeURIComponent(realm)}&return_to=${encodeURIComponent(returnTo)}`;
};

// PUBLIC_INTERFACE
export const getLogoutUrl = () => {
  /** Logout URL on backend */
  return `${process.env.REACT_APP_API_BASE_URL || ''}/auth/logout`;
};

export default authSlice.reducer;
