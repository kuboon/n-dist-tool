import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { loadFromQueryStr } from './utils/queryStrSync.ts';

import './index.css';

// Load initial state from URL hash
const params = loadFromQueryStr() || {
  lowerBound: -1,
  upperBound: 1
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App params={params} />
  </StrictMode>
);
