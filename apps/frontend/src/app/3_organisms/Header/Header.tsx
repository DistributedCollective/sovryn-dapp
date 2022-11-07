import React, { FC } from 'react';

import {
  Dropdown,
  Header as UIHeader,
  Menu,
  MenuItem,
  NavMenuItem,
  DropdownSize,
} from '@sovryn/ui';

import { ConnectWalletButton } from '../../2_molecules';
import { useWalletConnect } from '../../../hooks';

export const Header: FC = () => {
  const { connectWallet, disconnectWallet, wallets, pending } =
    useWalletConnect();

  return (
    <UIHeader
      logo={<div>Sovryn</div>}
      menuItems={
        <>
          <NavMenuItem className="mr-2" isActive children="Zero" />
          <NavMenuItem children="Perpetuals" />
        </>
      }
      secondaryContent={
        <>
          <ConnectWalletButton
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            address={wallets[0]?.accounts[0]?.address}
            pending={pending}
          />

          <Dropdown size={DropdownSize.small} text="EN" className="mr-1 ml-6">
            <Menu>
              <MenuItem text="EN" />
              <MenuItem text="ES" />
            </Menu>
          </Dropdown>
        </>
      }
    />
  );
};
