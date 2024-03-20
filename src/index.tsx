// REACT IMPORT
import React from 'react';

// REACT-DOM IMPORT
import ReactDOM from 'react-dom/client';

// APP IMPORT
import App from './App';

// STYLES IMPORTS
import './styles/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
