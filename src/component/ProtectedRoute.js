import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // Jika pengguna belum login, arahkan ke halaman login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Jika pengguna sudah login, tampilkan komponen anak
  return children;
};

export default ProtectedRoute;
