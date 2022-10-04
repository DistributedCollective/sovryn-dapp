import React, { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import { Dropdown, DropdownSize } from '@sovryn/ui';

import styles from './WalletIdentity.module.css';
import { AddressBadge } from './components/AddressBadge/AddressBadge';
import { DisconnectSubmenu } from './components/DisconnectSubmenu/DisconnectSubmenu';

export type WalletIdentityProps = {
  onDisconnect: () => void;
  address: string;
  className?: string;
  dataActionId?: string;
  hideSubmenu?: boolean;
};

export const WalletIdentity: FC<PropsWithChildren<WalletIdentityProps>> = ({
  address,
  onDisconnect,
  className,
  hideSubmenu = false,
}) => {
  if (hideSubmenu) {
    return (
      <div className={classNames(styles['address-badge'], className)}>
        <AddressBadge address={address} />
      </div>
    );
  }
  return (
    <Dropdown
      className={classNames('w-40', className)}
      text={<AddressBadge address={address} />}
      size={DropdownSize.small}
    >
      <DisconnectSubmenu onDisconnect={onDisconnect} address={address} />
    </Dropdown>
  );
};
