import React, { FC } from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { translations } from '../../../locales/i18n';

const BorrowPage: FC = () => {
  return (
    <>
      <Helmet>
        <title>{t(translations.fixedInterestPage.meta.title)}</title>
      </Helmet>

      <div>Borrow page</div>
    </>
  );
};

export default BorrowPage;
