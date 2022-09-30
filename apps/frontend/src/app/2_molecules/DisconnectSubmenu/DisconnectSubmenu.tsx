import React, { FC, PropsWithChildren } from 'react';

import { Icon, Menu, MenuItem } from '@sovryn/ui';

import styles from './DisconnectSubmenu.module.css';

export type DisconnectSubmenuProps = {
  onDisconnect: () => void;
  address: string;
  className?: string;
  dataActionId?: string;
};

export const DisconnectSubmenu: FC<
  PropsWithChildren<DisconnectSubmenuProps>
> = ({ address, onDisconnect, className }) => {
  return (
    <Menu className={className}>
      <MenuItem
        onClick={() => {
          navigator.clipboard.writeText(address);
        }}
        icon={'copy'}
        iconProps={{ size: 15 }}
        text="Copy Address"
      />
      <MenuItem
        iconProps={{ size: 16 }}
        onClick={onDisconnect}
        icon={'exit'}
        text="Disconnect"
      />
    </Menu>
  );
};
