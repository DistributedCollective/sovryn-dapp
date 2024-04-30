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
import { GOBOB_LINK } from '../../../constants/links';
import { useWalletConnect, useWrongNetworkCheck } from '../../../hooks';
import { translations } from '../../../locales/i18n';
import { menuItemsMapping } from './Header.constants';
import { BridgeMenuItem } from './components/BridgeMenuItem/BridgeMenuItem';
import { NavItem } from './components/NavItem/NavItem';
import { ProductLinks } from './components/ProductLinks/ProductLinks';

export const Header: FC = () => {
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
            <Button
              text={t(translations.header.nav.bob)}
              style={ButtonStyle.primary}
              className="bg-[#24BFB74D]/[0.3] border-[#24BFB74D]/[0.3] hover:bg-[#24BFB74D]"
              onClick={() => window.open(GOBOB_LINK, '_blank')}
            />
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
          <>
            {account && (
              <div className="flex space-x-4">
                <Button
                  text={t(translations.header.nav.claimLp)}
                  style={ButtonStyle.primary}
                  className="bg-[#24BFB74D]/[0.3] border-[#24BFB74D]/[0.3] hover:bg-[#24BFB74D]"
                  onClick={() => navigate('/claim-lp')}
                />
                <BridgeMenuItem dataAttribute="dapp-header-bridges" />
              </div>
            )}
          </>
        }
      />
    </>
  );
};
