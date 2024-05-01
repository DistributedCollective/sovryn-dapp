import React, { FC, createRef, useMemo } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { RSK_CHAIN_ID } from '../../../config/chains';

import { NetworkBanner } from '../../2_molecules/NetworkBanner/NetworkBanner';
import {
  SECTION_LINKS_LABELS,
  pageTranslations,
} from './ProtocolDataPage.constants';
import { EcosystemStatistics } from './components/EcosystemStatistics/EcosystemStatistics';
import { LendAndBorrow } from './components/LendAndBorrow/LendAndBorrow';
import { MarketMaking } from './components/MarketMaking/MarketMaking';
import { PricesBy24hChange } from './components/PricesBy24hChange/PricesBy24hChange';
import { SectionLinks } from './components/SectionLinks/SectionLinks';

const ProtocolDataPage: FC = () => {
  const refs = useMemo(
    () => ({
      ecosystemStatisticsRef: createRef<HTMLDivElement>(),
      pricesBy24hChangeRef: createRef<HTMLDivElement>(),
      lendAndBorrowRef: createRef<HTMLDivElement>(),
      marketMakingRef: createRef<HTMLDivElement>(),
    }),
    [],
  );

  const sections = useMemo(
    () => [
      {
        ref: refs.pricesBy24hChangeRef,
        content: <PricesBy24hChange />,
      },
      {
        ref: refs.lendAndBorrowRef,
        content: <LendAndBorrow />,
      },
      {
        ref: refs.marketMakingRef,
        content: <MarketMaking />,
      },
      {
        ref: refs.ecosystemStatisticsRef,
        content: <EcosystemStatistics />,
      },
    ],
    [refs],
  );

  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>

      <div className="w-full  text-gray-10 md:mx-9 mx-0 md:mb-2 md:mt-7 mt-4 mb-7 max-w-6xl">
        <NetworkBanner
          requiredChainId={RSK_CHAIN_ID}
          childClassName="grid grid-cols-1 justify-center"
        >
          <Heading className="text-center mb-3 lg:text-2xl text-base font-medium">
            {t(pageTranslations.title)}
          </Heading>

          <Paragraph
            className="text-center mb-6 lg:mb-9 font-semibold px-4 sm:px-0"
            size={ParagraphSize.base}
          >
            {t(pageTranslations.subtitle)}
          </Paragraph>

          <SectionLinks
            refs={Object.values(refs)}
            labels={SECTION_LINKS_LABELS}
          />

          {sections.map((section, index) => (
            <div key={index} ref={section.ref}>
              {section.content}
            </div>
          ))}
        </NetworkBanner>
      </div>
    </>
  );
};

export default ProtocolDataPage;
