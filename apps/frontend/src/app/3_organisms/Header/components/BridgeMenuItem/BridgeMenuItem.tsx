import React, { FC, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { ChainIds } from '@sovryn/ethers-provider';
import { Badge, Menu, MenuItem, Tooltip } from '@sovryn/ui';

import { POWPEG, RSK_FAUCET } from '../../../../../constants/general';
import { BOB } from '../../../../../constants/infrastructure/bob';
import {
  BABELFISH_APP_LINK,
  SEPOLIA_FAUCET_LINK,
} from '../../../../../constants/links';
import { useWalletConnect } from '../../../../../hooks';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { useCurrentChain } from '../../../../../hooks/useChainStore';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { sharedState } from '../../../../../store/rxjs/shared-state';
import { Environments } from '../../../../../types/global';
import { COMMON_SYMBOLS } from '../../../../../utils/asset';
import { isBobChain, isRskChain } from '../../../../../utils/chain';
import {
  isMainnet,
  isTestnetFastBtcEnabled,
} from '../../../../../utils/helpers';
import { NavDropdown } from '../NavItem/NavDropdown';

export type BridgeMenuItemProps = {
  dataAttribute?: string;
};

export const BridgeMenuItem: FC<BridgeMenuItemProps> = ({ dataAttribute }) => {
  const { isMobile } = useIsMobile();
  const chainId = useCurrentChain();
  const { balance } = useAssetBalance(
    isRskChain(chainId) ? COMMON_SYMBOLS.BTC : COMMON_SYMBOLS.ETH,
    chainId,
  );
  const { account } = useWalletConnect();
  const hasRbtcBalance = useMemo(() => Number(balance) !== 0, [balance]);

  const enableFastBtc = useMemo(
    () => isMainnet() || (!isMainnet() && isTestnetFastBtcEnabled()),
    [],
  );

  const handleEthClicked = useCallback(() => {
    if (isBobChain(chainId)) {
      window.open(
        BOB.bridge[isMainnet() ? Environments.Mainnet : Environments.Testnet],
        '_blank',
      );
    } else if (chainId === ChainIds.SEPOLIA) {
      window.open(SEPOLIA_FAUCET_LINK, '_blank');
    }
  }, [chainId]);

  const handleBtcClicked = useCallback(() => {
    if (isBobChain(chainId)) {
      window.open(
        BOB.bridge[isMainnet() ? Environments.Mainnet : Environments.Testnet],
        '_blank',
      );
    } else if (isRskChain(chainId)) {
      if (enableFastBtc) sharedState.actions.openFastBtcDialog(!hasRbtcBalance);
      else window.open(RSK_FAUCET, '_blank');
    } else if (chainId === ChainIds.SEPOLIA) {
      window.open(SEPOLIA_FAUCET_LINK, '_blank');
    }
  }, [hasRbtcBalance, enableFastBtc, chainId]);

  const handleRunesClick = useCallback(() => {
    sharedState.actions.openRuneBridgeDialog();
  }, []);

  const handleStablecoinsClick = useCallback(() => {
    window.open(BABELFISH_APP_LINK, '_blank');
  }, []);

  const handleErcClick = useCallback(() => {
    if (isBobChain(chainId)) {
      window.open(
        BOB.bridge[isMainnet() ? Environments.Mainnet : Environments.Testnet],
        '_blank',
      );
    } else if (chainId === ChainIds.SEPOLIA) {
      window.open(SEPOLIA_FAUCET_LINK, '_blank');
    }
  }, [chainId]);

  return (
    <Tooltip
      disabled={!!account}
      content={<span>{t('header.nav.bridges.connectWallet')}</span>}
    >
      <div>
        <NavDropdown
          text={t('header.nav.bridges.title')}
          className={classNames(
            'text-gray-30 font-normal text-sm min-w-auto w-full lg:w-auto rounded bg-gray-70 border-gray-50',
            {
              'opacity-30': !account,
              'hover:bg-gray-70 hover:text-gray-10': !!account,
            },
          )}
          disabled={!account}
          closeOnClick={!isMobile}
          dataAttribute={dataAttribute}
        >
          <Menu className="rounded-t-none rounded-b px-2 py-3 lg:rounded lg:p-1">
            <MenuItem
              key={t('header.nav.bridges.subMenu.powPeg')}
              text={t('header.nav.bridges.subMenu.powPeg')}
              label={
                !isMobile && t('header.nav.bridges.subMenu.powPegDescription')
              }
              dataAttribute={`dapp-menu-powPeg`}
              className={classNames('no-underline', {
                hidden: !isRskChain(chainId),
              })}
              href={POWPEG}
              hrefExternal
            />
            <MenuItem
              key={t('header.nav.bridges.subMenu.ethBridge')}
              text={t('header.nav.bridges.subMenu.ethBridge')}
              label={
                !isMobile &&
                t('header.nav.bridges.subMenu.ethBridgeDescription')
              }
              dataAttribute={`dapp-menu-ethBridge`}
              className={classNames('no-underline', {
                hidden: isRskChain(chainId) || isBobChain(chainId),
              })}
              onClick={handleEthClicked}
            />
            <MenuItem
              key={t('header.nav.bridges.subMenu.btcBridge')}
              text={
                <span className="flex items-center gap-1.5">
                  {t('header.nav.bridges.subMenu.btcBridge')}
                  <Badge content={t('common.deprecated')} className="px-1.5" />
                </span>
              }
              label={
                !isMobile &&
                t('header.nav.bridges.subMenu.btcBridgeDescription')
              }
              dataAttribute={`dapp-menu-btcBridge`}
              className={classNames('no-underline', {
                hidden: !isRskChain(chainId),
              })}
              onClick={handleBtcClicked}
            />
            <MenuItem
              key={t('header.nav.bridges.subMenu.runeBridge')}
              text={t('header.nav.bridges.subMenu.runeBridge')}
              label={
                !isMobile &&
                t('header.nav.bridges.subMenu.runeBridgeDescription')
              }
              dataAttribute={`dapp-menu-runeBridge`}
              className="no-underline"
              onClick={handleRunesClick}
            />
            <MenuItem
              key={t('header.nav.bridges.subMenu.tokenBridge')}
              text={t('header.nav.bridges.subMenu.tokenBridge')}
              label={
                !isMobile &&
                t('header.nav.bridges.subMenu.tokenBridgeDescription')
              }
              dataAttribute={`dapp-menu-tokenBridge`}
              className={classNames('no-underline', {
                hidden: !isRskChain(chainId),
              })}
              onClick={handleStablecoinsClick}
            />
            <MenuItem
              key={t('header.nav.bridges.subMenu.ercBridge')}
              text={t('header.nav.bridges.subMenu.ercBridge')}
              label={
                !isMobile &&
                t('header.nav.bridges.subMenu.ercBridgeDescription')
              }
              dataAttribute={`dapp-menu-ercBridge`}
              className={classNames('no-underline', {
                hidden: isRskChain(chainId),
              })}
              onClick={handleErcClick}
            />
          </Menu>
        </NavDropdown>
      </div>
    </Tooltip>
  );
};
