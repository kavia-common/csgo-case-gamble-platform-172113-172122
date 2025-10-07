import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CaseDetails from './pages/CaseDetails';
import Profile from './pages/Profile';
import AuthCallback from './pages/AuthCallback';

// PUBLIC_INTERFACE
export default function AppRoutes() {
  /** Application routes definition. */
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cases/:id" element={<CaseDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
    </Routes>
  );
}
