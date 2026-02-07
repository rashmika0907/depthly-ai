
import React, { useState, useContext } from 'react';
import htm from 'htm';
import { AuthContext } from '../../services/auth.service.js';
import { LanguageContext } from '../../services/language.service.js';

const html = htm.bind(React.createElement);

export function Login() {
  const { login } = useContext(AuthContext);
  const { translate } = useContext(LanguageContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return html`
    <div class="w-full max-w-md">
      <div class="glass-card p-8 shadow-2xl">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-white">${translate('login')}</h1>
          <p class="text-stone-400 mt-2">Welcome back to Depthly</p>
        </div>
        <form onSubmit=${handleSubmit} novalidate>
          <div class="mb-4">
            <label for="email" class="block text-stone-300 mb-2">${translate('email')}</label>
            <input type="email" id="email" value=${email} onChange=${e => setEmail(e.target.value)}
                  class="w-full bg-stone-900/50 border border-stone-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div class="mb-6">
            <label for="password" class="block text-stone-300 mb-2">${translate('password')}</label>
            <input type="password" id="password" value=${password} onChange=${e => setPassword(e.target.value)}
                  class="w-full bg-stone-900/50 border border-stone-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          ${error && html`<div class="bg-red-500/20 text-red-400 p-3 rounded-lg mb-4 text-sm">${error}</div>`}
          <button type="submit" disabled=${isLoading}
                  class="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-300 disabled:bg-rose-800 disabled:cursor-not-allowed flex items-center justify-center">
            ${isLoading ? html`
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Logging in...</span>` 
            : html`<span>${translate('login')}</span>`}
          </button>
          <p class="text-center text-stone-400 mt-6">
            ${translate('loginPrompt')} <a href="#/signup" class="font-medium text-rose-500 hover:underline"> ${translate('signup')}</a>
          </p>
        </form>
      </div>
    </div>
  `;
}
