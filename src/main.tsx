import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'lenis/dist/lenis.css';
import './styles/base.css';
import './styles/arrival.css';
import './styles/journey.css';
import './styles/sections.css';
import './styles/nav.css';
import './styles/edits.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
