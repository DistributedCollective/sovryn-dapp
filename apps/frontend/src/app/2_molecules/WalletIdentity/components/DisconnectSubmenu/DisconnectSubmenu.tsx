import React, { FC, PropsWithChildren, useCallback } from 'react';

import { Menu, MenuItem } from '@sovryn/ui';

export type DisconnectSubmenuProps = {
  onDisconnect: () => void;
  address: string;
  className?: string;
  dataActionId?: string;
};

export const DisconnectSubmenu: FC<
  PropsWithChildren<DisconnectSubmenuProps>
> = ({ address, onDisconnect, className, dataActionId }) => {
  const copyAddress = useCallback(async () => {
    await navigator.clipboard.writeText(address);
    alert('Address was copied to clipboard.');
  }, [address]);

  return (
    <Menu className={className}>
      <MenuItem
        dataActionId={dataActionId + '-copy'}
        onClick={copyAddress}
        icon={'copy'}
        text="Copy Address"
      />
      <MenuItem
        dataActionId={dataActionId + '-exit'}
        onClick={onDisconnect}
        icon={'exit'}
        text="Disconnect"
      />
    </Menu>
  );
};
