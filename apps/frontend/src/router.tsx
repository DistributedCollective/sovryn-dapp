import loadable from '@loadable/component';

import React from 'react';

import { createBrowserRouter } from 'react-router-dom';

import { PageContainer } from './app/4_templates';
import { ErrorPage } from './app/5_pages/ErrorPage/ErrorPage';
import { zeroPageLoader } from './app/5_pages/ZeroPage/loader';

const Zero = loadable(() => import('./app/5_pages/ZeroPage/ZeroPage'), {
  resolveComponent: components => components.ZeroPage,
});

const Debug = loadable(() => import('./app/5_pages/App/App'));
const EarnPage = loadable(() => import('./app/5_pages/EarnPage/EarnPage'));
const ConvertPage = loadable(
  () => import('./app/5_pages/ConvertPage/ConvertPage'),
);
const HistoryPage = loadable(
  () => import('./app/5_pages/HistoryPage/HistoryPage'),
);

const PrivacyPolicy = loadable(
  () => import('./app/5_pages/PrivacyPolicy/PrivacyPolicy'),
);
const TermsOfUse = loadable(
  () => import('./app/5_pages/TermsOfUse/TermsOfUse'),
);

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PageContainer className="flex flex-col" />,
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Zero />,
        index: true,
        loader: zeroPageLoader,
      },
      {
        path: '/earn',
        element: <EarnPage />,
      },
      {
        path: '/convert',
        element: <ConvertPage />,
      },
      {
        path: '/history',
        element: <HistoryPage />,
      },
      {
        path: '/debug-content',
        element: <Debug />,
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
