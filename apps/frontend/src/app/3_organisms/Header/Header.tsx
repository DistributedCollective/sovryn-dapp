import React, { FC } from 'react';

import { Link } from 'react-router-dom';

import { Header as UIHeader, NavMenuItem } from '@sovryn/ui';

import { ConnectWalletButton, WrongNetworkSwitcher } from '../../2_molecules';
import { LanguageSelector } from '../../2_molecules/LanguageSelector/LanguageSelector';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import { useWalletConnect } from '../../../hooks';

export const Header: FC = () => {
  const { connectWallet, disconnectWallet, wallets, pending } =
    useWalletConnect();

  return (
    <UIHeader
      logo={<SovrynLogo dataAttribute="logo" link="/" />}
      menuItems={
        <>
          <Link to="/">Home</Link>
          <Link to="/zero">Zero</Link>
          <NavMenuItem className="mr-2" isActive children="Zero" />
          <NavMenuItem children="Perpetuals" />
        </>
      }
      secondaryContent={
        <>
          <div className="relative">
            <ConnectWalletButton
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              address={wallets[0]?.accounts[0]?.address}
              pending={pending}
            />
            <WrongNetworkSwitcher className="absolute top-full right-0" />
          </div>

          <LanguageSelector className="mr-1 ml-6 font-medium" />
        </>
      }
    />
  );
};
