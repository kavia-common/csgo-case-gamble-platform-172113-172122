import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../state/slices/authSlice';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function Sidebar() {
  /** Sidebar with user summary and navigation links. */
  const user = useSelector(selectUser);

  return (
    <div className="card sidebar-card">
      <div style={{display:'flex', alignItems:'center', gap:12}}>
        <div style={{
          width:44, height:44, borderRadius:12,
          background:'linear-gradient(135deg, #2563EB, #60A5FA)',
          color:'#fff', display:'grid', placeItems:'center', fontWeight:800
        }}>
          {user?.username ? user.username[0]?.toUpperCase() : 'G'}
        </div>
        <div>
          <div style={{fontWeight:800}}>{user?.username || 'Guest'}</div>
          <div style={{fontSize:12, color:'var(--muted)'}}>{user ? 'Signed in' : 'Not signed in'}</div>
        </div>
      </div>

      <div className="divider" />

      <div style={{display:'grid', gap:8}}>
        <Link to="/" className="btn" style={{background:'#fff', color:'#111827', border:'1px solid var(--border)'}}>Home</Link>
        <Link to="/profile" className="btn" style={{background:'#fff', color:'#111827', border:'1px solid var(--border)'}}>Profile</Link>
      </div>

      <div style={{marginTop:12, fontSize:12, color:'var(--muted)'}}>
        Tips: Open cases responsibly. Your items will appear in Inventory.
      </div>
    </div>
  );
}
