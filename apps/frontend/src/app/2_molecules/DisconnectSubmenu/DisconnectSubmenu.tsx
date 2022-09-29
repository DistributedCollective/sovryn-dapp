import React, { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import { Icon, Menu, MenuItem } from '@sovryn/ui';

import CopyIcon from '../../../assets/Copy.svg';
import ExitIcon from '../../../assets/Exit.svg';
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
    <Menu className={classNames(styles.disconnectSubmenu, className)}>
      <MenuItem
        onClick={() => {
          navigator.clipboard.writeText(address);
        }}
        text={
          <div className={styles.menuItem}>
            <Icon className="mr-3" size={14} icon={'copy'} />
            Copy Address
          </div>
        }
      />
      <MenuItem
        onClick={() => {
          navigator.clipboard.writeText(address);
        }}
        text={
          <div className={styles.menuItem}>
            <Icon className="mr-3 flex items-center" size={16} icon={'exit'} />
            Disconnect
          </div>
        }
      />
    </Menu>
  );
};
