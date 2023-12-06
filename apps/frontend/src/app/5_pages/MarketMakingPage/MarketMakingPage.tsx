import React, { FC, useCallback, useEffect, useState } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { PoolsTable } from './components/PoolsTable/PoolsTable';
import { Promotions } from './components/Promotions/Promotions';

const MarketMakingPage: FC = () => {
  const [activePool, setActivePool] = useState('');
  const [isPromoCardClicked, setIsPromoCardClicked] = useState(false);

  const setActivePoolKey = useCallback(
    (poolKey: string) => setActivePool(activePool === poolKey ? '' : poolKey),
    [activePool],
  );

  useEffect(() => {
    if (activePool) {
      setIsPromoCardClicked(false);
    }
  }, [activePool]);

  return (
    <>
      <Helmet>
        <title>{t(translations.marketMakingPage.meta.title)}</title>
      </Helmet>

      <div className="w-full flex flex-col items-center text-gray-10 mt-6 sm:mt-24 max-w-[74.75rem]">
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

        <PoolsTable
          setActivePool={setActivePoolKey}
          shouldScroll={isPromoCardClicked}
          activePool={activePool}
        />
      </div>
    </>
  );
};

export default MarketMakingPage;
