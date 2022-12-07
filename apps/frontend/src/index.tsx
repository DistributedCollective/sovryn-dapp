import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import loadable from '@loadable/component';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import setupChains from '@sovryn/ethers-provider';
import { OnboardProvider } from '@sovryn/onboard-react';

import { chains } from './config/chains';
import { TransactionProvider } from './context/transactionContext';
import './locales/i18n';
import './styles/tailwindcss/index.css';
import { graphRskUrl } from './utils/constants';

const App = loadable(() => import('./app/5_pages/App/App'));
const PrivacyPolicy = loadable(
  () => import('./app/5_pages/PrivacyPolicy/PrivacyPolicy'),
);
const TermsOfUse = loadable(
  () => import('./app/5_pages/TermsOfUse/TermsOfUse'),
);

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
            <Route
              path="/policies/privacy-policy"
              element={<PrivacyPolicy />}
            />
            <Route path="/policies/terms-of-use" element={<TermsOfUse />} />
            <Route path="*" element={<App />} />
          </Routes>
        </TransactionProvider>
        <OnboardProvider />
      </ApolloProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
