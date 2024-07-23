import { ApolloProvider } from '@apollo/client';

import './wdyr';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';

import { OnboardProvider } from '@sovryn/onboard-react';

// chain config must be imported before other internal files
import './config/chains';

import { LoaderProvider } from './app/0_meta/LoaderProvider/LoaderProvider';
import { ServiceWorkerProvider } from './app/2_molecules/ServiceWorkerProvider/ServiceWorkerProvider';
import { TransactionStepDialog } from './app/3_organisms';
import { NetworkProvider } from './app/3_organisms/NetworkProvider/NetworkProvider';
import { SharedStateProvider } from './app/3_organisms/SharedStateProvider/SharedStateProvider';
import { MaintenanceModeContextProvider } from './contexts/MaintenanceModeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { TokenPricesProvider } from './contexts/TokenPricesContext';
import { TransactionProvider } from './contexts/TransactionContext';
import './locales/dayjs';
import './locales/i18n';
import { router } from './router';
import './styles/tailwindcss/index.css';
import { rskClient } from './utils/clients';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <React.StrictMode>
    <NetworkProvider>
      <TransactionProvider>
        <NotificationProvider>
          <ServiceWorkerProvider>
            <TokenPricesProvider>
              <ApolloProvider client={rskClient}>
                <HelmetProvider>
                  <MaintenanceModeContextProvider>
                    <LoaderProvider>
                      <SharedStateProvider>
                        <RouterProvider router={router} />
                        <OnboardProvider dataAttribute="dapp-onboard" />
                      </SharedStateProvider>
                    </LoaderProvider>
                  </MaintenanceModeContextProvider>
                </HelmetProvider>
              </ApolloProvider>
            </TokenPricesProvider>
            <TransactionStepDialog disableFocusTrap />
          </ServiceWorkerProvider>
        </NotificationProvider>
      </TransactionProvider>
    </NetworkProvider>
  </React.StrictMode>,
);
