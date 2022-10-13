import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { OnboardProvider } from '@sovryn/onboard-react';

import App from './app/5_pages/App/App';
import { onboard } from './lib/connector';
import './styles/tailwindcss/index.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <OnboardProvider onboard={onboard} />
    </BrowserRouter>
  </React.StrictMode>,
);
