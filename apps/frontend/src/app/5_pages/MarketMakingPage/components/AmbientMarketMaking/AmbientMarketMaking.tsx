import { useQuery } from '@tanstack/react-query';

import React, { FC, useMemo, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import {
  Heading,
  Icon,
  IconNames,
  Input,
  InputSize,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../../../config/chains';

import { MarketMakingNetworkBanner } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner';
import { BOB_STORAGE_KEY } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner.constants';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { loadIndexer } from '../../../../../lib/indexer';
import { translations } from '../../../../../locales/i18n';
import { AmbientPoolsTable } from './components/AmbientPoolsTable/AmbientPoolsTable';
import { BOBFusionSeasonBanner } from './components/BOBFusionSeasonBanner/BOBFusionSeasonBanner';

export const AmbientMarketMaking: FC = () => {
  const chainId = useCurrentChain();

  const { data: value } = useQuery({
    queryKey: ['mm', chainId],
    initialData: [],
    queryFn: async () => {
      return (await loadIndexer(chainId).pools.list()).sort((a, b) =>
        a.base.symbol < b.base.symbol ? -1 : 1,
      );
    },
  });

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
        <BOBFusionSeasonBanner />
        <MarketMakingNetworkBanner
          requiredChainId={RSK_CHAIN_ID}
          storageKey={BOB_STORAGE_KEY}
        />

        <div className="text-gray-10 mb-4">
          <Heading className="text-center mb-4 lg:text-2xl">
            {t(translations.ambientMarketMaking.title)}
          </Heading>

          <div className="w-full my-4">
            <div className="relative flex items-center">
              <Icon
                className="absolute left-1.5 z-10"
                icon={IconNames.FILTER}
                size={16}
                viewBox="0 0 16 16"
              />
              <Input
                value={searchInputValue}
                className="w-full"
                classNameInput="pl-8"
                onChangeText={setSearchInputValue}
                size={InputSize.large}
                placeholder={t(
                  translations.marketMakingPage.searchInputPlaceholder,
                )}
              />
            </div>
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
