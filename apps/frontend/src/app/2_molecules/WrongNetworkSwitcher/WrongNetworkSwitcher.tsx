import React, { FC, useCallback, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import {
  Paragraph,
  Notification,
  NotificationType,
  Button,
  ButtonStyle,
} from '@sovryn/ui';

import { chains, defaultChainId } from '../../../config/chains';
import { useWalletConnect } from '../../../hooks';
import styles from './WrongNetworkSwitcher.module.css';

type WrongNetworkSwitcherProps = {
  className?: string;
};

const defaultChain = chains.find(chain => chain.id === defaultChainId);

export const WrongNetworkSwitcher: FC<WrongNetworkSwitcherProps> = ({
  className,
}) => {
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

  if (!isWrongChain) {
    return null;
  }

  return (
    <Notification
      content={
        <>
          <Paragraph>
            {t('wrongNetworkSwitcher.description', {
              network: defaultChain?.label,
            })}
          </Paragraph>
          <Button
            className={styles.button}
            style={ButtonStyle.secondary}
            text={t('common.buttons.switch')}
            onClick={switchChain}
          />
        </>
      }
      type={NotificationType.warning}
      title={t('wrongNetworkSwitcher.title')}
      className={className}
    />
  );
};
