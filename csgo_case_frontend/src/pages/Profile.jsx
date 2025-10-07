import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser, selectBalance } from '../state/slices/authSlice';

// PUBLIC_INTERFACE
export default function Profile() {
  /** Profile page with basic user information display. */
  const user = useSelector(selectUser);
  const balance = useSelector(selectBalance);

  if (!user) {
    return <div className="card" style={{padding:16}}>Please login to view your profile.</div>;
  }

  return (
    <div className="card" style={{padding:16}}>
      <div style={{fontWeight:800, fontSize:22}}>Profile</div>
      <div className="divider" />
      <div style={{display:'grid', gap:8}}>
        <div><strong>Username:</strong> {user.username}</div>
        <div><strong>Steam ID:</strong> {user.steamId || 'N/A'}</div>
        <div><strong>Balance:</strong> ${Number(balance).toFixed(2)}</div>
      </div>
    </div>
  );
}
