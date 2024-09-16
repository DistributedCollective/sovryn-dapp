import React, { FC, useCallback, useReducer } from 'react';

import { t } from 'i18next';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ButtonStyle,
  Header as UIHeader,
  Icon,
  IconNames,
} from '@sovryn/ui';

import { ConnectWalletButton } from '../../2_molecules';
import { NetworkPicker } from '../../2_molecules/NetworkPicker/NetworkPicker';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import { useWalletConnect, useWrongNetworkCheck } from '../../../hooks';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { translations } from '../../../locales/i18n';
import { isBobChain } from '../../../utils/chain';
import { menuItemsMapping } from './Header.constants';
import { BridgeMenuItem } from './components/BridgeMenuItem/BridgeMenuItem';
import { NavItem } from './components/NavItem/NavItem';
import { ProductLinks } from './components/ProductLinks/ProductLinks';

export const Header: FC = () => {
  const chainId = useCurrentChain();
  const navigate = useNavigate();
  const [isOpen, toggle] = useReducer(v => !v, false);
  const { connectWallet, disconnectWallet, account, pending } =
    useWalletConnect();
  useWrongNetworkCheck();

  const handleNavClick = useCallback(() => {
    if (isOpen) {
      toggle();
    }
  }, [isOpen]);

  return (
    <>
      <UIHeader
        dataAttribute="dapp-header"
        logo={
          <SovrynLogo
            dataAttribute="header-logo"
            link="/"
            onClick={handleNavClick}
          />
        }
        isOpen={isOpen}
        menuIcon={
          <Button
            text={
              <Icon
                icon={isOpen ? IconNames.X_MARK : IconNames.HAMBURGER_MENU}
              />
            }
            style={ButtonStyle.ghost}
            onClick={toggle}
            className="text-white"
          />
        }
        menuItems={
          <ol className="flex flex-col gap-4 lg:flex-row w-full lg:w-auto">
            {menuItemsMapping.map((item, index) => (
              <li key={index}>
                <NavItem item={item} onClick={toggle} />
              </li>
            ))}
            <ProductLinks />
            {isBobChain(chainId) && (
              <Button
                text={t(translations.header.nav.spicePoints)}
                style={ButtonStyle.primary}
                className="bg-[#24BFB74D]/[0.3] border-[#24BFB74D]/[0.3] hover:bg-[#24BFB74D]"
                onClick={() => navigate('/claim-lp')}
              />
            )}
          </ol>
        }
        secondaryContent={
          <div className="relative flex flex-row gap-4">
            <NetworkPicker />
            <ConnectWalletButton
              onConnect={connectWallet}
              onDisconnect={disconnectWallet}
              address={account}
              pending={pending}
              dataAttribute="dapp-header-connect"
            />
          </div>
        }
        extraContent={
          <div className="flex lg:space-x-4 items-center flex-wrap lg:flex-nowrap flex-col-reverse lg:flex-row lg:justify-start">
            {account && (
              <div className="w-full lg:w-auto mt-2 lg:mt-0">
                <BridgeMenuItem dataAttribute="dapp-header-bridges" />
              </div>
            )}
          </div>
        }
      />
    </>
  );
};
