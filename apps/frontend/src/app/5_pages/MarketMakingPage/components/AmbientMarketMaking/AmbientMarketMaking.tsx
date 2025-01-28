import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import {
  Heading,
  Input,
  InputSize,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { MarketMakingNetworkBanner } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner';
import { BOB_STORAGE_KEY } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner.constants';
import { useCacheCall } from '../../../../../hooks';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { loadIndexer } from '../../../../../lib/indexer';
import { translations } from '../../../../../locales/i18n';
import { AmbientPoolsTable } from './components/AmbientPoolsTable/AmbientPoolsTable';

export const AmbientMarketMaking: FC = () => {
  const chainId = useCurrentChain();
  const { value } = useCacheCall(
    'mm',
    chainId,
    async () => {
      return (await loadIndexer(chainId).pools.list()).sort((a, b) =>
        a.base.symbol < b.base.symbol ? -1 : 1,
      );
    },
    [chainId],
    [],
  );

  const newPools = useMemo(
    () => (value ?? []).filter(pool => pool.featured),
    [value],
  );

  const [searchInputValue, setSearchInputValue] = useState('');

  const allPools = useMemo(() => value ?? [], [value]);

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

          <div className="w-full my-4">
            <Input
              value={searchInputValue}
              className="w-full"
              onChangeText={setSearchInputValue}
              size={InputSize.large}
              placeholder={t(
                translations.marketMakingPage.searchInputPlaceholder,
              )}
            />
          </div>

          {newPools.length > 0 && (
            <>
              <Paragraph
                className="pl-2 w-full text-base font-medium text-left mb-4 mt-8"
                size={ParagraphSize.base}
              >
                {t(translations.marketMakingPage.newPairs)}
              </Paragraph>

              <AmbientPoolsTable items={newPools} filter={searchInputValue} />

              <Paragraph
                className="pl-2 w-full text-base font-medium text-left mb-4 mt-8"
                size={ParagraphSize.base}
              >
                {t(translations.marketMakingPage.allPairs)}
              </Paragraph>
            </>
          )}

          <AmbientPoolsTable items={allPools} filter={searchInputValue} />
        </div>
      </div>
    </>
  );
};
