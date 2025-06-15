
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './components/ui/editor.css';
import 'highlight.js/styles/atom-one-dark.css';
import { startReportingWebVitals } from './lib/vitals.ts';
import './print.css';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

startReportingWebVitals();
