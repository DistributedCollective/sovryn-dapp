import React from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import { Heading, Paragraph } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';

export const EmailVerifiedPage = () => {
  return (
    <>
      <Helmet>
        <title>
          {t(translations.emailNotifications.verifyPage.meta.title)}
        </title>
      </Helmet>
      <div className="w-full flex flex-col items-center justify-center m-auto max-w-[51rem] text-gray-10 px-7 py-11 lg:py-16 bg-gray-90 mt-24 mb-5 lg:mt-[15.875rem] rounded">
        <Heading className="font-medium text-2xl mb-10 lg:mb-12 text-center">
          {t(translations.emailNotifications.verifyPage.title)}
        </Heading>
        <Paragraph className="max-w-xl leading-[1.125rem] font-normal text-sm lg:text-base text-center lg:px-4">
          {t(translations.emailNotifications.verifyPage.subtitle)}
        </Paragraph>
      </div>
    </>
  );
};
