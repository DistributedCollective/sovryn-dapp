import React from 'react';

import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { Trans } from 'react-i18next';

import { Heading, Link, Paragraph } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { helpdeskLink } from '../../../utils/constants';

const LINK_TEXT = 'help.sovryn.app';

export const EmailErrorPage = () => {
  return (
    <>
      <Helmet>
        <title>{t(translations.emailNotifications.errorPage.meta.title)}</title>
      </Helmet>
      <div className="w-full flex flex-col items-center justify-center m-auto max-w-[51rem] text-gray-10 px-7 py-11 lg:py-16 bg-gray-90 mt-24 mb-5 lg:mt-[15.875rem] rounded">
        <Heading className="font-medium text-2xl mb-10 lg:mb-12 text-center">
          {t(translations.emailNotifications.errorPage.title)}
        </Heading>
        <Paragraph className="max-w-md leading-[1.125rem] font-normal text-sm lg:text-base text-center px-4 lg:px-6">
          <Trans
            i18nKey={translations.emailNotifications.errorPage.subtitle}
            components={[
              <Link
                className="leading-[1.125rem] font-normal text-sm lg:text-base text-center"
                text={LINK_TEXT}
                href={helpdeskLink}
              />,
            ]}
          />
        </Paragraph>
      </div>
    </>
  );
};
