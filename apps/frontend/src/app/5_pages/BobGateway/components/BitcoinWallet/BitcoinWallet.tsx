import { useAccount, useConnect, useDisconnect } from '@gobob/sats-wagmi';

import React, { FC, useCallback, useEffect, useState } from 'react';

import { t } from 'i18next';
import { nanoid } from 'nanoid';

import {
  Button,
  ButtonSize,
  ButtonStyle,
  Dialog,
  DialogBody,
  DialogHeader,
  NotificationType,
  WalletIdentity,
} from '@sovryn/ui';

import { useNotificationContext } from '../../../../../contexts/NotificationContext';
import { translations } from '../../../../../locales/i18n';
import { getBitcoinWalletIcon } from './BitcoinWallet.utils';

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
            <div className="flex flex-col gap-4 mx-8">
              {connectors.map(connector => (
                <Button
                  className="w-full flex items-center gap-2"
                  size={ButtonSize.large}
                  key={connector.id}
                  style={ButtonStyle.secondary}
                  text={
                    <>
                      {getBitcoinWalletIcon(connector) && (
                        <img
                          alt={connector.name}
                          src={getBitcoinWalletIcon(connector)}
                          width={24}
                        />
                      )}
                      {connector.name}
                    </>
                  }
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
