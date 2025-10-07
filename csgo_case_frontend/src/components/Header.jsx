import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadSession, selectBalance, selectUser, getLoginUrl, getLogoutUrl } from '../state/slices/authSlice';
import { setInventoryModalOpen } from '../state/slices/inventorySlice';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Header() {
  /** Top navigation header with brand, balance and auth controls. */
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const balance = useSelector(selectBalance);
  const loginUrl = useSelector(getLoginUrl);

  useEffect(() => {
    dispatch(loadSession());
  }, [dispatch]);

  return (
    <nav className="navbar container">
      <div className="brand">
        <div className="brand-badge">CS</div>
        <div>
          <div className="brand-title">Case Ocean</div>
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
          <a className="btn" href={loginUrl}>Login with Steam</a>
        )}
      </div>
    </nav>
  );
}
