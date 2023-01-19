import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import './wdyr';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import { OnboardProvider } from '@sovryn/onboard-react';

// chain config must be imported before other internal files
import './config/chains';

import { NetworkProvider } from './app/3_organisms/NetworkProvider/NetworkProvider';
import { MaintenanceModeContextProvider } from './contexts/MaintenanceModeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { TransactionProvider } from './contexts/TransactionContext';
import './locales/dayjs';
import './locales/i18n';
import { router } from './router';
import './styles/tailwindcss/index.css';
import { graphRskUrl } from './utils/constants';

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
    <NetworkProvider>
      <TransactionProvider>
        <ApolloProvider client={rskClient}>
          <MaintenanceModeContextProvider>
            <NotificationProvider>
              <RouterProvider router={router} />
              <OnboardProvider dataAttribute="dapp-onboard" />
            </NotificationProvider>
          </MaintenanceModeContextProvider>
        </ApolloProvider>
      </TransactionProvider>
    </NetworkProvider>
  </React.StrictMode>,
);
