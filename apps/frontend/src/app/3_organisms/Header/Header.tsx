import React, { FC, useCallback, useMemo, useReducer } from 'react';

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
} from '@sovryn/ui';

import { ConnectWalletButton } from '../../2_molecules';
import { NavLink } from '../../2_molecules/NavLink/NavLink';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import { useWalletConnect, useWrongNetworkCheck } from '../../../hooks';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { translations } from '../../../locales/i18n';
import { sharedState } from '../../../store/rxjs/shared-state';
import { isMainnet, isTestnetFastBtcEnabled } from '../../../utils/helpers';

export const Header: FC = () => {
  const [isOpen, toggle] = useReducer(v => !v, false);
  const { connectWallet, disconnectWallet, account, pending } =
    useWalletConnect();
  useWrongNetworkCheck();

  const { pathname } = useLocation();

  const { value } = useAssetBalance(SupportedTokens.rbtc);

  const hasRbtcBalance = useMemo(() => Number(value) !== 0, [value]);

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
    () => sharedState.actions.openFastBtcDialog(),
    [],
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
                size={16}
              />
            }
            style={ButtonStyle.ghost}
            onClick={toggle}
            className="text-white"
          />
        }
        menuItems={
          <ol className="flex flex-col gap-4 lg:flex-row">
            <NavLink
              to="/"
              end
              onClick={handleNavClick}
              {...applyDataAttr('dapp-menu-borrow')}
            >
              {t(translations.header.nav.borrow)}
            </NavLink>
            <NavLink
              to="/earn"
              onClick={handleNavClick}
              {...applyDataAttr('dapp-menu-earn')}
            >
              {t(translations.header.nav.earn)}
            </NavLink>
            <NavLink
              to="/convert"
              onClick={handleNavClick}
              {...applyDataAttr('dapp-menu-convert')}
            >
              {t(translations.header.nav.convert)}
            </NavLink>
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
          account &&
          hasRbtcBalance && (
            <Button
              text={t(translations.header.funding)}
              style={ButtonStyle.secondary}
              dataAttribute="dapp-header-funding"
              onClick={enableFastBtc ? handleFastBtcClick : noop}
              href={enableFastBtc ? '' : 'https://faucet.rsk.co'}
              hrefExternal={true}
              className="text-gray-10"
            />
          )
        }
      />
    </>
  );
};
