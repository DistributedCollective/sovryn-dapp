import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import setupChains from '@sovryn/ethers-provider';
import { OnboardProvider } from '@sovryn/onboard-react';

import App from './app/5_pages/App/App';
import { chains } from './config/chains';
import './locales/i18n';
import './styles/tailwindcss/index.css';

setupChains(chains);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <OnboardProvider />
    </BrowserRouter>
  </React.StrictMode>,
);
