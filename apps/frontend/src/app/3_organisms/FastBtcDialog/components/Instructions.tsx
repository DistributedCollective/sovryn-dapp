import React from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { Heading, HeadingType, Link } from '@sovryn/ui';

import { translations } from '../../../../locales/i18n';
import { helpdeskLink } from '../../../../utils/constants';

const translation = translations.fastBtc.instructions;

export const Instructions: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium leading-[1.375rem]">
        {t(translation.title)}
      </Heading>

      <ul className="list-disc list-inside text-xs leading-5 font-medium text-gray-30 mt-4 mb-12">
        <li className="mb-4">{t(translation.line1)}</li>
        <li className="mb-4">{t(translation.line2)}</li>
        <li className="mb-4">{t(translation.line3)}</li>
        <li className="mb-4">{t(translation.line4, { hours: 1.5 })}</li>
        <li>
          <Trans
            i18nKey={translation.line5}
            tOptions={{ hours: 1.5 }}
            components={[
              <Link text={t(translation.line5cta)} href={helpdeskLink} />,
            ]}
          />
        </li>
      </ul>
    </>
  );
};
