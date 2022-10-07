import React, { FC, PropsWithChildren, useEffect, useState } from 'react';

import classNames from 'classnames';

import { Button } from '@sovryn/ui';
import { ButtonSize } from '@sovryn/ui/src/1_atoms/Button/Button.types';

import { WalletIdentity } from '../WalletIdentity/WalletIdentity';
import styles from './ConnectWalletButton.module.css';

export type ConnectWalletButtonProps = {
  onConnect: () => void;
  onDisconnect: () => void;
  address: string | undefined;
  className?: string;
  dataActionId?: string;
  hideSubmenu?: boolean;
};

export const ConnectWalletButton: FC<
  PropsWithChildren<ConnectWalletButtonProps>
> = ({
  address,
  onDisconnect,
  onConnect,
  className,
  hideSubmenu = false,
  dataActionId,
}) => {
  if (!address) {
    return (
      <Button
        text="Connect wallet"
        onClick={onConnect}
        size={ButtonSize.sm}
        className="text-white"
        dataActionId={dataActionId}
      />
    );
  } else {
    return (
      <WalletIdentity
        onDisconnect={onDisconnect}
        address={address}
        dataActionId={dataActionId}
      />
    );
  }
};
