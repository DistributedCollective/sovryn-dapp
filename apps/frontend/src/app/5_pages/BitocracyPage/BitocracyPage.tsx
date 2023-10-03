import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import LiveProposals from './components/LiveProposals/LiveProposals';
import PastProposals from './components/PastProposals/PastProposals';

const pageTranslations = translations.bitocracyPage;

const BitocracyPage: FC = () => {
  return (
    <>
      <Helmet>
        <title>{t(pageTranslations.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center text-gray-10 mt-9 sm:mt-24">
        <Heading className="text-base sm:text-2xl font-medium">
          {t(pageTranslations.title)}
        </Heading>
        <Paragraph
          size={ParagraphSize.base}
          className="mt-2.5 sm:mt-4 sm:text-base font-medium"
        >
          {t(pageTranslations.subtitle)}
        </Paragraph>
        <LiveProposals />
        <PastProposals />
      </div>
    </>
  );
};

export default BitocracyPage;
