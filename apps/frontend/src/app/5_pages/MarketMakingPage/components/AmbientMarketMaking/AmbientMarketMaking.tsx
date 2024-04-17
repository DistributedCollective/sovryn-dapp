import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { MarketMakingNetworkBanner } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner';
import { BOB_STORAGE_KEY } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner.constants';
import { translations } from '../../../../../locales/i18n';
import { AmbientPoolsTable } from './components/AmbientPoolsTable/AmbientPoolsTable';

export const AmbientMarketMaking: FC = () => {
  return (
    <>
      <Helmet>
        <title>{t(translations.ambientMarketMaking.meta.title)}</title>
      </Helmet>

      <div className="w-full max-w-[74.75rem]">
        <MarketMakingNetworkBanner
          requiredChainId={RSK_CHAIN_ID}
          storageKey={BOB_STORAGE_KEY}
        />
        <div className="text-gray-10 mt-6 mb-4 sm:mt-9">
          <Heading className="text-center mb-1 lg:mb-3 text-base lg:text-2xl">
            {t(translations.ambientMarketMaking.title)}
          </Heading>

          <Paragraph
            className="text-center mb-5 lg:mb-9"
            size={ParagraphSize.base}
          >
            {t(translations.ambientMarketMaking.subtitle)}
          </Paragraph>

          <AmbientPoolsTable />
        </div>
      </div>
    </>
  );
};
