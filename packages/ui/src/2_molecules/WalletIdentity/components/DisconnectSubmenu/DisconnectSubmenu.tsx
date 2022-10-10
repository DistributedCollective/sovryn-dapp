import React, { FC, useCallback } from 'react';

import { Menu, MenuItem } from '../../../Menu/Menu';

export type DisconnectSubmenuProps = {
  onDisconnect: () => void;
  address: string;
  className?: string;
  dataActionId?: string;
};

export const DisconnectSubmenu: FC<DisconnectSubmenuProps> = ({
  address,
  onDisconnect,
  className,
}) => {
  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    alert('Address was copied to clipboard.');
  }, [address]);

  return (
    <Menu className={className}>
      <MenuItem onClick={copyAddress} icon={'copy'} text="Copy Address" />
      <MenuItem onClick={onDisconnect} icon={'exit'} text="Disconnect" />
    </Menu>
  );
};
