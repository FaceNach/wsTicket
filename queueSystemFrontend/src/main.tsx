import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import TicketsApp from './TicketsApp.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TicketsApp />
  </StrictMode>
);
