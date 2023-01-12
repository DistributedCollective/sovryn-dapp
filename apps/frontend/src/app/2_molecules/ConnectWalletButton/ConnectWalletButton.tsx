import React, { FC, PropsWithChildren, useReducer } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button, Menu, MenuItem, WalletIdentity } from '@sovryn/ui';

import { EmailNotificationSettingsDialog } from '../../3_organisms/EmailNotificationSettingsDialog/EmailNotificationSettingsDialog';
import { translations } from '../../../locales/i18n';
import { sovrynLinks } from '../../../utils/constants';

export type ConnectWalletButtonProps = {
  onConnect: () => void;
  onDisconnect: () => void;
  address: string | undefined;
  pending?: boolean;
  className?: string;
  dataAttribute?: string;
};

export const ConnectWalletButton: FC<
  PropsWithChildren<ConnectWalletButtonProps>
> = ({
  address,
  pending,
  onDisconnect,
  onConnect,
  className,
  dataAttribute,
}) => {
  const { t } = useTranslation();
  const [isOpen, toggle] = useReducer(state => !state, false);
  if (!address) {
    return (
      <Button
        text={t(translations.connectWalletButton.connect)}
        onClick={onConnect}
        className={className}
        dataAttribute={dataAttribute}
        disabled={pending}
      />
    );
  } else {
    return (
      <>
        <WalletIdentity
          onDisconnect={onDisconnect}
          address={address}
          dataAttribute={dataAttribute}
          className={className}
          content={
            <Menu className="mb-4">
              <MenuItem
                text={t(translations.connectWalletButton.rewards)}
                className="no-underline"
                href={`${sovrynLinks.dappAlpha}/rewards`}
                hrefExternal
              />
              <Link to="/history" className="no-underline">
                <MenuItem text={t(translations.connectWalletButton.history)} />
              </Link>
              <MenuItem
                text={t(translations.connectWalletButton.settings)}
                onClick={toggle}
              />
            </Menu>
          }
          submenuLabels={{
            copyAddress: t(translations.connectWalletButton.copyAddress),
            disconnect: t(translations.connectWalletButton.disconnect),
          }}
        />
        <EmailNotificationSettingsDialog isOpen={isOpen} onClose={toggle} />
      </>
    );
  }
};
