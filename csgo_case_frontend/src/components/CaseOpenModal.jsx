import React, { useEffect, useState } from 'react';

// PUBLIC_INTERFACE
export default function CaseOpenModal({ open, onClose, onConfirmOpen, loading, result }) {
  /** Modal to confirm and visualize case opening with spinner effect. */
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    if (loading) setSpinning(true);
    if (!loading) {
      const t = setTimeout(() => setSpinning(false), 600);
      return () => clearTimeout(t);
    }
  }, [loading]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{fontWeight:800}}>Open Case</div>
          <button className="btn" style={{background:'#111827'}} onClick={onClose}>Close</button>
        </div>
        <div className="divider" />
        <div style={{display:'grid', placeItems:'center', padding:'20px 8px'}}>
          <div style={{
            width:120, height:120, borderRadius:'50%',
            border:'6px solid rgba(37,99,235,0.25)', borderTopColor:'var(--primary)',
            animation: spinning ? 'spin 0.8s linear infinite' : 'none'
          }} />
          <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
          <div style={{marginTop:12, color:'var(--muted)'}}>
            {loading ? 'Opening...' : (result ? 'You won:' : 'Ready to open')}
          </div>
          {result && (
            <div className="card" style={{marginTop:12, padding:12, borderRadius:12}}>
              <div style={{fontWeight:800}}>{result.item?.name || 'Mystery Item'}</div>
              <div style={{color:'var(--primary)', fontWeight:700}}>${Number(result.item?.value || 0).toFixed(2)}</div>
            </div>
          )}
        </div>
        <div className="divider" />
        <div style={{display:'flex', justifyContent:'flex-end', gap:8}}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={loading} onClick={onConfirmOpen}>Open</button>
        </div>
      </div>
    </div>
  );
}
