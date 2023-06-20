import React, { useCallback, useEffect, useMemo } from 'react';

import { t } from 'i18next';

import { Paragraph, NotificationType, Button, ButtonStyle } from '@sovryn/ui';

import { chains } from '../config/chains';

import { useNetworkContext } from '../contexts/NetworkContext';
import { useNotificationContext } from '../contexts/NotificationContext';
import { useWalletConnect } from './useWalletConnect';

const WrongNetworkSwitcherId = 'WrongNetworkSwitcher';

export const useWrongNetworkCheck = () => {
  const { chainId } = useNetworkContext();
  const { addNotification, removeNotification } = useNotificationContext();
  const { wallets, switchNetwork } = useWalletConnect();

  const isWrongChain = useMemo(() => {
    return (
      wallets[0]?.accounts[0]?.address && wallets[0].chains[0].id !== chainId
    );
  }, [wallets, chainId]);

  const chain = useMemo(
    () => chains.find(chain => chain.id === chainId),
    [chainId],
  );

  const switchChain = useCallback(
    () => switchNetwork(chainId),
    [chainId, switchNetwork],
  );

  useEffect(() => {
    if (isWrongChain) {
      addNotification(
        {
          type: NotificationType.warning,
          title: t('wrongNetworkSwitcher.title'),
          content: (
            <>
              <Paragraph>
                {t('wrongNetworkSwitcher.description', {
                  network: chain?.label,
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
