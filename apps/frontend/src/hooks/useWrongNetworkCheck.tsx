import React, { useCallback, useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { Paragraph, NotificationType, Button, ButtonStyle } from '@sovryn/ui';

import { chains, defaultChainId } from '../config/chains';

import { useNotificationContext } from '../contexts/NotificationContext';
import { useWalletConnect } from './useWalletConnect';

const defaultChain = chains.find(chain => chain.id === defaultChainId);

const WrongNetworkSwitcherId = 'WrongNetworkSwitcher';

export const useWrongNetworkCheck = () => {
  const { addNotification, removeNotification } = useNotificationContext();
  const { wallets, switchNetwork } = useWalletConnect();
  const { t } = useTranslation();

  const isWrongChain = useMemo(() => {
    return (
      wallets[0]?.accounts[0]?.address &&
      wallets[0].chains[0].id !== defaultChainId
    );
  }, [wallets]);

  const switchChain = useCallback(() => {
    switchNetwork(defaultChainId);
  }, [switchNetwork]);

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
                  network: defaultChain?.label,
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
