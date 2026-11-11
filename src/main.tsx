import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { SettingsProvider } from './context/SettingsContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SettingsProvider>
      <App />
    </SettingsProvider>
  </StrictMode>,
);

// Register PWA Service Worker with active cache-updating
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for updates on load
        registration.update().catch(() => {});
      })
      .catch((err) => {
        // Non-blocking catch in environments where service workers may be restricted (e.g. nested sandbox iframes)
        console.warn('PWA ServiceWorker registration:', err);
      });
  });
}
