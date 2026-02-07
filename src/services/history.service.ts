
import React, { createContext, useState, useEffect, useContext } from 'react';
import htm from 'htm';
import { AuthContext } from './auth.service.ts';

const html = htm.bind(React.createElement);
export const HistoryContext = createContext(null);

export function HistoryProvider({ children }) {
  const { isLoggedIn } = useContext(AuthContext);
  const [history, setHistory] = useState([]);

  const fetchHistory = () => {
    setTimeout(() => {
      const mockHistory = [
        { _id: 'h1', user: '1', topic: 'Quantum Computing', level: 'Expert', content: '### Quantum Computing: An Expert Overview...', timestamp: new Date(Date.now() - 300000).toISOString() },
        { _id: 'h2', user: '1', topic: 'Photosynthesis', level: 'Beginner', content: '### Photosynthesis for Beginners...', timestamp: new Date(Date.now() - 7200000).toISOString() }
      ];
      setHistory(mockHistory);
    }, 500);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory();
    } else {
      setHistory([]);
    }
  }, [isLoggedIn]);

  const clearHistory = () => setHistory([]);

  const addHistoryItem = (item) => {
    const newItem = {
      ...item,
      _id: `h${Date.now()}`,
      user: '1',
      timestamp: new Date().toISOString()
    };
    setHistory(current => [newItem, ...current]);
  };

  const value = { history, fetchHistory, clearHistory, addHistoryItem };

  return html`<${HistoryContext.Provider} value=${value}>${children}<//>`;
}
