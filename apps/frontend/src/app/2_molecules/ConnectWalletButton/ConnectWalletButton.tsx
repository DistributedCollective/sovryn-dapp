import React, { FC, PropsWithChildren } from 'react';

import { Button } from '@sovryn/ui';
import { WalletIdentity } from '@sovryn/ui';

export type ConnectWalletButtonProps = {
  onConnect: () => void;
  onDisconnect: () => void;
  address: string | undefined;
  pending?: boolean;
  className?: string;
  dataActionId?: string;
};

export const ConnectWalletButton: FC<
  PropsWithChildren<ConnectWalletButtonProps>
> = ({
  address,
  pending,
  onDisconnect,
  onConnect,
  className,
  dataActionId,
}) => {
  if (!address) {
    return (
      <Button
        text="Connect wallet"
        onClick={onConnect}
        className={className}
        dataActionId={dataActionId}
        disabled={pending}
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
