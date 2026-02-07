
import React, { useState, useEffect, useContext } from 'react';
import htm from 'htm';

import { AuthContext } from './services/auth.service.js';
import { Navbar } from './components/navbar/navbar.component.js';
import { Explore } from './components/explore/explore.component.js';
import { History } from './components/history/history.component.js';
import { Login } from './components/login/login.component.js';
import { Signup } from './components/signup/signup.component.js';
import { ProtectedRoute } from './guards/auth.guard.js';
import { GuestRoute } from './guards/guest.guard.js';

const html = htm.bind(React.createElement);

const routes = {
  '/explore': html`<${ProtectedRoute}><${Explore} /><//>`,
  '/history': html`<${ProtectedRoute}><${History} /><//>`,
  '/login': html`<${GuestRoute}><${Login} /><//>`,
  '/signup': html`<${GuestRoute}><${Signup} /><//>`,
};

export function App() {
  const { isLoggedIn } = useContext(AuthContext);
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/explore');

  useEffect(() => {
    const onHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/explore');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  
  const RouteComponent = routes[currentPath] || routes['/explore'];

  return html`
    <div class="bg-blobs">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
    </div>
    <div class="relative min-h-screen w-full flex flex-col">
      ${isLoggedIn && html`<${Navbar} />`}
      <main class="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        ${RouteComponent}
      </main>
    </div>
  `;
}
