import React, { FC } from 'react';

import classNames from 'classnames';

import { Dropdown } from '../Dropdown/Dropdown';
import { DropdownSize } from '../Dropdown/Dropdown.types';
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

export const WalletIdentity: FC<WalletIdentityProps> = ({
  address,
  onDisconnect,
  className,
  hideSubmenu = false,
}) => {
  if (hideSubmenu) {
    return (
      <div className={classNames(styles['addressBadge'], className)}>
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
