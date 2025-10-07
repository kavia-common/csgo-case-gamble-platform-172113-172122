import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCases, openCaseThunk, selectCases, selectLastResult, selectOpening } from '../state/slices/casesSlice';
import CaseCard from '../components/CaseCard';
import CaseOpenModal from '../components/CaseOpenModal';

// PUBLIC_INTERFACE
export default function Home() {
  /** Home page: grid of cases and open modal. */
  const dispatch = useDispatch();
  const cases = useSelector(selectCases);
  const opening = useSelector(selectOpening);
  const lastResult = useSelector(selectLastResult);

  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(loadCases());
  }, [dispatch]);

  const onOpenClick = (item) => {
    setSelected(item);
    setModalOpen(true);
  };

  const confirmOpen = () => {
    if (selected) {
      dispatch(openCaseThunk(selected.id));
    }
  };

  return (
    <div>
      <div className="card" style={{padding:16, marginBottom:16}}>
        <div style={{fontWeight:800, fontSize:20}}>Featured Cases</div>
        <div style={{fontSize:13, color:'var(--muted)'}}>Pick a case to open and try your luck.</div>
      </div>
      <div className="grid cases">
        {cases?.map(item => (
          <CaseCard key={item.id} item={item} onOpen={onOpenClick} />
        ))}
      </div>
      <CaseOpenModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirmOpen={confirmOpen}
        loading={opening}
        result={lastResult}
      />
    </div>
  );
}
