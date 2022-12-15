import React, { FC, useCallback, useReducer } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Button,
  ButtonStyle,
  Header as UIHeader,
  Icon,
  IconNames,
} from '@sovryn/ui';

import { ConnectWalletButton, WrongNetworkSwitcher } from '../../2_molecules';
import { NavLink } from '../../2_molecules/NavLink/NavLink';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import { useWalletConnect } from '../../../hooks';
import { translations } from '../../../locales/i18n';

export const Header: FC = () => {
  const { t } = useTranslation();
  const [isOpen, toggle] = useReducer(v => !v, false);
  const { connectWallet, disconnectWallet, account, pending } =
    useWalletConnect();

  const handleNavClick = useCallback(() => {
    if (isOpen) {
      toggle();
    }
  }, [isOpen]);

  return (
    <UIHeader
      logo={
        <SovrynLogo dataAttribute="logo" link="/" onClick={handleNavClick} />
      }
      isOpen={isOpen}
      menuIcon={
        <Button
          text={
            <Icon
              icon={isOpen ? IconNames.X_MARK : IconNames.HAMBURGER_MENU}
              viewBox={isOpen ? '0 0 24 24' : '0 0 16 16'}
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
          <NavLink to="/" end onClick={handleNavClick}>
            {t(translations.header.nav.home)}
          </NavLink>
          <NavLink to="/earn" onClick={handleNavClick}>
            {t(translations.header.nav.earn)}
          </NavLink>
          <NavLink to="/convert" onClick={handleNavClick}>
            {t(translations.header.nav.convert)}
          </NavLink>
          <NavLink to="/debug-content" onClick={handleNavClick}>
            *Debug Content*
          </NavLink>
        </ol>
      }
      secondaryContent={
        <div className="relative">
          <ConnectWalletButton
            onConnect={connectWallet}
            onDisconnect={disconnectWallet}
            address={account}
            pending={pending}
          />
          <WrongNetworkSwitcher className="absolute top-full right-0" />
        </div>
      }
      extraContent={
        <>
          {account && (
            <Button
              text={t(translations.header.funding)}
              style={ButtonStyle.secondary}
            />
          )}
        </>
      }
    />
  );
};
