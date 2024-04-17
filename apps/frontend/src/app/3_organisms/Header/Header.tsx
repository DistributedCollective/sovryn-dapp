import React, { FC, useCallback, useMemo, useReducer } from 'react';

import { t } from 'i18next';

import {
  Button,
  ButtonStyle,
  Header as UIHeader,
  Icon,
  IconNames,
  noop,
} from '@sovryn/ui';

import { ConnectWalletButton } from '../../2_molecules';
import { NetworkPicker } from '../../2_molecules/NetworkPicker/NetworkPicker';
import { SovrynLogo } from '../../2_molecules/SovrynLogo/SovrynLogo';
import { RSK_FAUCET } from '../../../constants/general';
import { BOB } from '../../../constants/infrastructure/bob';
import { useWalletConnect, useWrongNetworkCheck } from '../../../hooks';
import { useAssetBalance } from '../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../hooks/useChainStore';
import { translations } from '../../../locales/i18n';
import { sharedState } from '../../../store/rxjs/shared-state';
import { Environments } from '../../../types/global';
import { COMMON_SYMBOLS } from '../../../utils/asset';
import { isBobChain, isRskChain } from '../../../utils/chain';
import { isMainnet, isTestnetFastBtcEnabled } from '../../../utils/helpers';
import { menuItemsMapping } from './Header.constants';
import { NavItem } from './components/NavItem/NavItem';
import { ProductLinks } from './components/ProductLinks/ProductLinks';

export const Header: FC = () => {
  const chainId = useCurrentChain();
  const [isOpen, toggle] = useReducer(v => !v, false);
  const { connectWallet, disconnectWallet, account, pending } =
    useWalletConnect();
  useWrongNetworkCheck();

  const { balance } = useAssetBalance(
    isRskChain(chainId) ? COMMON_SYMBOLS.BTC : COMMON_SYMBOLS.ETH,
    chainId,
  );

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

  const href = useMemo(() => {
    if (isBobChain(chainId)) {
      return BOB.bridge[
        isMainnet() ? Environments.Mainnet : Environments.Testnet
      ];
    }

    if (!enableFastBtc) {
      return RSK_FAUCET;
    }
  }, [chainId, enableFastBtc]);

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
              onClick={() => window.open('https://gobob.sovryn.app', '_blank')}
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
                  onClick={!href ? handleFastBtcClick : noop}
                  href={href}
                  hrefExternal={true}
                  disabled={!isRskChain(chainId) && !isBobChain(chainId)}
                />
              </>
            )}
          </>
        }
      />
    </>
  );
};
