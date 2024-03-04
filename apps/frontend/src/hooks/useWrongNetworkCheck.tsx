import React, { useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { Paragraph, NotificationType, Button, ButtonStyle } from '@sovryn/ui';

import { APP_CHAIN_LIST } from '../config/chains';

import { useNotificationContext } from '../contexts/NotificationContext';
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
      const expectedChain = APP_CHAIN_LIST.find(chain => chain.id === chainId);
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
              <Button
                className="mb-2 mt-7"
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
