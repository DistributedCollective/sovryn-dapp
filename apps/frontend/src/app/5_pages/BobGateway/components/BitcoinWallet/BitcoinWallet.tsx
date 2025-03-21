import { useAccount, useConnect, useDisconnect } from '@gobob/sats-wagmi';

import React, { FC, useCallback, useEffect, useState } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  NotificationType,
  WalletIdentity,
} from '@sovryn/ui';

import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { translations } from '../../../../../locales/i18n';

export const BitcoinWallet: FC = () => {
  const { addNotification } = useNotificationContext();
  const { connectors, connect } = useConnect();
  const { address: btcAddress } = useAccount();
  const { disconnect } = useDisconnect();
  const [isOpen, setIsOpen] = useState(false);

  const onCopyAddress = useCallback(() => {
    addNotification({
      type: NotificationType.success,
      title: t(translations.copyAddress),
      content: '',
      dismissible: true,
      id: nanoid(),
    });
  }, [addNotification]);

  useEffect(() => {
    if (btcAddress && isOpen) {
      setIsOpen(false);
    }
  }, [btcAddress, isOpen]);

  if (!btcAddress) {
    return (
      <>
        <Button
          text={t(translations.connectWalletButton.connectBTC)}
          onClick={() => setIsOpen(true)}
        />
        <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
          <DialogHeader
            onClose={() => setIsOpen(false)}
            title={t(translations.connectWalletButton.connectBTC)}
          />
          <DialogBody className="p-6">
            <div className="flex gap-2 my-4 flex-wrap">
              {connectors.map(connector => (
                <Button
                  key={connector.name}
                  text={connector.name}
                  onClick={() => connect({ connector })}
                />
              ))}
            </div>
          </DialogBody>
        </Dialog>
      </>
    );
  }
  return (
    <WalletIdentity
      onDisconnect={disconnect}
      onCopyAddress={onCopyAddress}
      address={btcAddress}
      dropdownClassName="z-[10000000]"
      submenuLabels={{
        copyAddress: t(translations.connectWalletButton.copyAddress),
        disconnect: t(translations.connectWalletButton.disconnect),
      }}
    />
  );
};
