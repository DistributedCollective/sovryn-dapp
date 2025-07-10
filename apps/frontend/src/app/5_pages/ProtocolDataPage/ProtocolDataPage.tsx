import React, { FC, createRef, useMemo } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { useCurrentChain } from '../../../hooks/useChainStore';
import { isBobChain } from '../../../utils/chain';
import { pageTranslations } from './ProtocolDataPage.constants';
import { EcosystemStatistics } from './components/EcosystemStatistics/EcosystemStatistics';
import { LendAndBorrow } from './components/LendAndBorrow/LendAndBorrow';
import { MarketMaking } from './components/MarketMaking/MarketMaking';
import { PricesBy24hChange } from './components/PricesBy24hChange/PricesBy24hChange';
import { SectionLinks } from './components/SectionLinks/SectionLinks';

const ProtocolDataPage: FC = () => {
  const chainId = useCurrentChain();

  const sections = useMemo(() => {
    if (isBobChain(chainId)) {
      return [
        {
          ref: createRef<HTMLDivElement>(),
          content: <EcosystemStatistics />,
          title: t(pageTranslations.sections.ecosystemStatistics),
        },
      ];
    }

    return [
      {
        ref: createRef<HTMLDivElement>(),
        content: <PricesBy24hChange />,
        title: t(pageTranslations.pricesBy24hChange.title),
      },
      {
        ref: createRef<HTMLDivElement>(),
        content: <LendAndBorrow />,
        title: t(pageTranslations.lendAndBorrow.title),
      },
      {
        ref: createRef<HTMLDivElement>(),
        content: <MarketMaking />,
        title: t(pageTranslations.marketMaking.title),
      },
      {
        ref: createRef<HTMLDivElement>(),
        content: <EcosystemStatistics />,
        title: t(pageTranslations.sections.ecosystemStatistics),
      },
    ];
  }, [chainId]);

  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>

      <div className="w-full  text-gray-10 md:mx-9 mx-0 md:mb-2 md:mt-7 mt-4 mb-7 max-w-6xl">
        <Heading className="text-center mb-4 lg:text-2xl text-base font-medium">
          {t(pageTranslations.title)}
        </Heading>

        <Paragraph
          className="text-center mb-6 lg:mb-10 font-semibold px-4 sm:px-0"
          size={ParagraphSize.base}
        >
          {t(pageTranslations.subtitle)}
        </Paragraph>

        <SectionLinks
          refs={sections.map(section => section.ref)}
          labels={sections.map(section => section.title)}
        />

        {sections.map((section, index) => (
          <div key={index} ref={section.ref}>
            {section.content}
          </div>
        ))}
      </div>
    </>
  );
};

export default ProtocolDataPage;
