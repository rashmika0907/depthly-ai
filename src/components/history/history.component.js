
import React, { useState, useContext } from 'react';
import htm from 'htm';
import { HistoryContext } from '../../services/history.service.js';
import { LanguageContext } from '../../services/language.service.js';
import { MarkdownRenderer } from '../../pipes/markdown.pipe.js';

const html = htm.bind(React.createElement);

export function History() {
  const { history, clearHistory } = useContext(HistoryContext);
  const { translate } = useContext(LanguageContext);
  const [expandedItemId, setExpandedItemId] = useState(null);

  const toggleItem = (id) => {
    setExpandedItemId(currentId => (currentId === id ? null : id));
  };
  
  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear your entire history? This action cannot be undone.')) {
      clearHistory();
    }
  }

  return html`
    <div class="w-full max-w-4xl">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl md:text-4xl font-bold text-white">${translate('history')}</h1>
        ${history.length > 0 && html`
          <button onClick=${handleClearHistory} class="bg-rose-800/70 hover:bg-rose-700/70 text-rose-200 font-semibold py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors">
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" /></svg>
            <span>${translate('clearHistory')}</span>
          </button>
        `}
      </div>

      <div class="space-y-4">
        ${history.length > 0 ? history.map(item => html`
          <div key=${item._id} class="glass-card overflow-hidden">
            <button onClick=${() => toggleItem(item._id)} class="w-full text-left p-4 md:p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
              <div>
                <h2 class="text-xl font-semibold text-white">${item.topic}</h2>
                <div class="flex items-center space-x-4 text-sm text-stone-400 mt-2">
                  <span class="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-md">${item.level}</span>
                  <span>${new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class=${`h-6 w-6 text-stone-400 transition-transform duration-300 ${expandedItemId === item._id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            ${expandedItemId === item._id && html`
              <div class="p-4 md:p-6 border-t border-white/10">
                <div class="prose prose-invert max-w-none prose-p:text-stone-300 prose-headings:text-white prose-strong:text-stone-100 prose-code:text-rose-400 prose-blockquote:border-l-rose-500 prose-a:text-orange-400">
                  <${MarkdownRenderer} markdown=${item.content} />
                </div>
              </div>
            `}
          </div>
        `) : html`
          <div class="glass-card text-center py-16 px-6">
            <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-stone-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <h3 class="mt-4 text-xl font-semibold text-white">No History Yet</h3>
            <p class="mt-2 text-stone-400">${translate('noHistory')}</p>
          </div>
        `}
      </div>
    </div>
  `;
}
