import React, { FC, useCallback, useMemo } from 'react';

import classNames from 'classnames';
import { t } from 'i18next';

import { SupportedTokens } from '@sovryn/contracts';
import { Menu, MenuItem } from '@sovryn/ui';

import { RSK_FAUCET } from '../../../../../constants/general';
import { BABELFISH_APP_LINK } from '../../../../../constants/links';
import { useAssetBalance } from '../../../../../hooks/useAssetBalance';
import { useIsMobile } from '../../../../../hooks/useIsMobile';
import { sharedState } from '../../../../../store/rxjs/shared-state';
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
  const { balance } = useAssetBalance(SupportedTokens.rbtc);
  const hasRbtcBalance = useMemo(() => Number(balance) !== 0, [balance]);

  const enableFastBtc = useMemo(
    () => isMainnet() || (!isMainnet() && isTestnetFastBtcEnabled()),
    [],
  );

  const handleBtcClicked = useCallback(() => {
    if (enableFastBtc) sharedState.actions.openFastBtcDialog(!hasRbtcBalance);
    else window.open(RSK_FAUCET, '_blank');
  }, [hasRbtcBalance, enableFastBtc]);

  const handleRunesClick = useCallback(() => {
    sharedState.actions.openRuneBridgeDialog();
  }, []);

  const handleTokensClick = useCallback(() => {
    window.open(BABELFISH_APP_LINK, '_blank');
  }, []);

  return (
    <NavDropdown
      text={t('header.nav.bridges.title')}
      className={classNames(
        'rounded-b-none text-gray-30 font-normal text-sm hover:bg-gray-70 hover:text-gray-10 min-w-auto w-full lg:w-auto lg:rounded bg-gray-70 border-gray-50',
      )}
      closeOnClick={!isMobile}
      dataAttribute={dataAttribute}
    >
      <Menu className="rounded-t-none rounded-b px-2 py-3 lg:rounded lg:p-1">
        <MenuItem
          key={t('header.nav.bridges.subMenu.btcBridge')}
          text={t('header.nav.bridges.subMenu.btcBridge')}
          label={
            !isMobile && t('header.nav.bridges.subMenu.btcBridgeDescription')
          }
          dataAttribute={`dapp-menu-btcBridge`}
          className="no-underline"
          onClick={handleBtcClicked}
        />
        <MenuItem
          key={t('header.nav.bridges.subMenu.runeBridge')}
          text={t('header.nav.bridges.subMenu.runeBridge')}
          label={
            !isMobile && t('header.nav.bridges.subMenu.runeBridgeDescription')
          }
          dataAttribute={`dapp-menu-runeBridge`}
          className="no-underline"
          onClick={handleRunesClick}
        />
        <MenuItem
          key={t('header.nav.bridges.subMenu.tokenBridge')}
          text={t('header.nav.bridges.subMenu.tokenBridge')}
          label={
            !isMobile && t('header.nav.bridges.subMenu.tokenBridgeDescription')
          }
          dataAttribute={`dapp-menu-tokenBridge`}
          className="no-underline"
          onClick={handleTokensClick}
        />
      </Menu>
    </NavDropdown>
  );
};
