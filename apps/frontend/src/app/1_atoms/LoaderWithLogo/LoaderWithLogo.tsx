import React, { FC } from 'react';

import { t } from 'i18next';

import { Lottie } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';

type LoaderWithLogoProps = {
  text?: React.ReactNode;
};

export const LoaderWithLogo: FC<LoaderWithLogoProps> = ({ text }) => (
  <div className="flex flex-col justify-center items-center flex-grow">
    <div className="w-64">
      <Lottie animation="loading" />
    </div>
    <div className="sv-loading-text">
      {text ? text : t(translations.loader.loading)}
    </div>
  </div>
);
