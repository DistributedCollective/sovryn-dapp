import React, { FC, PropsWithChildren } from 'react';

import { useTranslation } from 'react-i18next';

import { Button } from '@sovryn/ui';
import { WalletIdentity } from '@sovryn/ui';

import { translations } from '../../../locales/i18n';
import { WalletBalance } from '../WalletBalance/WalletBalance';

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
        balance={<WalletBalance />}
        submenuLabels={{
          copyAddress: t(translations.connectWalletButton.copyAddress),
          disconnect: t(translations.connectWalletButton.disconnect),
        }}
      />
    );
  }
};
