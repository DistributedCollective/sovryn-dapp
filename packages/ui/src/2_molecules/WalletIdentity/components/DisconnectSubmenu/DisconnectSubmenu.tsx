import React, { FC, useCallback } from 'react';

import { Menu, MenuItem } from '../../../Menu/Menu';

export type MenuLabels = {
  copyAddress: string;
  disconnect: string;
};

export type DisconnectSubmenuProps = {
  onDisconnect: () => void;
  address: string;
  className?: string;
  dataActionId?: string;
  menuLabels?: MenuLabels;
};

export const DisconnectSubmenu: FC<DisconnectSubmenuProps> = ({
  address,
  onDisconnect,
  className,
  dataActionId,
  menuLabels,
}) => {
  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    alert('Address was copied to clipboard.');
  }, [address]);

  return (
    <Menu className={className}>
      <MenuItem
        onClick={copyAddress}
        icon="copy"
        dataActionId={`${
          dataActionId || 'disconnect-submenu'
        }-menu-copyAddress`}
        text={menuLabels?.copyAddress || 'Copy Address'}
      />
      <MenuItem
        onClick={onDisconnect}
        icon="exit"
        dataActionId={`${dataActionId || 'disconnect-submenu'}-menu-disconnect`}
        text={menuLabels?.disconnect || 'Disconnect'}
      />
    </Menu>
  );
};
