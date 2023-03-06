import React from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { Link } from '@sovryn/ui';

import { EmailContentRenderer } from '../../2_molecules/EmailContentRenderer/EmailContentRenderer';
import { translations } from '../../../locales/i18n';
import { helpdeskLink } from '../../../utils/constants';

const LINK_TEXT = 'help.sovryn.app';

export const EmailErrorPage = () => {
  return (
    <EmailContentRenderer
      metaTitle={t(translations.emailNotifications.errorPage.meta.title)}
      title={t(translations.emailNotifications.errorPage.title)}
      subtitle={
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
      }
    />
  );
};
