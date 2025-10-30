import React, { FC, useCallback, useEffect, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import {
  Heading,
  Input,
  InputSize,
  Paragraph,
  ParagraphSize,
} from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { MarketMakingNetworkBanner } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner';
import { RSK_STORAGE_KEY } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner.constants';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { PoolsTable } from '../PoolsTable/PoolsTable';

export const MarketMaking: FC = () => {
  const { isMobile } = useIsMobile();
  const [activePool, setActivePool] = useState('');
  const [isPromoCardClicked, setIsPromoCardClicked] = useState(false);
  const [searchInputValue, setSearchInputValue] = useState('');

  const setActivePoolKey = useCallback(
    (poolKey: string) => setActivePool(activePool === poolKey ? '' : poolKey),
    [activePool],
  );

  useEffect(() => {
    if (activePool && !isMobile) {
      setIsPromoCardClicked(false);
    } else {
      setActivePool('');
    }
  }, [activePool, isMobile]);

  return (
    <>
      <Helmet>
        <title>{t(translations.marketMakingPage.meta.title)}</title>
      </Helmet>
      <div className="w-full max-w-[74.75rem]">
        <MarketMakingNetworkBanner
          requiredChainId={BOB_CHAIN_ID}
          storageKey={RSK_STORAGE_KEY}
        />
        <div className="flex flex-col items-center text-gray-10">
          <Heading className="text-center mb-4 lg:text-2xl">
            {t(translations.marketMakingPage.title)}
          </Heading>

          <Paragraph
            className="text-center mb-6 lg:mb-10"
            size={ParagraphSize.base}
          >
            {t(translations.marketMakingPage.subtitle)}
          </Paragraph>

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
          <PoolsTable
            setActivePool={setActivePoolKey}
            shouldScroll={isPromoCardClicked}
            activePool={activePool}
            filter={searchInputValue}
          />
        </div>
      </div>
    </>
  );
};
