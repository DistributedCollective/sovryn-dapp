import React, { FC, PropsWithChildren } from 'react';

import { Button } from '@sovryn/ui';
import { WalletIdentity } from '@sovryn/ui';

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
  if (!address) {
    return (
      <Button
        text="Connect wallet"
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
          copyAddress: 'Copy Address',
          disconnect: 'Disconnect',
        }}
      />
    );
  }
};
