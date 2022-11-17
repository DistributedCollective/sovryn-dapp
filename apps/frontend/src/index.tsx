import loadable from '@loadable/component';

import React from 'react';

import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import setupChains from '@sovryn/ethers-provider';
import { OnboardProvider } from '@sovryn/onboard-react';

import { MainLayout } from './app/4_templates/MainLayout/MainLayout';
import { ErrorPage } from './app/5_pages/ErrorPage/ErrorPage';
import { chains } from './config/chains';
import { onboard } from './lib/connector';
import './locales/i18n';
import './styles/tailwindcss/index.css';

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

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <OnboardProvider onboard={onboard} />
  </React.StrictMode>,
);
