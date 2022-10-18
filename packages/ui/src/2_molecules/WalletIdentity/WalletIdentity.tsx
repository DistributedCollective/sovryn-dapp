import React, { FC } from 'react';

import classNames from 'classnames';

import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownSize } from '../Dropdown/Dropdown.types';
import styles from './WalletIdentity.module.css';
import { AddressBadge } from './components/AddressBadge/AddressBadge';
import {
  DisconnectSubmenu,
  MenuLabels,
} from './components/DisconnectSubmenu/DisconnectSubmenu';

export type WalletIdentityProps = {
  onDisconnect?: () => void;
  address: string;
  className?: string;
  dataLayoutId?: string;
  hideSubmenu?: boolean;
  submenuLabels?: MenuLabels;
  startLength?: number;
  endLength?: number;
};

export const WalletIdentity: FC<WalletIdentityProps> = ({
  address,
  onDisconnect,
  className,
  hideSubmenu = false,
  startLength = 4,
  endLength = 4,
  dataLayoutId,
  submenuLabels,
}) => {
  if (hideSubmenu) {
    return (
      <div className={classNames(styles.addressBadge, className)}>
        <AddressBadge
          address={address}
          startLength={startLength}
          endLength={endLength}
          dataLayoutId={dataLayoutId}
        />
      </div>
    );
  }
  return (
    <Dropdown
      className={classNames(styles.dropdown, className)}
      text={
        <AddressBadge
          address={address}
          startLength={startLength}
          endLength={endLength}
          dataLayoutId={dataLayoutId}
        />
      }
      size={DropdownSize.small}
    >
      <DisconnectSubmenu
        onDisconnect={onDisconnect}
        address={address}
        dataLayoutId={dataLayoutId}
        menuLabels={submenuLabels}
      />
    </Dropdown>
  );
};
