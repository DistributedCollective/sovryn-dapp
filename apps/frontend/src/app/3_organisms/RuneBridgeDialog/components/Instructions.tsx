import React from 'react';

import { t } from 'i18next';
import { Trans } from 'react-i18next';

import { Heading, HeadingType, Link } from '@sovryn/ui';

import { HELPDESK_LINK } from '../../../../constants/links';
import { translations } from '../../../../locales/i18n';
import {
  MIN_POSTAGE_SATS,
  MIN_POSTAGE_BTC,
  ORD_WALLET_LINK,
} from '../constants';

type InstructionsProps = {
  isReceive?: boolean;
};

export const Instructions: React.FC<InstructionsProps> = ({ isReceive }) => {
  return (
    <>
      <Heading type={HeadingType.h2} className="font-medium leading-[1.375rem]">
        {t(translations.runeBridge.instructions.title)}:
      </Heading>

      <ul className="list-disc list-inside text-xs leading-5 font-medium text-gray-30 mt-4 mb-4">
        {isReceive ? (
          <>
            <li className="mb-4">
              {t(translations.runeBridge.instructions.receive.onlyRunes)}
            </li>
            <li className="mb-4">
              {t(
                translations.runeBridge.instructions.receive.onlySupportedRunes,
              )}
            </li>
            <li className="mb-4">
              {t(translations.runeBridge.instructions.receive.postage, {
                postageSat: MIN_POSTAGE_SATS,
                postageBtc: MIN_POSTAGE_BTC,
              })}
            </li>
          </>
        ) : (
          <>
            <li className="mb-4">
              <Trans
                i18nKey={t(translations.runeBridge.instructions.send.wallet)}
                components={[
                  <Link
                    text={t(
                      translations.runeBridge.instructions.send.walletCta,
                    )}
                    href={ORD_WALLET_LINK}
                  />,
                ]}
              />
            </li>
            <li className="mb-4">
              {t(translations.runeBridge.instructions.send.supportedFormats)}
            </li>
            <li className="mb-4">
              {t(translations.runeBridge.instructions.send.minAmount)}
            </li>
            <li className="mb-4">
              {t(translations.runeBridge.instructions.send.maxAmount)}
            </li>
          </>
        )}
        <li className="mb-4">
          {t(translations.runeBridge.instructions.upToNHours, { hours: 1.5 })}
        </li>
        <li>
          <Trans
            i18nKey={t(
              translations.runeBridge.instructions.createSupportTicket,
            )}
            tOptions={{ hours: 1.5 }}
            components={[
              <Link
                text={t(
                  translations.runeBridge.instructions.createSupportTicketCta,
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
