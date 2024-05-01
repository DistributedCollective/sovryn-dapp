import React, { useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import {
  Paragraph,
  NotificationType,
  Button,
  ButtonStyle,
  Link,
} from '@sovryn/ui';

import { WIKI_LINKS } from '../constants/links';
import { useNotificationContext } from '../contexts/NotificationContext';
import { getChainById } from '../utils/chain';
import { useCurrentChain } from './useChainStore';
import { useWalletConnect } from './useWalletConnect';

const WrongNetworkSwitcherId = 'WrongNetworkSwitcher';

export const useWrongNetworkCheck = () => {
  const chainId = useCurrentChain();
  const { addNotification, removeNotification } = useNotificationContext();
  const { wallets, switchNetwork } = useWalletConnect();

  const isWrongChain = useMemo(() => {
    return (
      wallets[0]?.accounts[0]?.address && wallets[0].chains[0].id !== chainId
    );
  }, [wallets, chainId]);

  const switchChain = useCallback(() => {
    switchNetwork(chainId);
  }, [chainId, switchNetwork]);

  useEffect(() => {
    if (isWrongChain) {
      const expectedChain = getChainById(chainId);
      addNotification(
        {
          type: NotificationType.warning,
          title: t('wrongNetworkSwitcher.title'),
          content: (
            <>
              <Paragraph>
                {t('wrongNetworkSwitcher.description', {
                  network: expectedChain?.label,
                })}
              </Paragraph>
              <Link
                text={t('wrongNetworkSwitcher.learnMore')}
                href={WIKI_LINKS.WALLET_SETUP}
                openNewTab
                className="block mt-1"
              />
              <Button
                className="mb-2 mt-3"
                style={ButtonStyle.secondary}
                text={t('common.buttons.switch')}
                onClick={switchChain}
              />
            </>
          ),
          dismissible: false,
          id: WrongNetworkSwitcherId,
        },
        0,
      );
    } else {
      removeNotification(WrongNetworkSwitcherId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isWrongChain]);
};
