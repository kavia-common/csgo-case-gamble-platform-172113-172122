import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSession, selectBalance, selectUser, getLoginUrl as selectLoginUrl, getLogoutUrl } from '../state/slices/authSlice';
import { setInventoryModalOpen } from '../state/slices/inventorySlice';
import { Link } from 'react-router-dom';
import { devLogin } from '../api/client';

// PUBLIC_INTERFACE
export default function Header() {
  /** Top navigation header with brand, balance and auth controls. */
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const balance = useSelector(selectBalance);
  const loginUrl = useSelector(selectLoginUrl);
  const appName = process.env.REACT_APP_APP_NAME || 'Case Ocean';

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  const handleLoginClick = async (e) => {
    // If backend Steam is not configured, /auth/steam/login will likely 404/redirect.
    // We attempt a dev-login call first; if it fails (Steam configured), fall back to Steam redirect.
    e.preventDefault();
    try {
      const res = await devLogin();
      if (res && (res.user || res.balance !== undefined)) {
        // After dev-login, refresh session state.
        dispatch(loadSession());
        return;
      }
    } catch (_err) {
      // Ignore and proceed to Steam redirect
    }
    window.location.href = loginUrl;
  };

  return (
    <nav className="navbar container">
      <div className="brand">
        <div className="brand-badge">CS</div>
        <div>
          <div className="brand-title">{appName}</div>
          <div style={{fontSize: 12, color: '#6B7280'}}>CSGO Case Gambling</div>
        </div>
      </div>
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div className="balance">
          <span style={{fontWeight:700, color:'var(--primary)'}}>Ξ</span>
          <span style={{fontWeight:700}}>{balance?.toFixed ? balance.toFixed(2) : balance}</span>
        </div>
        <button className="btn btn-secondary" onClick={() => dispatch(setInventoryModalOpen(true))}>Inventory</button>
        {user ? (
          <>
            <Link to="/profile" className="btn" style={{background:'var(--primary)'}}>Profile</Link>
            <a className="btn" href={getLogoutUrl()} style={{background:'#111827'}}>Logout</a>
          </>
        ) : (
          <a className="btn" href={loginUrl} onClick={handleLoginClick}>Login</a>
        )}
      </div>
    </nav>
  );
}
