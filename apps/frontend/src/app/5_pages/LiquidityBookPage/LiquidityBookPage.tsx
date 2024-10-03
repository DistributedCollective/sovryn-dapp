import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import { translations } from '../../../locales/i18n';
import { LiquidityBookModal } from './components/AddLiquidityModal/AddLiquidityModal';
import { BalanceRenderer } from './components/BalanceRenderer/BalanceRenderer';
import { LiquidityBookFrame } from './components/LiquidityBookFrame/LiquidityBookFrame';

const LiquidityBookPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.liquidityBookPage.meta.title)}</title>
    </Helmet>
    <div className="w-full max-w-[74.75rem]">
      <div className="flex flex-col items-center text-gray-10 mt-6 mb-4 sm:mt-9">
        <NetworkBanner requiredChainId={BOB_CHAIN_ID}>
          <Heading className="text-center mb-3 lg:text-2xl">
            {t(translations.liquidityBookPage.title)}
          </Heading>

          <BalanceRenderer />

          <LiquidityBookFrame />
        </NetworkBanner>
      </div>
    </div>
    <LiquidityBookModal />
  </>
);

export default LiquidityBookPage;
