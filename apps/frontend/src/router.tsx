import React from 'react';

import {
  createBrowserRouter,
  createHashRouter,
  redirect,
} from 'react-router-dom';

import { PageContainer } from './app/4_templates';
import { EmailVerificationStateContainer } from './app/4_templates/EmailVerificationStateContainer/EmailVerificationStateContainer';
import AavePage from './app/5_pages/AavePage/AavePage';
import AaveReserveOverviewPage from './app/5_pages/AaveReserveOverviewPage/AaveReserveOverviewPage';
import { earnPageLoader } from './app/5_pages/EarnPage/loader';
import { EmailDuplicateVerifiedPage } from './app/5_pages/EmailDuplicateVerifiedPage/EmailDuplicateVerifiedPage';
import { EmailErrorPage } from './app/5_pages/EmailErrorPage/EmailErrorPage';
import { EmailUnsubscribedAllPage } from './app/5_pages/EmailUnsubscribedAllPage/EmailUnsubscribedAllPage';
import { EmailUnsubscribedPage } from './app/5_pages/EmailUnsubscribedPage/EmailUnsubscribedPage';
import { EmailVerifiedPage } from './app/5_pages/EmailVerifiedPage/EmailVerifiedPage';
import { ErrorPage } from './app/5_pages/ErrorPage/ErrorPage';
import { zeroPageLoader } from './app/5_pages/ZeroPage/loader';
import { CrocContextProvider } from './contexts/CrocContext';
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
const MarketMakingPage = loadable(
  () => import('./app/5_pages/MarketMakingPage/MarketMakingPage'),
);
const StakePage = loadable(() => import('./app/5_pages/StakePage/StakePage'));
const BorrowPage = loadable(
  () => import('./app/5_pages/BorrowPage/BorrowPage'),
);
const BitocracyPage = loadable(
  () => import('./app/5_pages/BitocracyPage/BitocracyPage'),
);
const ProposalPage = loadable(
  () => import('./app/5_pages/ProposalPage/ProposalPage'),
);
const LandingPage = loadable(
  () => import('./app/5_pages/LandingPage/LandingPage'),
);
const PortfolioPage = loadable(
  () => import('./app/5_pages/PortfolioPage/PortfolioPage'),
);
const ProtocolDataPage = loadable(
  () => import('./app/5_pages/ProtocolDataPage/ProtocolDataPage'),
);

const LeaderboardPage = loadable(
  () => import('./app/5_pages/LeaderboardPage/LeaderboardPage'),
);

const LeaderboardPointsPage = loadable(
  () => import('./app/5_pages/LeaderboardPointsPage/LeaderboardPointsPage'),
);

const ClaimLpPage = loadable(
  () => import('./app/5_pages/ClaimLpPage/ClaimLpPage'),
);

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
        index: true,
        element: <LandingPage />,
      },
      {
        path: '/convert',
        element: <ConvertPage />,
      },
      {
        path: '/borrow/aave',
        element: <AavePage />,
      },
      {
        path: '/borrow/line-of-credit',
        element: <Zero />,
        loader: zeroPageLoader,
      },
      {
        path: '/borrow/fixed-interest',
        element: <BorrowPage />,
      },
      {
        path: '/borrow',
        loader: () => redirect('/borrow/fixed-interest'),
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
        path: '/earn/lend/aave',
        element: <AavePage />,
      },
      {
        path: '/aave/reserve-overview',
        element: <AaveReserveOverviewPage />,
      },
      {
        path: '/earn/market-making',
        element: <MarketMakingPage />,
      },
      {
        path: '/earn',
        loader: () => redirect('/earn/lend'),
      },
      {
        path: '/bitocracy',
        element: <BitocracyPage />,
      },
      {
        path: '/bitocracy/:id',
        element: <ProposalPage />,
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
        path: '/portfolio',
        element: (
          <CrocContextProvider>
            <PortfolioPage />
          </CrocContextProvider>
        ),
        loader: zeroPageLoader,
      },
      {
        path: '/earn/staking',
        element: <StakePage />,
      },
      {
        path: '/powa',
        element: <LeaderboardPage />,
      },
      {
        path: '/bob-lp-points',
        element: <LeaderboardPointsPage />,
      },
      {
        path: '/stats',
        element: <ProtocolDataPage />,
      },
      {
        path: '/claim-lp',
        element: <ClaimLpPage />,
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
