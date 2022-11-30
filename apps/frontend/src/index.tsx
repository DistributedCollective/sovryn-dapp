import loadable from '@loadable/component';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import setupChains from '@sovryn/ethers-provider';
import { OnboardProvider } from '@sovryn/onboard-react';

import { MainLayout } from './app/4_templates/MainLayout/MainLayout';
import { ErrorPage } from './app/5_pages/ErrorPage/ErrorPage';
import { chains } from './config/chains';
import { TransactionProvider } from './context/transactionContext';
import './locales/i18n';
import './styles/tailwindcss/index.css';
import { graphRskUrl } from './utils/constants';

setupChains(chains);

const Home = loadable(() => import('./app/5_pages/App/App'));
const Zero = loadable(() => import('./app/5_pages/ZeroPage/ZeroPage'), {
  resolveComponent: components => components.ZeroPage,
});

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/zero',
        element: <Zero />,
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
    <RouterProvider router={router}>
       <ApolloProvider client={rskClient}>
        <TransactionProvider>
          <App />
        </TransactionProvider>
        <OnboardProvider />
      </ApolloProvider>
    </RouterProvider>
    <OnboardProvider onboard={onboard} />
  </React.StrictMode>,
);
