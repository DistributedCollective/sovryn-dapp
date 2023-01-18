import React, { FC, useCallback } from 'react';

import { IconNames } from '../../../../1_atoms';
import { Menu, MenuItem } from '../../../Menu';

export type MenuLabels = {
  copyAddress: string;
  disconnect: string;
};

export type DisconnectSubmenuProps = {
  onDisconnect?: () => void;
  onCopyAddress?: () => void;
  address: string;
  className?: string;
  dataAttribute?: string;
  menuLabels?: MenuLabels;
};

export const DisconnectSubmenu: FC<DisconnectSubmenuProps> = ({
  address,
  onDisconnect,
  onCopyAddress,
  className,
  dataAttribute,
  menuLabels,
}) => {
  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    onCopyAddress?.();
  }, [onCopyAddress, address]);

  return (
    <Menu className={className}>
      <MenuItem
        onClick={copyAddress}
        icon={IconNames.COPY}
        dataAttribute={`${
          dataAttribute || 'disconnect-submenu'
        }-menu-copyAddress`}
        text={menuLabels?.copyAddress || 'Copy Address'}
      />
      {onDisconnect && (
        <MenuItem
          onClick={onDisconnect}
          icon={IconNames.EXIT}
          dataAttribute={`${
            dataAttribute || 'disconnect-submenu'
          }-menu-disconnect`}
          text={menuLabels?.disconnect || 'Disconnect'}
        />
      )}
    </Menu>
  );
};
