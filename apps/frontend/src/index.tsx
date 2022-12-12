import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import loadable from '@loadable/component';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import setupChains from '@sovryn/ethers-provider';
import { OnboardProvider } from '@sovryn/onboard-react';

import { PageContainer } from './app/4_templates';
import { ErrorPage } from './app/5_pages/ErrorPage/ErrorPage';
import { chains } from './config/chains';
import { MaintenanceModeContextProvider } from './contexts/MaintenanceModeContext';
import { TransactionProvider } from './contexts/TransactionContext';
import './locales/dayjs';
import './locales/i18n';
import './styles/tailwindcss/index.css';
import { graphRskUrl } from './utils/constants';
import './wdyr';

setupChains(chains);

const Home = loadable(() => import('./app/5_pages/App/App'));
const Zero = loadable(() => import('./app/5_pages/ZeroPage/ZeroPage'), {
  resolveComponent: components => components.ZeroPage,
});

const PrivacyPolicy = loadable(
  () => import('./app/5_pages/PrivacyPolicy/PrivacyPolicy'),
);
const TermsOfUse = loadable(
  () => import('./app/5_pages/TermsOfUse/TermsOfUse'),
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageContainer className="flex flex-col" />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
        index: true,
      },
      {
        path: '/zero',
        element: <Zero />,
      },
    ],
  },
  {
    element: <PageContainer contentClassName="container" />,
    children: [
      {
        path: '/policies/terms-of-use',
        element: <TermsOfUse />,
      },
      {
        path: '/policies/privacy-policy',
        element: <PrivacyPolicy />,
      },
    ],
  },
]);

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
          <RouterProvider router={router} />
          <OnboardProvider />
        </MaintenanceModeContextProvider>
      </ApolloProvider>
    </TransactionProvider>
    <OnboardProvider />
  </React.StrictMode>,
);
