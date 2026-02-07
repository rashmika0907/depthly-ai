
import React, { useState, useContext } from 'react';
import htm from 'htm';
import { AuthContext } from '../../services/auth.service.js';
import { LanguageContext } from '../../services/language.service.js';

const html = htm.bind(React.createElement);

export function Navbar() {
  const { currentUser, logout } = useContext(AuthContext);
  const { languages, currentLanguage, setLanguage, translate } = useContext(LanguageContext);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const getUserInitials = () => {
    const name = currentUser?.name || '';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return html`
    <nav class="glass-nav sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto flex items-center justify-between h-16">
        <div class="flex items-center space-x-8">
          <a href="#/explore" class="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-rose-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>
            <span class="text-2xl font-bold text-stone-100">Depthly</span>
          </a>
          <div class="hidden md:flex items-center space-x-6">
            <a href="#/explore" class="text-stone-300 hover:text-rose-400 transition-colors duration-200 font-medium">${translate('explore')}</a>
            <a href="#/history" class="text-stone-300 hover:text-rose-400 transition-colors duration-200 font-medium">${translate('history')}</a>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <button onClick=${() => setDropdownOpen(!isDropdownOpen)} class="p-2 rounded-full hover:bg-white/10 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m4 13-4-4m0 0l4-4m-4 4h12M3 17h12a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </button>
            ${isDropdownOpen && html`
              <div class="absolute right-0 mt-2 w-40 glass-card shadow-lg py-1">
                ${languages.map(lang => html`
                  <a key=${lang.code} onClick=${() => { setLanguage(lang.code); setDropdownOpen(false); }} class=${`block px-4 py-2 text-sm cursor-pointer ${lang.code === currentLanguage ? 'bg-rose-500/50' : 'hover:bg-white/10'}`}>
                    ${lang.name}
                  </a>
                `)}
              </div>
            `}
          </div>
          ${currentUser && html`
            <div class="flex items-center space-x-3">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center font-bold text-white">
                ${getUserInitials()}
              </div>
              <span class="hidden sm:block text-stone-300">${currentUser.name}</span>
              <button onClick=${logout} class="p-2 rounded-full hover:bg-white/10 transition-colors" title=${translate('logout')}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-stone-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          `}
        </div>
      </div>
    </nav>
  `;
}
