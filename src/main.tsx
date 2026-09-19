import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ExclusiveAccessProvider } from './context/ExclusiveAccessContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExclusiveAccessProvider>
      <App />
    </ExclusiveAccessProvider>
  </StrictMode>,
);

// Register PWA Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((err) => {
        // Non-blocking catch in environments where service workers may be restricted (e.g. nested sandbox iframes)
        console.warn('PWA ServiceWorker registration:', err);
      });
  });
}

