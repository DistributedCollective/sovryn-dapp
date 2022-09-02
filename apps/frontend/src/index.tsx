import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/5_pages/App';
import './styles/tailwindcss/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
