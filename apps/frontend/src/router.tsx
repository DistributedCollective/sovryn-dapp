import React from 'react';

import {
  createBrowserRouter,
  createHashRouter,
  redirect,
} from 'react-router-dom';

import { PageContainer } from './app/4_templates';
import { EmailVerificationStateContainer } from './app/4_templates/EmailVerificationStateContainer/EmailVerificationStateContainer';
import BitocracyPage from './app/5_pages/BitocracyPage/BitocracyPage';
import { earnPageLoader } from './app/5_pages/EarnPage/loader';
import { EmailDuplicateVerifiedPage } from './app/5_pages/EmailDuplicateVerifiedPage/EmailDuplicateVerifiedPage';
import { EmailErrorPage } from './app/5_pages/EmailErrorPage/EmailErrorPage';
import { EmailUnsubscribedAllPage } from './app/5_pages/EmailUnsubscribedAllPage/EmailUnsubscribedAllPage';
import { EmailUnsubscribedPage } from './app/5_pages/EmailUnsubscribedPage/EmailUnsubscribedPage';
import { EmailVerifiedPage } from './app/5_pages/EmailVerifiedPage/EmailVerifiedPage';
import { ErrorPage } from './app/5_pages/ErrorPage/ErrorPage';
import { zeroPageLoader } from './app/5_pages/ZeroPage/loader';
import { isIPFSBuild } from './utils/helpers';
import { loadable } from './utils/loadable';

const Zero = loadable(() => import('./app/5_pages/ZeroPage/ZeroPage'));

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
const RewardsPage = loadable(
  () => import('./app/5_pages/RewardsPage/RewardsPage'),
);
const LendPage = loadable(() => import('./app/5_pages/LendPage/LendPage'));
const StakePage = loadable(() => import('./app/5_pages/StakePage/StakePage'));

const routes = [
  {
    path: '/',
    element: (
      <PageContainer
        className="flex flex-col"
        contentClassName="justify-center"
      />
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        element: <Zero />,
        index: true,
        loader: zeroPageLoader,
      },
      {
        path: '/borrow',
        element: <Zero />,
        loader: zeroPageLoader,
      },
      {
        path: '/earn/stability-pool',
        element: <EarnPage />,
        loader: earnPageLoader,
      },
      {
        path: '/earn/lend',
        element: <LendPage />,
      },
      {
        path: '/earn',
        loader: () => redirect('/earn/lend'),
      },
      {
        path: '/convert',
        element: <ConvertPage />,
      },
      {
        path: '/bitocracy',
        element: <BitocracyPage />,
      },
      {
        path: '/history',
        element: <HistoryPage />,
      },
      {
        path: '/rewards',
        element: <RewardsPage />,
        loader: zeroPageLoader,
      },
      {
        path: '/earn/staking',
        element: <StakePage />,
      },
    ],
  },
  {
    element: <PageContainer contentClassName="container" />,
    children: [
      {
        path: '/policies/terms-of-service',
        element: <TermsOfUse />,
      },
      {
        path: '/policies/privacy-policy',
        element: <PrivacyPolicy />,
      },
    ],
  },
  {
    element: <EmailVerificationStateContainer contentClassName="container" />,
    children: [
      {
        path: '/notifications/error',
        element: <EmailErrorPage />,
      },
      {
        path: '/notifications/verified',
        element: <EmailVerifiedPage />,
      },
      {
        path: '/notifications/duplicate',
        element: <EmailDuplicateVerifiedPage />,
      },
      {
        path: '/notifications/unsubscribed',
        element: <EmailUnsubscribedPage />,
      },
      {
        path: '/notifications/unsubscribed-all',
        element: <EmailUnsubscribedAllPage />,
      },
    ],
  },
];

const createRouter = isIPFSBuild() ? createHashRouter : createBrowserRouter;

export const router = createRouter(routes);
