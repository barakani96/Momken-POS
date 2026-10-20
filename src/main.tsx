import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './i18n';
import '@carbon/styles/css/styles.css';
import '@carbon/charts/styles.css';
import './index.scss';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);

