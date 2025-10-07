import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { handleAuthCallback } from '../state/slices/authSlice';
import { useLocation, useNavigate } from 'react-router-dom';

// PUBLIC_INTERFACE
export default function AuthCallback() {
  /** Handles OAuth callback: refresh session and redirect to home. */
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const qs = location.search;
    dispatch(handleAuthCallback(qs)).finally(() => {
      navigate('/');
    });
  }, [dispatch, location.search, navigate]);

  return (
    <div className="card" style={{padding:16}}>
      Completing sign-in...
    </div>
  );
}
