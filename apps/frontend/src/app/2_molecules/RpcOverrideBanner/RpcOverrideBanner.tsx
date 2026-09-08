import React, { FC } from 'react';

import { t } from 'i18next';

import { Icon, IconNames, Paragraph } from '@sovryn/ui';

import { RSK_RPC_OVERRIDE } from '../../../constants/infrastructure/rsk';
import { translations } from '../../../locales/i18n';

/**
 * Says on screen that the numbers are not mainnet's.
 *
 * A build with the RSK RPC override in force reads every balance, rate and
 * vault row from a fork while the wallet signs against the real network, and
 * nothing else on the page distinguishes the two. Deliberately not
 * dismissible: the confusion it prevents lasts as long as the session does.
 */
export const RpcOverrideBanner: FC = () => {
  if (!RSK_RPC_OVERRIDE) {
    return null;
  }

  return (
    <div
      className="mx-auto w-full max-w-5xl px-4 mt-4"
      data-test-id="rpc-override-banner"
    >
      <div className="flex flex-row items-center gap-2 rounded-lg bg-primary-75 p-3 text-white">
        <Icon icon={IconNames.WARNING} size={18} />
        <Paragraph>
          {t(translations.rpcOverrideBanner.content, {
            rpc: RSK_RPC_OVERRIDE,
            // The value is a URL and lands in a text node, which React escapes
            // on its own. i18next's HTML escaping would print the slashes as
            // entities and leave the address unreadable.
            interpolation: { escapeValue: false },
          })}
        </Paragraph>
      </div>
    </div>
  );
};
