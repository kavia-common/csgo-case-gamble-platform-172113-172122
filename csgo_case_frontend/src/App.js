import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AppRoutes from './routes';
import InventoryModal from './components/InventoryModal';
import Toast from './components/Toast';

// PUBLIC_INTERFACE
function App() {
  /** Root application layout with header, sidebar, and routed content. */
  return (
    <BrowserRouter>
      <div className="header card header">
        <Header />
      </div>
      <div className="main-layout container">
        <aside className="sidebar">
          <Sidebar />
        </aside>
        <main>
          <AppRoutes />
        </main>
      </div>
      <InventoryModal />
      <Toast />
    </BrowserRouter>
  );
}

export default App;
