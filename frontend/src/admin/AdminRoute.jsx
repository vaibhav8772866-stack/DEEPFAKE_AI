import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminLogin from './AdminLogin';

export default function AdminRoute({ children, onNavigate }) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-cyan-400 font-mono-tech text-xs">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>VERIFYING ADMINISTRATOR SECURITY CLEARANCE...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin onLoginSuccess={() => onNavigate('/admin/dashboard')} />;
  }

  return <>{children}</>;
}
