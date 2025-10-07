import React from 'react';
import { Link } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function CaseCard({ item, onOpen }) {
  /** Renders a single case card with title, price and open button. */
  return (
    <div className="case-card">
      <div style={{height:120, borderRadius:12, background:'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(245,158,11,0.15))', marginBottom:12, display:'grid', placeItems:'center', color:'var(--muted)'}}>
        Image
      </div>
      <div className="case-title">{item.name}</div>
      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:8}}>
        <div className="case-price">${Number(item.price).toFixed(2)}</div>
        <div style={{display:'flex', gap:8}}>
          <Link className="btn btn-secondary" to={`/cases/${item.id}`}>Details</Link>
          <button className="btn" onClick={() => onOpen(item)}>Open</button>
        </div>
      </div>
    </div>
  );
}
