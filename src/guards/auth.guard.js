
import React, { useContext, useEffect } from 'react';
import htm from 'htm';
import { AuthContext } from '../services/auth.service.js';

const html = htm.bind(React.createElement);

export function ProtectedRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  
  useEffect(() => {
    if (!isLoggedIn) {
      window.location.hash = '/login';
    }
  }, [isLoggedIn]);

  return isLoggedIn ? children : null; // Render children or nothing while redirecting
}
