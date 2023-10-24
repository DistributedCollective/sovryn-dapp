import React, { useMemo } from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { Heading, HeadingType, Link } from '@sovryn/ui';

import { HELPDESK_LINK } from '../../../../constants/links';
import { translations } from '../../../../locales/i18n';

type InstructionsProps = {
  isReceive?: boolean;
};

export const Instructions: React.FC<InstructionsProps> = ({ isReceive }) => {
  const translation = useMemo(
    () =>
      isReceive
        ? translations.fastBtc.receiveInstructions
        : translations.fastBtc.sendInstructions,
    [isReceive],
  );

  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium leading-[1.375rem]">
        {t(translation.title)}:
      </Heading>

      <ul className="list-disc list-inside text-xs leading-5 font-medium text-gray-30 mt-4 mb-12">
        <li className="mb-4">{t(translation.line1)}</li>
        {!isReceive && (
          <li className="mb-4">
            {t(translations.fastBtc.sendInstructions.supportedFormats)}
          </li>
        )}
        <li className="mb-4">{t(translation.line2)}</li>
        <li className="mb-4">{t(translation.line3)}</li>
        <li className="mb-4">{t(translation.line4, { hours: 1.5 })}</li>
        <li>
          <Trans
            i18nKey={t(translation.line5)}
            tOptions={{ hours: 1.5 }}
            components={[
              <Link text={t(translation.line5cta)} href={HELPDESK_LINK} />,
            ]}
          />
        </li>
      </ul>
    </>
  );
};
