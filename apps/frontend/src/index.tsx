import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import setupChains from '@sovryn/ethers-provider';
import { OnboardProvider } from '@sovryn/onboard-react';

import App from './app/5_pages/App/App';
import { chains } from './config/chains';
import { MaintenanceModeContextProvider } from './contexts/MaintenanceModeContext';
import { TransactionProvider } from './contexts/TransactionContext';
import './locales/dayjs';
import './locales/i18n';
import './styles/tailwindcss/index.css';
import { graphRskUrl } from './utils/constants';

setupChains(chains);

const rskClient = new ApolloClient({
  uri: graphRskUrl,
  cache: new InMemoryCache({
    resultCaching: false,
  }),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ApolloProvider client={rskClient}>
        <MaintenanceModeContextProvider>
          <TransactionProvider>
            <App />
          </TransactionProvider>
        </MaintenanceModeContextProvider>
        <OnboardProvider />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
