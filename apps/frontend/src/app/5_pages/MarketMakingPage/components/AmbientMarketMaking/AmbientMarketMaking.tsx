import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../../../locales/i18n';
import { AmbientPoolsTable } from './components/AmbientPoolsTable/AmbientPoolsTable';
import { RSKBanner } from './components/RSKBanner/RSKBanner';

export const AmbientMarketMaking: FC = () => {
  return (
    <>
      <Helmet>
        <title>{t(translations.ambientMarketMaking.meta.title)}</title>
      </Helmet>

      <div className="w-full flex flex-col items-center text-gray-10 mt-6 mb-4 sm:mt-9 max-w-[74.75rem]">
        <Heading className="text-center mb-1 lg:mb-3 text-base lg:text-2xl">
          {t(translations.ambientMarketMaking.title)}
        </Heading>

        <Paragraph
          className="text-center mb-5 lg:mb-9"
          size={ParagraphSize.base}
        >
          {t(translations.ambientMarketMaking.subtitle)}
        </Paragraph>

        <RSKBanner />

        <AmbientPoolsTable />
      </div>
    </>
  );
};
