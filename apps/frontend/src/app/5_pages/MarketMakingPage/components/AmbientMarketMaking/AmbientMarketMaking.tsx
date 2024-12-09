import React, { FC, useMemo } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { MarketMakingNetworkBanner } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner';
import { BOB_STORAGE_KEY } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner.constants';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { translations } from '../../../../../locales/i18n';
import { AmbientPoolsTable } from './components/AmbientPoolsTable/AmbientPoolsTable';
import { PoolListGroup } from './utils/AmbientLiquidityPool';
import { AmbientLiquidityPoolDictionary } from './utils/AmbientLiquidityPoolDictionary';

export const AmbientMarketMaking: FC = () => {
  const chainId = useCurrentChain();
  const newPools = useMemo(
    () => AmbientLiquidityPoolDictionary.list(chainId, PoolListGroup.new),
    [chainId],
  );
  const allPools = useMemo(
    () => AmbientLiquidityPoolDictionary.list(chainId),
    [chainId],
  );

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

          {newPools.length > 0 && (
            <>
              <Paragraph
                className="pl-2 w-full text-base font-medium text-left mb-4 mt-8"
                size={ParagraphSize.base}
              >
                {t(translations.marketMakingPage.newPairs)}
              </Paragraph>

              <AmbientPoolsTable items={newPools} />

              <Paragraph
                className="pl-2 w-full text-base font-medium text-left mb-4 mt-8"
                size={ParagraphSize.base}
              >
                {t(translations.marketMakingPage.allPairs)}
              </Paragraph>
            </>
          )}

          <AmbientPoolsTable items={allPools} />
        </div>
      </div>
    </>
  );
};
