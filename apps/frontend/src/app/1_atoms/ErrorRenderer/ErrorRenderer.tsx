import React, { FC } from 'react';

import { t } from 'i18next';

import { Lottie } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';

type ErrorRendererProps = {
  error?: React.ReactNode;
};

export const ErrorRenderer: FC<ErrorRendererProps> = ({ error }) => {
  return (
    <div className="flex flex-col justify-center items-center flex-grow">
      <div className="text-center whitespace-normal px-4">
        <div className="w-full flex items-center justify-center">
          <div className="w-64 h-64">
            <Lottie animation="spaceScene" />
          </div>
        </div>
        <h1>{t(translations.errorPage.title)}</h1>
        <p>{t(translations.errorPage.description)}</p>
        {error && <div>{error}</div>}
      </div>
    </div>
  );
};
