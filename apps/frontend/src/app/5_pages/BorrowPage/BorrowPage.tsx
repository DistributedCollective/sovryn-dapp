import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph, ParagraphSize } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { BorrowAssetsTable } from './components/BorrowAssetsTable/BorrowAssetsTable';
import { OpenLoansTable } from './components/OpenLoansTable/OpenLoansTable';

const BorrowPage: FC = () => (
  <>
    <Helmet>
      <title>{t(translations.fixedInterestPage.meta.title)}</title>
    </Helmet>

    <div className="px-0 container md:mx-9 mx-0 md:mb-2 mt-4 mb-7">
      <Heading className="text-center mb-3 lg:text-2xl">
        {t(translations.fixedInterestPage.title)}
      </Heading>

      <Paragraph
        className="text-center mb-6 lg:mb-10"
        size={ParagraphSize.base}
      >
        {t(translations.fixedInterestPage.subtitle)}
      </Paragraph>

      <div className="w-full">
        <OpenLoansTable />
        <BorrowAssetsTable />
      </div>
    </div>
  </>
);

export default BorrowPage;
