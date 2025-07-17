import React from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { Heading, HeadingType, Link } from '@sovryn/ui';

import { HELPDESK_LINK } from '../../../../constants/links';
import { translations } from '../../../../locales/i18n';

type InstructionsProps = {
  isReceive?: boolean;
};

export const Instructions: React.FC<InstructionsProps> = () => {
  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium leading-[1.375rem]">
        {t(translations.erc20Bridge.instructions.title)}:
      </Heading>

      <ul className="list-disc list-inside text-xs leading-5 font-medium text-gray-30 mt-4 mb-12">
        <li className="mb-4">
          {t(translations.erc20Bridge.instructions['1'])}
        </li>
        <li className="mb-4">
          {t(translations.erc20Bridge.instructions['2'])}
        </li>
        <li className="mb-4">
          {t(translations.erc20Bridge.instructions['3'])}
        </li>
        <li className="mb-4">
          {t(translations.erc20Bridge.instructions['4'])}
        </li>
        <li className="mb-4">
          <Trans
            i18nKey={t(translations.erc20Bridge.instructions['5'])}
            tOptions={{ hours: 1.5 }}
            components={[
              <Link
                text={t(
                  translations.erc20Bridge.instructions.createSupportTicketCta,
                )}
                href={HELPDESK_LINK}
              />,
            ]}
          />
        </li>
      </ul>
    </>
  );
};
