
import React from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';

import { App } from './src/app.component.js';
import { AuthProvider } from './src/services/auth.service.js';
import { LanguageProvider } from './src/services/language.service.js';
import { HistoryProvider } from './src/services/history.service.js';

const html = htm.bind(React.createElement);

const root = createRoot(document.getElementById('root'));

root.render(html`
  <${React.StrictMode}>
    <${LanguageProvider}>
      <${AuthProvider}>
        <${HistoryProvider}>
          <${App} />
        <//>
      <//>
    <//>
  <//>
`);

// AI Studio always uses an `index.tsx` file for all project types.
