import React, { FC, PropsWithChildren } from 'react';

import { Button, SimpleTableRow } from '@sovryn/ui';
import { WalletIdentity } from '@sovryn/ui';

import { Asset } from '../../../types/assets';

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
        balance={Object.values(Asset).map(asset => (
          <SimpleTableRow
            key={asset}
            className="text-sov-white"
            label={asset}
            value="0"
          />
        ))}
        submenuLabels={{
          copyAddress: 'Copy Address',
          disconnect: 'Disconnect',
        }}
      />
    );
  }
};
