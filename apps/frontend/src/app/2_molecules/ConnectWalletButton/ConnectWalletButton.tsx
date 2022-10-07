import React, { FC, PropsWithChildren } from 'react';

import { Button } from '@sovryn/ui';

import { WalletIdentity } from '../WalletIdentity/WalletIdentity';

export type ConnectWalletButtonProps = {
  onConnect: () => void;
  onDisconnect: () => void;
  address: string | undefined;
  className?: string;
  dataActionId?: string;
};

export const ConnectWalletButton: FC<
  PropsWithChildren<ConnectWalletButtonProps>
> = ({ address, onDisconnect, onConnect, className, dataActionId }) => {
  if (!address) {
    return (
      <Button
        text="Connect wallet"
        onClick={onConnect}
        className={className}
        dataActionId={dataActionId}
      />
    );
  } else {
    return (
      <WalletIdentity
        onDisconnect={onDisconnect}
        address={address}
        dataActionId={dataActionId}
        className={className}
      />
    );
  }
};
