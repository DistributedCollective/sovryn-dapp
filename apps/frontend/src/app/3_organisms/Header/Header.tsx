import React, { FC, useCallback, useReducer } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  Header as UIHeader,
  Icon,
  IconNames,
  Tooltip,
} from '@sovryn/ui';

import { ConnectWalletButton } from '../../2_molecules';
import { NetworkPicker } from '../../2_molecules/NetworkPicker/NetworkPicker';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import { useWalletConnect, useWrongNetworkCheck } from '../../../hooks';
import { translations } from '../../../locales/i18n';
import { getOriginsUrl } from '../../../utils/helpers';
import { menuItemsMapping } from './Header.constants';
import { BridgeMenuItem } from './components/BridgeMenuItem/BridgeMenuItem';
import { NavItem } from './components/NavItem/NavItem';
import { ProductLinks } from './components/ProductLinks/ProductLinks';
import { IS_IMPERSONATING } from '../../../utils/account-debug';

export const Header: FC = () => {
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
            <li>
              <a
                href={getOriginsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-10 font-normal text-sm text-opacity-75 hover:text-gray-10 no-underline px-2 py-3"
              >
                {t(translations.header.nav.origins)}
              </a>
            </li>
            <ProductLinks />
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
            {IS_IMPERSONATING && (
              <button
                className={
                  'fixed bottom-3 right-3 bg-sovryn-black text-trade-short-25 text-xs px-2 py-1 rounded'
                }
                onClick={() => (window as any).stopImpersonatingAccount()}
              >
                <Tooltip content="You are in DEBUG MODE. All RPC requests will be called from the impersonated account. Click to disable.">
                  <span>DEBUG MODE</span>
                </Tooltip>
              </button>
            )}
          </div>
        }
        extraContent={
          <div className="flex lg:space-x-4 items-center flex-wrap lg:flex-nowrap flex-col-reverse lg:flex-row lg:justify-start">
            <div className="w-full lg:w-auto mt-2 lg:mt-0">
              <BridgeMenuItem dataAttribute="dapp-header-bridges" />
            </div>
          </div>
        }
      />
    </>
  );
};
