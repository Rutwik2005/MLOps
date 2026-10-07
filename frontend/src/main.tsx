import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Prevent mouse wheel from accidentally modifying number input values across the app
document.addEventListener(
  'wheel',
  () => {
    if (
      document.activeElement instanceof HTMLInputElement &&
      document.activeElement.type === 'number'
    ) {
      document.activeElement.blur();
    }
  },
  { passive: true }
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
