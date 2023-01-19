import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { OnboardProvider } from '@sovryn/onboard-react';

import { TransactionStepDialog } from './app/3_organisms';
// chain config must be imported before other files
import './config/chains';
import { MaintenanceModeContextProvider } from './contexts/MaintenanceModeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { TransactionProvider } from './contexts/TransactionContext';
import './locales/dayjs';
import './locales/i18n';
import { router } from './router';
import './styles/tailwindcss/index.css';
import { graphRskUrl } from './utils/constants';
import './wdyr';

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
    <TransactionProvider>
      <ApolloProvider client={rskClient}>
        <MaintenanceModeContextProvider>
          <NotificationProvider>
            <RouterProvider router={router} />
            <OnboardProvider dataAttribute="dapp-onboard" />
          </NotificationProvider>
        </MaintenanceModeContextProvider>
      </ApolloProvider>
      <TransactionStepDialog />
    </TransactionProvider>
  </React.StrictMode>,
);
