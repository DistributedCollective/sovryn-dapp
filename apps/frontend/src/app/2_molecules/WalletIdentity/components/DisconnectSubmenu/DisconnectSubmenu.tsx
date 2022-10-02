import React, { FC, PropsWithChildren } from 'react';

import { Menu, MenuItem } from '@sovryn/ui';

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
        onClick={async () => {
          await navigator.clipboard.writeText(address);
          alert('Address was copied to clipboard.');
        }}
        icon={'copy'}
        iconProps={{ size: 16, className: 'mr-2' }}
        text="Copy Address"
      />
      <MenuItem
        iconProps={{ size: 16, viewBox: '0 0 16 14', className: 'mr-2' }}
        onClick={onDisconnect}
        icon={'exit'}
        text="Disconnect"
      />
    </Menu>
  );
};
