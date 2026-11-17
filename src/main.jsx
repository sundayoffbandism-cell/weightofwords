import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

import './styles/variables.css';
import './styles/global.css';
import './styles/seesaw.css';
import './styles/card.css';
import './styles/tray.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
