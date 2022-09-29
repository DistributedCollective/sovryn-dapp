import React, { FC, PropsWithChildren } from 'react';

import classNames from 'classnames';

import { Menu, MenuItem } from '@sovryn/ui';

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
      <MenuItem text="Delta" label="onClick" onClick={console.log} />
      <li
        onClick={() => {
          navigator.clipboard.writeText(address);
        }}
      >
        <img className="mr-3" width={14} src={CopyIcon} />
        Copy Address
      </li>
      <li onClick={onDisconnect}>
        <img className="mr-3" width={16} src={ExitIcon} />
        Disconnect
      </li>
    </Menu>
  );
};
