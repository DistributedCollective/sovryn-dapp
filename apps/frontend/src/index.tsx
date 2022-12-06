import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import setupChains from '@sovryn/ethers-provider';
import { OnboardProvider } from '@sovryn/onboard-react';

import App from './app/5_pages/App/App';
import PrivacyPolicy from './app/5_pages/PrivacyPolicy/PrivacyPolicy';
import { chains } from './config/chains';
import { TransactionProvider } from './context/transactionContext';
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
        <TransactionProvider>
          <Routes>
            <Route path="/policies/terms-of-use" element={<PrivacyPolicy />} />
            <Route path="*" element={<App />} />
          </Routes>
        </TransactionProvider>
        <OnboardProvider />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
