import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFF] dark:bg-slate-950 font-display">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#1A6FE8] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-slate-500">Checking authenticated session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

