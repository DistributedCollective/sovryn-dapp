import React, { FC, useCallback, useMemo, useReducer } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';
import { useLocation } from 'react-router-dom';

import { SupportedTokens } from '@sovryn/contracts';
import {
  Button,
  ButtonStyle,
  Header as UIHeader,
  Icon,
  IconNames,
  applyDataAttr,
  noop,
  Menu,
  Dropdown,
} from '@sovryn/ui';

import { ConnectWalletButton } from '../../2_molecules';
import { MenuItemWithRouter } from '../../2_molecules/MenuItemWithRouter/MenuItemWithRouter';
import { NavLink } from '../../2_molecules/NavLink/NavLink';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import { RSK_FAUCET } from '../../../constants/general';
import { useWalletConnect, useWrongNetworkCheck } from '../../../hooks';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { translations } from '../../../locales/i18n';
import { sharedState } from '../../../store/rxjs/shared-state';
import { isMainnet, isTestnetFastBtcEnabled } from '../../../utils/helpers';
import { menuItemsMapping } from './Header.constants';
import { ProductLinks } from './components/ProductLinks/ProductLinks';

export const Header: FC = () => {
  const [isOpen, toggle] = useReducer(v => !v, false);
  const { connectWallet, disconnectWallet, account, pending } =
    useWalletConnect();
  useWrongNetworkCheck();

  const { isMobile } = useIsMobile();

  const { pathname } = useLocation();

  const { balance } = useAssetBalance(SupportedTokens.rbtc);

  const hasRbtcBalance = useMemo(() => Number(balance) !== 0, [balance]);

  const enableFastBtc = useMemo(
    () => isMainnet() || (!isMainnet() && isTestnetFastBtcEnabled()),
    [],
  );

  const handleNavClick = useCallback(() => {
    if (isOpen) {
      toggle();
    }
  }, [isOpen]);

  const handleFastBtcClick = useCallback(
    () => sharedState.actions.openFastBtcDialog(!hasRbtcBalance),
    [hasRbtcBalance],
  );

  const isPathActive = useCallback(
    (path: string) => pathname.startsWith(path),
    [pathname],
  );

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
          <ol className="flex flex-col gap-4 lg:flex-row w-full md:w-auto">
            {menuItemsMapping.map(item =>
              item.submenu ? (
                <Dropdown
                  key={item.text}
                  text={item.text}
                  className={classNames(
                    'text-gray-30 font-normal text-sm hover:bg-gray-70 hover:text-gray-10 min-w-auto w-full md:w-auto',
                    {
                      'bg-transparent border-none': !isPathActive(item.url),
                    },
                  )}
                >
                  <Menu>
                    {item.submenu.map(({ text, label, url }) => (
                      <MenuItemWithRouter
                        key={text}
                        text={text}
                        label={!isMobile && label}
                        link={url}
                        dataAttribute={`dapp-menu-${text
                          .toLowerCase()
                          .replace(' ', '-')}`}
                        isActive={isPathActive(url)}
                        className="no-underline"
                      />
                    ))}
                  </Menu>
                </Dropdown>
              ) : (
                <NavLink
                  key={item.text}
                  to={item.url}
                  end
                  onClick={handleNavClick}
                  {...applyDataAttr(`dapp-menu-${item.text.toLowerCase()}`)}
                >
                  {item.text}
                </NavLink>
              ),
            )}
            <ProductLinks />
          </ol>
        }
        secondaryContent={
          (account || pathname !== '/') && (
            <div className="relative">
              <ConnectWalletButton
                onConnect={connectWallet}
                onDisconnect={disconnectWallet}
                address={account}
                pending={pending}
                dataAttribute="dapp-header-connect"
              />
            </div>
          )
        }
        extraContent={
          <>
            {account && (
              <>
                <Button
                  text={t(
                    hasRbtcBalance
                      ? translations.header.funding
                      : translations.header.fundWallet,
                  )}
                  style={
                    hasRbtcBalance ? ButtonStyle.secondary : ButtonStyle.primary
                  }
                  dataAttribute="dapp-header-funding"
                  onClick={enableFastBtc ? handleFastBtcClick : noop}
                  href={enableFastBtc ? '' : RSK_FAUCET}
                  hrefExternal={true}
                />
              </>
            )}
          </>
        }
      />
    </>
  );
};
