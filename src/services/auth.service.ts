
import React, { createContext, useState, useEffect } from 'react';
import htm from 'htm';

const html = htm.bind(React.createElement);

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const userKey = 'depthly_user';
  const tokenKey = 'depthly_token';

  useEffect(() => {
    const userJson = localStorage.getItem(userKey);
    const token = localStorage.getItem(tokenKey);
    if (userJson && token) {
      setCurrentUser(JSON.parse(userJson));
    }
  }, []);

  const navigate = (path) => { window.location.hash = path; };

  const login = async (credentials) => {
    // FIX: Explicitly type the Promise to resolve with 'void' because resolve() is called without arguments.
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const mockUser = { _id: '1', name: 'Demo User', email: credentials.email };
        const mockToken = 'mock_jwt_token';
        setCurrentUser(mockUser);
        localStorage.setItem(userKey, JSON.stringify(mockUser));
        localStorage.setItem(tokenKey, mockToken);
        navigate('/explore');
        resolve();
      }, 1000);
    });
  };

  const signup = async (details) => {
    // FIX: Explicitly type the Promise to resolve with 'void' because resolve() is called without arguments.
    return new Promise<void>(resolve => {
      setTimeout(() => {
        const mockUser = { _id: '1', name: details.name, email: details.email };
        const mockToken = 'mock_jwt_token';
        setCurrentUser(mockUser);
        localStorage.setItem(userKey, JSON.stringify(mockUser));
        localStorage.setItem(tokenKey, mockToken);
        navigate('/explore');
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem(userKey);
    localStorage.removeItem(tokenKey);
    navigate('/login');
  };

  const getToken = () => localStorage.getItem(tokenKey);
  
  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    login,
    signup,
    logout,
    getToken,
  };

  return html`<${AuthContext.Provider} value=${value}>${children}<//>`;
}
