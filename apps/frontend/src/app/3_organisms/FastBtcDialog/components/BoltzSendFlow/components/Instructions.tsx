import React from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { Heading, HeadingType, Link } from '@sovryn/ui';

import { HELPDESK_LINK } from '../../../../../../constants/links';
import { translations } from '../../../../../../locales/i18n';

export const Instructions: React.FC = () => {
  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium leading-[1.375rem]">
        {t(translations.boltz.sendInstructions.title)}:
      </Heading>

      <ul className="list-disc list-inside text-xs leading-5 font-medium text-gray-30 mt-4 mb-12">
        <li className="mb-4">
          <Trans
            i18nKey={t(translations.boltz.sendInstructions.line1)}
            components={[
              <Link
                text={t(translations.boltz.sendInstructions.line1cta)}
                href={'https://boltz.exchange'}
              />,
            ]}
          />
        </li>
        <li className="mb-4">{t(translations.boltz.sendInstructions.line2)}</li>
        <li>
          <Trans
            i18nKey={t(translations.boltz.sendInstructions.line3)}
            components={[
              <Link
                text={t(translations.boltz.sendInstructions.line3cta)}
                href={HELPDESK_LINK}
              />,
            ]}
          />
        </li>
      </ul>
    </>
  );
};
