import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCaseDetails, openCaseThunk, selectSelectedCase, selectOpening } from '../state/slices/casesSlice';
import { useParams } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function CaseDetails() {
  /** Case details page showing drop table and open CTA. */
  const { id } = useParams();
  const dispatch = useDispatch();
  const item = useSelector(selectSelectedCase);
  const opening = useSelector(selectOpening);

  useEffect(() => {
    dispatch(loadCaseDetails(id));
  }, [dispatch, id]);

  if (!item) {
    return <div className="card" style={{padding:16}}>Loading...</div>;
  }

  return (
    <div className="card" style={{padding:16}}>
      <div style={{display:'flex', gap:16, alignItems:'center'}}>
        <div style={{width:120, height:120, borderRadius:12, background:'rgba(37,99,235,0.12)'}} />
        <div>
          <div style={{fontWeight:800, fontSize:22}}>{item.name}</div>
          <div className="case-price" style={{marginTop:6}}>${Number(item.price).toFixed(2)}</div>
          <button className="btn" style={{marginTop:12}} disabled={opening} onClick={() => dispatch(openCaseThunk(id))}>
            {opening ? 'Opening...' : 'Open Case'}
          </button>
        </div>
      </div>
      <div className="divider" />
      <div style={{fontWeight:800, marginBottom:8}}>Possible Drops</div>
      <div className="grid" style={{gridTemplateColumns:'repeat(3,1fr)', gap:12}}>
        {(item.drops || []).map((d, idx) => (
          <div key={idx} className="card" style={{padding:12}}>
            <div style={{fontWeight:700}}>{d.name}</div>
            <div style={{fontSize:12, color:'var(--muted)'}}>Rarity: {d.rarity || 'Common'}</div>
            <div style={{color:'var(--primary)', fontWeight:700}}>${Number(d.value || 0).toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
