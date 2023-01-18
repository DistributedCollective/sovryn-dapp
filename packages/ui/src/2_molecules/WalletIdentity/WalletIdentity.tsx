import React, { FC, ReactNode } from 'react';

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
  onCopyAddress?: () => void;
  address: string;
  className?: string;
  dataAttribute?: string;
  hideSubmenu?: boolean;
  submenuLabels?: MenuLabels;
  startLength?: number;
  endLength?: number;
  content?: ReactNode;
};

export const WalletIdentity: FC<WalletIdentityProps> = ({
  onDisconnect,
  onCopyAddress,
  address,
  className,
  hideSubmenu = false,
  startLength = 4,
  endLength = 4,
  dataAttribute,
  submenuLabels,
  content,
}) => {
  if (hideSubmenu) {
    return (
      <div className={classNames(styles.addressBadge, className)}>
        <AddressBadge
          address={address}
          startLength={startLength}
          endLength={endLength}
          dataAttribute={dataAttribute}
        />
      </div>
    );
  }
  return (
    <Dropdown
      className={classNames(styles.dropdown, className)}
      dropdownClassName={styles.dropdownMenu}
      text={
        <AddressBadge
          address={address}
          startLength={startLength}
          endLength={endLength}
          dataAttribute={dataAttribute}
        />
      }
      size={DropdownSize.small}
      closeOnClick
    >
      {content}
      <DisconnectSubmenu
        onDisconnect={onDisconnect}
        onCopyAddress={onCopyAddress}
        address={address}
        dataAttribute={dataAttribute}
        menuLabels={submenuLabels}
        className={styles.disconnectSubmenu}
      />
    </Dropdown>
  );
};
