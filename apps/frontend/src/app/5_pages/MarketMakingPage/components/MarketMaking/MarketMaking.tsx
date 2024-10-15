import React, { FC, useCallback, useEffect, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { BOB_CHAIN_ID } from '../../../../../config/chains';

import { MarketMakingNetworkBanner } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner';
import { RSK_STORAGE_KEY } from '../../../../2_molecules/MarketMakingNetworkBanner/MarketMakingNetworkBanner.constants';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { translations } from '../../../../../locales/i18n';
import { PoolsTable } from '../PoolsTable/PoolsTable';
import { Promotions } from '../Promotions/Promotions';

export const MarketMaking: FC = () => {
  const { isMobile } = useIsMobile();
  const [activePool, setActivePool] = useState('');
  const [isPromoCardClicked, setIsPromoCardClicked] = useState(false);

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
        <div className="flex flex-col items-center text-gray-10 mt-6 mb-4 sm:mt-9">
          <Heading className="text-center mb-1 lg:mb-3 text-base lg:text-2xl">
            {t(translations.marketMakingPage.title)}
          </Heading>

          <Paragraph
            className="text-center mb-5 lg:mb-10"
            size={ParagraphSize.base}
          >
            {t(translations.marketMakingPage.subtitle)}
          </Paragraph>

          <Promotions
            setActivePool={setActivePool}
            onClick={setIsPromoCardClicked}
          />

          {/* <Paragraph
            className="pl-2 w-full text-base font-medium text-left mb-4 mt-8"
            size={ParagraphSize.base}
          >
            {t(translations.marketMakingPage.newPairs)}
          </Paragraph>
          <PoolsTable
            setActivePool={setActivePoolKey}
            shouldScroll={isPromoCardClicked}
            activePool={activePool}
            showHighlightedPools
          />

          <Paragraph
            className="pl-2 w-full text-base font-medium text-left mb-4 mt-8"
            size={ParagraphSize.base}
          >
            {t(translations.marketMakingPage.allPairs)}
          </Paragraph> */}
          <PoolsTable
            setActivePool={setActivePoolKey}
            shouldScroll={isPromoCardClicked}
            activePool={activePool}
          />
        </div>
      </div>
    </>
  );
};
