
import React, { useContext, useEffect } from 'react';
import htm from 'htm';
import { AuthContext } from '../services/auth.service.ts';

const html = htm.bind(React.createElement);

export function GuestRoute({ children }) {
  const { isLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    if (isLoggedIn) {
      window.location.hash = '/explore';
    }
  }, [isLoggedIn]);

  return !isLoggedIn ? children : null; // Render children or nothing while redirecting
}
