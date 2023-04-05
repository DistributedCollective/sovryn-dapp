import React, { FC } from 'react';

import { t } from 'i18next';

import { Heading, HeadingType, LottieAnimation, Paragraph } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';

type ErrorRendererProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  animation?: LottieAnimation;
  error?: React.ReactNode;
};

export const ErrorRenderer: FC<ErrorRendererProps> = ({
  title,
  description,
  error,
}) => (
  <div className="container flex flex-col justify-center items-center flex-grow py-12">
    <div className="text-center whitespace-normal px-4">
      <Heading
        type={HeadingType.h1}
        className="font-medium text-2xl mb-10 lg:mb-12 text-center"
      >
        {title ? title : t(translations.errorPage.title)}
      </Heading>

      <Paragraph className="max-w-xl font-normal text-sm lg:text-base text-center lg:px-4">
        {description ? description : t(translations.errorPage.description)}
      </Paragraph>
      {error}
    </div>
  </div>
);
