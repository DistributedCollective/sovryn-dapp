import React, { FC, PropsWithChildren } from 'react';

import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { Button, Menu, MenuItem, WalletIdentity } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';

export type ConnectWalletButtonProps = {
  onConnect: () => void;
  onDisconnect: () => void;
  address: string | undefined;
  pending?: boolean;
  className?: string;
  dataLayoutId?: string;
};

export const ConnectWalletButton: FC<
  PropsWithChildren<ConnectWalletButtonProps>
> = ({
  address,
  pending,
  onDisconnect,
  onConnect,
  className,
  dataLayoutId,
}) => {
  const { t } = useTranslation();
  if (!address) {
    return (
      <Button
        text={t(translations.connectWalletButton.connect)}
        onClick={onConnect}
        className={className}
        dataLayoutId={dataLayoutId}
        disabled={pending}
      />
    );
  } else {
    return (
      <WalletIdentity
        onDisconnect={onDisconnect}
        address={address}
        dataLayoutId={dataLayoutId}
        className={className}
        balance={
          <Menu className="mb-4">
            <Link to="/rewards" className="no-underline">
              <MenuItem text={t(translations.connectWalletButton.rewards)} />
            </Link>
            <Link to="/notifications" className="no-underline">
              <MenuItem
                text={t(translations.connectWalletButton.notifications)}
              />
            </Link>
            <Link to="/history" className="no-underline">
              <MenuItem text={t(translations.connectWalletButton.history)} />
            </Link>
          </Menu>
        }
        submenuLabels={{
          copyAddress: t(translations.connectWalletButton.copyAddress),
          disconnect: t(translations.connectWalletButton.disconnect),
        }}
      />
    );
  }
};
