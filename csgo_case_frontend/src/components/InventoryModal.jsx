import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadInventory, selectInventory, selectInventoryModalOpen, setInventoryModalOpen } from '../state/slices/inventorySlice';

// PUBLIC_INTERFACE
export default function InventoryModal() {
  /** Modal to display user's inventory. */
  const dispatch = useDispatch();
  const open = useSelector(selectInventoryModalOpen);
  const items = useSelector(selectInventory);

  useEffect(() => {
    if (open) {
      dispatch(loadInventory());
    }
  }, [open, dispatch]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={() => dispatch(setInventoryModalOpen(false))}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
          <div style={{fontWeight:800}}>Your Inventory</div>
          <button className="btn" style={{background:'#111827'}} onClick={() => dispatch(setInventoryModalOpen(false))}>Close</button>
        </div>
        <div className="divider" />
        <div style={{display:'grid', gap:10, maxHeight:360, overflow:'auto', paddingRight:6}}>
          {items?.length ? items.map((it, idx) => (
            <div className="card" key={idx} style={{padding:12, display:'flex', alignItems:'center', justifyContent:'space-between'}}>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <div style={{width:40, height:40, borderRadius:10, background:'rgba(37,99,235,0.1)', display:'grid', placeItems:'center'}}>🎁</div>
                <div>
                  <div style={{fontWeight:700}}>{it.name || 'Item'}</div>
                  <div style={{fontSize:12, color:'var(--muted)'}}>{it.rarity || 'Common'}</div>
                </div>
              </div>
              <div style={{fontWeight:800, color:'var(--primary)'}}>${Number(it.value || 0).toFixed(2)}</div>
            </div>
          )) : (
            <div style={{color:'var(--muted)'}}>No items yet. Open a case to win items!</div>
          )}
        </div>
      </div>
    </div>
  );
}
